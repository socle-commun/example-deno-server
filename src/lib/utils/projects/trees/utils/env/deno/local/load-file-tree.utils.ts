import { FileNode, FolderNode, Tree, TreeNode } from "../../../../mod.ts";
import { join } from "../../../../../../../ext/deps.ts";

/**
 * 📂 Charger les fichiers d'un répertoire et construire l'arborescence de manière récursive.
 *
 * 🧩 Fonctionnalités :
 * - Parcours récursif des fichiers dans un répertoire.
 * - Structure l'arborescence en utilisant Tree, FolderNode et FileNode.
 * - Charge dynamiquement le contenu des fichiers.
 *
 * 📦 Entrée :
 * - `dir` : Le répertoire à parcourir.
 *
 * 📤 Sortie :
 * - Retourne un objet `Tree` représentant l'arborescence des fichiers.
 */
export function loadFileTree(dir: string): Tree {
  // Crée un objet Tree avec la racine initiale
  const tree = new Tree(dir);

  // Fonction récursive pour parcourir les dossiers et fichiers
  function exploreDirectory(currentPath: string, currentFolder: FolderNode) {
    for (const entry of Deno.readDirSync(currentPath)) {
      const fullPath = join(currentPath, entry.name);
      if (entry.isDirectory) {
        // Si c'est un dossier, ajouter un nœud FolderNode
        let folderNode = currentFolder.children.find((child: TreeNode) =>
          child.name === entry.name
        );
        if (!folderNode) {
          folderNode = new FolderNode(entry.name, currentFolder);
          currentFolder.addChild(folderNode);
        }

        // Appel récursif pour explorer le sous-dossier
        exploreDirectory(fullPath, folderNode as FolderNode);
      } else if (entry.isFile) {
        // Si c'est un fichier, ajouter un nœud FileNode
        const fileNode = new FileNode(
          entry.name,
          currentFolder,
          () => Deno.readTextFileSync(fullPath),
        );
        currentFolder.addChild(fileNode); // Ajouter le fichier au dossier courant
      }
    }
  }

  // Commencer l'exploration à partir du répertoire racine
  exploreDirectory(dir, tree.root);

  return tree;
}
