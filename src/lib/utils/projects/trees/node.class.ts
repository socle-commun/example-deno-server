
import { Tree } from "./tree.class.ts";
import { join } from "path";
import { parse } from "jsr:@std/yaml";
import { esprima, recastParse, tsParser, jsonc } from '../../../ext/deps.ts'

export abstract class TreeNode {
  name: string;
  parent: FolderNode | Tree | null;

  constructor(name: string, parent: FolderNode | Tree | null = null) {
    this.name = name;
    this.parent = parent;
  }

  rename(newName: string): void {
    this.name = newName;
  }

  abstract clone(): TreeNode;
  abstract toJSON(): Record<string, any>

  get tree(): Tree {
    if (this.parent instanceof Tree) {
      return this.parent as Tree;
    } else if (this.parent) {
      return this.parent.tree as Tree;
    } else {
      console.dir(this, { depth: 1 });
      throw new Error("No tree found for this node");
    }
  }

  get relativePath(): string {
    let path = this.name;
    let currentNode: TreeNode | Tree | null = this.parent;
    while (currentNode && !(currentNode instanceof Tree)) {
      path = currentNode.name + "/" + path;
      currentNode = currentNode.parent;
    }
    return path;
  }

  get absolutePath(): string {
    return join(this.tree.rootPath, this.relativePath);
  }
}

export class FolderNode extends TreeNode {
  children: TreeNode[];

  constructor(name: string, parent: FolderNode | Tree | null = null) {
    super(name, parent);
    this.children = [];
  }

  toTree(): Tree {
    const path = join(this.tree.rootPath, this.relativePath);
    const tree = new Tree(path);
    tree.root = this.clone() as FolderNode;
    tree.root.parent = tree;
    return tree;
  }

  // Ajouter un enfant (fichier ou dossier)
  addChild(node: TreeNode) {
    this.children.push(node);
    node.parent = this;
  }

  // Recherche d'un enfant par son chemin
  find(path: string): TreeNode | null {
    if (this.name === path) return this;

    for (const child of this.children) {
      if (child.name === path) return child;
      if (child instanceof FolderNode) {
        const found = child.find(path);
        if (found) return found;
      }
    }

    return null;
  }

  clone(): FolderNode {
    const clonedFolder = new FolderNode(this.name, this.parent);

    // Cloner les enfants récursivement
    this.children.forEach((child) => {
      const clonedChild = child.clone();
      clonedFolder.addChild(clonedChild);
    });

    return clonedFolder;
  }

  walk(callback: (node: TreeNode) => void | false) {
    if (callback(this) !== false) {
      this.children.forEach((child) => {
        if (child instanceof FolderNode) {
          child.walk(callback);
        } else if (child instanceof FileNode) {
          callback(child);
        }
      });
    }
  }

  each(callback: (node: TreeNode) => void) {
    // Appel du callback pour chaque enfant
    this.children.forEach(callback);
  }

  getFiles(recurcive: boolean = true): FileNode[] {
    let files: FileNode[] = [];
    this.children.forEach((child) => {
      if (child instanceof FileNode) {
        files.push(child);
      } else if (child instanceof FolderNode && recurcive) {
        files = files.concat(child.getFiles()); // Récursion pour les sous-dossiers
      }
    });
    return files;
  }

  getFolders(): FolderNode[] {
    return this.children.filter((child) =>
      child instanceof FolderNode
    ) as FolderNode[];
  }

  contains(path: string): boolean {
    return this.children.some((child) => {
      if (child instanceof FileNode) {
        return child.name === path;
      } else if (child instanceof FolderNode) {
        return child.contains(path);
      }
    });
  }

  // Recherche d'un enfant par son chemin relatif
  findByPath(path: string): TreeNode | null {
    // Si le chemin correspond au nom du dossier, on retourne ce dossier
    if (this.relativePath === path) return this;

    // Recherche dans les enfants
    for (const child of this.children) {
      if (child.relativePath === path) {
        return child;
      }
      if (child instanceof FolderNode) {
        const found = child.findByPath(path);
        if (found) return found;
      }
    }

    return null;
  }

  // Supprimer un enfant par son chemin relatif
  removeChildByPath(path: string): boolean {
    // Trouver le nœud à supprimer
    const nodeToRemove = this.findByPath(path);

    if (nodeToRemove) {
      // Supprimer le nœud du tableau d'enfants du parent
      const index = this.children.indexOf(nodeToRemove);
      if (index !== -1) {
        this.children.splice(index, 1); // Retirer le nœud
        return true; // Suppression réussie
      }
    }

    return false; // Le nœud n'a pas été trouvé
  }

  addChildByPath(path: string, child: TreeNode): void {
    const p = path.replaceAll('\\', '/').split("/");
    const folderName = p.shift() as string;
    const node = this.find(folderName);
    if (node && node instanceof FolderNode) {
      return node.addChildByPath(p.join("/"), child);
    } else if (p.length === 0) {
      child.parent = this;
      this.addChild(child);
    } else {
      const node = new FolderNode(folderName, this);
      this.addChild(node);
      node.addChildByPath(p.join("/"), child);
    }
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      type: 'folder',
      path: this.relativePath,
      children: this.children.map(c => c.toJSON?.())
    };
  }
}

export class FileNode extends TreeNode {
  type: string;
  isTestFile: boolean;
  isTemplate: boolean;
  isExample: boolean;
  isSchema: boolean;

  _content: string | undefined;

  constructor(
    name: string,
    parent: FolderNode | null = null,
    private fileContent: () => string,
  ) {
    super(name, parent);
    this.type = name.split(".").pop() as string;
    this.isTestFile = name.indexOf(".test") > -1;
    this.isTemplate = name.indexOf(".template") > -1;
    this.isExample = name.indexOf(".example") > -1;
    this.isSchema = name.indexOf(".schema") > -1;
  }

  get content(): string {
    if (!this._content) {
      this._content = this.fileContent();
    }
    return this._content;
  }

  clone(): FileNode {
    return new FileNode(this.name, this.parent as FolderNode, this.fileContent);
  }

  parse<T>(): string | object | T {
    switch (this.type) {
      case "js":
        try {
          return esprima.parseModule(this.content, {
            comment: true,
            loc: true,
          });
        } catch (error) {
          console.error((error as Error).stack);
          throw new Error("AST parsing failed");
        }

      case "ts":
        try {
          return recastParse(this.content, { parser: tsParser });
        } catch (error) {
          console.error((error as Error).stack);
          throw new Error("AST parsing failed");
        }

      case "json":
      case "code-snippets":
      case "jsonc":
        try {
          return jsonc.parse(this.content);
        } catch (error) {
          console.error((error as Error).stack);
          throw new Error("JSON parsing failed");
        }
        
      case "yaml":
      case "yml":
        try {
          return parse(this.content) as T;
        } catch (error) {
          console.error((error as Error).stack);
          throw new Error("YAML parsing failed");
        }

      case "md":
        return this.content;

      default:
        throw new Error(`Parsing not implemented for file type: ${this.type}`);
    }
  }
  
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      type: 'file',
      path: this.relativePath,
      extension: this.type,
    };
  }
}
