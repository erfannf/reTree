import { TreeStructure } from './types';

export class TreeParser {
    parse(text: string): TreeStructure {
        const lines = text.split('\n').filter(line => line.trim());
        const root: TreeStructure = {
            name: '',
            type: 'directory',
            children: []
        };

        if (lines.length === 0) {
            return root;
        }

        // Handle root directory
        const rootDir: TreeStructure = {
            name: lines[0].replace('/', ''),
            type: 'directory',
            children: []
        };
        root.children.push(rootDir);

        // Stack to keep track of parent nodes at each level
        const parentStack: TreeStructure[] = [rootDir];
        let prevLevel = 0;

        // Process each line after root
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const { level, name, isDirectory } = this.parseLine(line);

            const node: TreeStructure = {
                name: name.trim(), // Ensure name is clean
                type: isDirectory ? 'directory' : 'file',
                children: []
            };

            // Adjust the stack based on current level
            if (level > prevLevel) {
                // Going deeper, previous node becomes parent
                const parent = parentStack[parentStack.length - 1];
                if (parent.type === 'directory' && parent.children.length > 0) {
                    parentStack.push(parent.children[parent.children.length - 1]);
                }
            } else if (level < prevLevel) {
                // Going back up, pop the stack until we're at the right level
                while (parentStack.length > level + 1) {
                    parentStack.pop();
                }
            }

            // Add node to current parent
            parentStack[level].children.push(node);
            prevLevel = level;
        }

        return root;
    }

    private parseLine(line: string): { level: number; name: string; isDirectory: boolean } {
        // Calculate level based on tree characters
        let level = 0;
        const prefixMatch = line.match(/^[│\s]*[├└]/);

        if (prefixMatch) {
            // Each level is represented by either "│   " or "    ", which is 4 characters
            level = Math.floor(prefixMatch[0].length / 4);
        }

        // Clean the content and check if it's a directory
        // Remove all tree characters including ├, └, ─, │
        const content = line
            .replace(/^[│\s]*[├└]─\s*/, '') // Remove prefix tree characters
            .replace(/[│├└─]/g, '')         // Remove any remaining tree characters
            .trim();                        // Clean up whitespace

        const isDirectory = content.endsWith('/');
        const name = isDirectory ? content.slice(0, -1) : content;

        return { level, name, isDirectory };
    }
}