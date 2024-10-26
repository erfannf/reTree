import { TreeStructure } from './types';

export class TreeParser {
    parse(text: string): TreeStructure {
        const lines = text.split('\n').filter(line => line.trim());
        const root: TreeStructure = { name: '', children: [] };
        const stack: TreeStructure[] = [root];
        let previousLevel = -1;

        for (const line of lines) {
            const { level, name, type } = this.parseLine(line);

            while (stack.length - 1 > level) {
                stack.pop();
            }

            const node: TreeStructure = {
                name,
                type,
                children: []
            };

            stack[stack.length - 1].children.push(node);

            if (type === 'directory') {
                stack.push(node);
            }

            previousLevel = level;
        }

        return root;
    }

    private parseLine(line: string): { level: number, name: string, type: 'file' | 'directory' } {
        // Count leading spaces/tree characters to determine level
        const levelMatch = line.match(/^[\s│├└─]*/);
        const level = levelMatch ? Math.floor(levelMatch[0].length / 2) : 0;

        // Clean the line of tree characters
        const cleanedLine = line.replace(/[│├└─]/g, '').trim();

        // Determine if it's a directory or file
        const isDirectory = cleanedLine.endsWith('/');
        const name = isDirectory ? cleanedLine.slice(0, -1) : cleanedLine; // Remove trailing slash

        return {
            level,
            name,
            type: isDirectory ? 'directory' : 'file'
        };
    }
}