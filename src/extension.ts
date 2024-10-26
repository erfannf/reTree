import * as vscode from 'vscode';
import * as path from 'path';
import { TreeParser } from './parser';
import { FileSystemManager } from './fileSystem';
import { TreeValidator } from './validator';
import { UndoManager } from './undoManager';

export function activate(context: vscode.ExtensionContext) {
    const parser = new TreeParser();
    const fsManager = new FileSystemManager();
    const validator = new TreeValidator();
    const undoManager = new UndoManager();

    let createCommand = vscode.commands.registerCommand(
        'reTree.createFromMarkup',
        async () => {
            try {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    throw new Error('No active text editor found');
                }

                const document = editor.document;
                if (!document.fileName.match(/\.(md|txt)$/)) {
                    throw new Error('Please open a .md or .txt file');
                }

                const text = document.getText();

                // Parse the structure
                const structure = parser.parse(text);

                // Remove the root directory from the structure
                const actualStructure = {
                    name: '',
                    type: 'directory' as const,
                    children: structure.children[0]?.children || []
                };

                // Validate the structure
                const validationResult = validator.validate(actualStructure);
                if (!validationResult.isValid) {
                    throw new Error(`Invalid structure: ${validationResult.error}`);
                }

                // Get the directory where the .md/.txt file is located
                const targetDir = path.dirname(document.fileName);

                // Create progress indicator
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Creating directory structure",
                    cancellable: true
                }, async (progress, token) => {
                    const created = await fsManager.createStructure(
                        actualStructure,
                        targetDir,
                        progress,
                        token
                    );

                    undoManager.registerCreation(created);
                    vscode.window.showInformationMessage('Directory structure created successfully!');
                });

            } catch (err) {
                const error = err as Error;
                vscode.window.showErrorMessage(`Error: ${error?.message || 'An unknown error occurred'}`);
            }
        }
    );

    let undoCommand = vscode.commands.registerCommand(
        'reTree.undoLastCreation',
        async () => {
            try {
                await undoManager.undo();
                vscode.window.showInformationMessage('Successfully undid last creation');
            } catch (err) {
                const error = err as Error;
                vscode.window.showErrorMessage(`Error during undo: ${error?.message || 'An unknown error occurred'}`);
            }
        }
    );

    context.subscriptions.push(createCommand, undoCommand);
}