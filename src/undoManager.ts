import * as fs from 'fs/promises';
import * as path from 'path';

export class UndoManager {
    private lastOperation: string[] | null = null;

    registerCreation(paths: string[]): void {
        this.lastOperation = paths;
    }

    async undo(): Promise<void> {
        if (!this.lastOperation) {
            throw new Error('No operation to undo');
        }

        // Remove in reverse order (files before directories)
        const paths = [...this.lastOperation].reverse();

        for (const path of paths) {
            try {
                const stats = await fs.stat(path);
                if (stats.isDirectory()) {
                    await fs.rmdir(path);
                } else {
                    await fs.unlink(path);
                }
            } catch (err) {
                const error = err as Error;
                console.error(`Error undoing creation of ${path}: ${error?.message || 'An unknown error occurred'}`);
            }
        }

        this.lastOperation = null;
    }
}