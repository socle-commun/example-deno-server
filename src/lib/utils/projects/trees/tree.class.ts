import { FileNode, FolderNode, TreeNode } from "./node.class.ts";

export class Tree {
  root: FolderNode;

  constructor(public rootPath: string) {
    // Initialisation avec un dossier racine
    this.root = new FolderNode(".");
    this.root.parent = this;
  }

  // Recherche d'un nœud par son chemin relatif
  findNode(path: string): TreeNode | null {
    return this.root.find(path);
  }

  // Parcours récursif des nœuds de l'arborescence
  walk(callback: (node: TreeNode) => void) {
    this.root.walk(callback); // Utilisation de la méthode `walk` de FolderNode
  }

  // Cloner l'arborescence entière
  public clone(): Tree {
    const cloneTree = new Tree(this.rootPath); // Créer un nouvel arbre avec la même racine
    cloneTree.root = this.root.clone();
    return cloneTree;
  }

  // Ajouter un nœud par chemin relatif
  addChildByPath(path: string, child: TreeNode): void {
    return this.root.addChildByPath(path, child); // Utilisation de `addChildByPath` sur la racine
  }

  // Supprimer un enfant par chemin relatif
  removeChildByPath(path: string): boolean {
    return this.root.removeChildByPath(path); // Utilisation de `removeChildByPath` sur la racine
  }

  merge(other: Tree): void {
    this._mergeFolder(this.root, other.root);
  }

  private _mergeFolder(target: FolderNode, source: FolderNode): void {
    for (const sourceChild of source.children) {
      const existing = target.children.find((child) => child.name === sourceChild.name);

      // Si le noeud n'existe pas, on clone et on ajoute
      if (!existing) {
        const cloned = sourceChild.clone();
        target.addChild(cloned);
        continue;
      }

      // Si c'est un dossier, on fusionne récursivement
      if (sourceChild instanceof FolderNode && existing instanceof FolderNode) {
        this._mergeFolder(existing, sourceChild);
        continue;
      }

      // Si c'est un fichier et qu'il y a collision de nom, on remplace
      if (sourceChild instanceof FileNode && existing instanceof FileNode) {
        const index = target.children.indexOf(existing);
        if (index !== -1) {
          target.children.splice(index, 1, sourceChild.clone());
        }
      }

      // Si types différents (ex: fichier vs dossier), on écrase par sécurité
      if (
        (sourceChild instanceof FolderNode && existing instanceof FileNode) ||
        (sourceChild instanceof FileNode && existing instanceof FolderNode)
      ) {
        const index = target.children.indexOf(existing);
        if (index !== -1) {
          target.children.splice(index, 1, sourceChild.clone());
        }
      }
    }
  }

  public toJSON (): Record<string, any> {
    return {
      path: this.rootPath,
      root: this.root.toJSON()
    }
  }
}
