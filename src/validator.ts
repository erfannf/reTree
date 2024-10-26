import { TreeStructure, ValidationResult } from './types';
import * as path from 'path';

export class TreeValidator {
    validate(structure: TreeStructure): ValidationResult {
        try {
            this.validateNode(structure);
            return { isValid: true };
        } catch (err) {
            const error = err as Error;
            return { isValid: false, error: error?.message || 'An unknown error occurred' };
        }
    }

    private validateNode(node: TreeStructure, parentPath: string = ''): void {
        if (!node.name && !parentPath) {
            // Root node
            for (const child of node.children) {
                this.validateNode(child, '');
            }
            return;
        }

        // Check for invalid characters based on OS
        const isWindows = process.platform === 'win32';
        const invalidCharsRegex = isWindows ?
            /[<>:"|?*\x00-\x1F]/g :
            /[\x00/]/g;

        if (invalidCharsRegex.test(node.name)) {
            throw new Error(`Invalid characters in name: ${node.name}`);
        }

        // Check path length
        const fullPath = path.join(parentPath, node.name);
        if (fullPath.length > (isWindows ? 260 : 4096)) {
            throw new Error(`Path too long: ${fullPath}`);
        }

        // Validate children
        for (const child of node.children) {
            this.validateNode(child, fullPath);
        }
    }
}