import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { TreeStructure } from './types';

export class FileSystemManager {
    async createStructure(
        structure: TreeStructure,
        basePath: string,
        progress: vscode.Progress<{ message?: string; increment?: number }>,
        token: vscode.CancellationToken
    ): Promise<string[]> {
        const created: string[] = [];
        const total = this.countNodes(structure);
        let current = 0;

        await this.createNode(structure, basePath, created, progress, token, total, current);
        return created;
    }

    private async createNode(
        node: TreeStructure,
        parentPath: string,
        created: string[],
        progress: vscode.Progress<{ message?: string; increment?: number }>,
        token: vscode.CancellationToken,
        total: number,
        current: number
    ): Promise<void> {
        if (token.isCancellationRequested) {
            throw new Error('Operation cancelled');
        }

        if (!node.name) {
            // Root node
            for (const child of node.children) {
                await this.createNode(child, parentPath, created, progress, token, total, ++current);
            }
            return;
        }

        const fullPath = path.join(parentPath, node.name);

        try {
            if (node.type === 'directory') {
                await fs.mkdir(fullPath, { recursive: true });
                created.push(fullPath);

                for (const child of node.children) {
                    await this.createNode(child, fullPath, created, progress, token, total, ++current);
                }
            } else {
                // Ensure parent directory exists
                await fs.mkdir(path.dirname(fullPath), { recursive: true });
                await fs.writeFile(fullPath, '');
                created.push(fullPath);
            }

            progress.report({
                message: `Creating: ${node.name}`,
                increment: (1 / total) * 100
            });
        } catch (err) {
            const error = err as Error;
            throw new Error(`Failed to create ${node.name}: ${error?.message || 'An unknown error occurred'}`);
        }
    }

    private countNodes(node: TreeStructure): number {
        let count = node.name ? 1 : 0;
        for (const child of node.children) {
            count += this.countNodes(child);
        }
        return count;
    }
}