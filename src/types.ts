export interface TreeStructure {
    name: string;
    type?: 'file' | 'directory';
    children: TreeStructure[];
}

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}