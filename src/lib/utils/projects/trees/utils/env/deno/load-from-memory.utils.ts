import { Tree, FileNode, FolderNode } from '../../../mod.ts'

interface InMemoryFile {
    path: string; 
    content: Uint8Array;
}

export default async function buildFileTreeFromMemory(files: InMemoryFile[]): Promise<Tree> {
    const tree = new Tree('/'); 

    for (const file of files) {
        const parts = file.path.split('/');
        let currentFolder = tree.root;

        // Parcours les dossiers intermédiaires
        // Ne pas récupérer le dossier racine (i = 1)
        for (let i = 1; i < parts.length - 1; i++) {
            const part = parts[i];
            let folderNode = currentFolder.children.find(child => child.name === part) as FolderNode;
            if (!folderNode) {
                folderNode = new FolderNode(part, currentFolder);
                currentFolder.addChild(folderNode);
            }
            currentFolder = folderNode;
        }

        // Ajoute le fichier à la fin
        const fileName = parts[parts.length - 1];
        const fileNode = new FileNode(
            fileName,
            currentFolder,
            () => new TextDecoder().decode(file.content) 
        );
        currentFolder.addChild(fileNode);
    }

    return tree;
}
