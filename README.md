# reTree - Directory Structure Creator

Create directory structures from ASCII tree markup in your markdown or text files.

## Features

- Convert ASCII tree structure into actual directories and files
- Automatically creates structure in the same directory as your .md/.txt file
- Support for both files and directories
- Undo capability for reverting changes
- Progress indication during creation

## Usage

1. Create or open a `.md` or `.txt` file with your directory structure:
```
project/
├── src/
│   ├── index.js
│   └── utils/
│       └── helper.js
├── tests/
│   └── test.js
└── package.json
```

2. Run the command:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "reTree: Create Directory Structure from Markup"
   - Press Enter

The directory structure will be created in the same location as your markdown/text file.

## Requirements

- Visual Studio Code version 1.60.0 or higher

## Extension Settings

This extension contributes the following settings:

* `reTree.overwriteProtection`: Enable/disable overwrite protection

## Known Issues

- None reported

## Release Notes

### 0.0.1

Initial release of reTree:
- Basic directory structure creation
- Undo functionality
- Progress indication