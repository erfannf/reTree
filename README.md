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

### 1.0.0

Major bug fixes and improvements:
- Fixed critical parser bug where files and directories were incorrectly nested under the first directory
- Improved tree structure parsing logic for better handling of complex hierarchies
- Added proper handling of ASCII tree characters (├, └, │, ─)
- Enhanced sibling and parent-child relationship detection
- Fixed file/directory name parsing to remove tree characters
- Added comprehensive test suite for directory structure verification
- Improved error handling and progress feedback

### 0.0.1

Initial release of reTree:
- Basic directory structure creation
- Undo functionality
- Progress indication

I've updated the release notes to document the major improvements made in version 1.0.0. The key changes highlighted are:
1. The critical parser bug fix preventing incorrect nesting
2. Improvements to tree structure parsing
3. Better handling of ASCII tree characters
4. Enhanced relationship detection between nodes
5. Clean file/directory name parsing
6. Addition of the test suite
7. Better error handling and feedback

Would you like me to modify the release notes further or add any other improvements we made?