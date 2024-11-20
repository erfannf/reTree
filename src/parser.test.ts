import * as assert from 'assert';
import { TreeParser } from './parser';
import { TreeStructure } from './types';

describe('TreeParser', () => {
    let parser: TreeParser;

    beforeEach(() => {
        parser = new TreeParser();
    });

    it('should correctly parse create-react-app structure', () => {
        const input = `my-react-app/
├── README.md
├── node_modules/
├── package.json
├── package-lock.json
├── .gitignore
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
└── src/
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── reportWebVitals.js
    ├── setupTests.js
    └── components/
        ├── Header/
        │   ├── Header.js
        │   ├── Header.css
        │   └── Header.test.js
        └── Footer/
            ├── Footer.js
            ├── Footer.css
            └── Footer.test.js`;

        const result = parser.parse(input);
        const rootDir = result.children[0];

        // Debug output
        console.log(JSON.stringify(rootDir, null, 2));

        // Verify root structure
        assert.strictEqual(rootDir.name, 'my-react-app');
        assert.strictEqual(rootDir.children.length, 7); // All root level items

        // Verify immediate children
        const rootItems = rootDir.children.map(c => c.name);
        assert.deepStrictEqual(
            rootItems.sort(),
            [
                'README.md',
                'node_modules',
                'package.json',
                'package-lock.json',
                '.gitignore',
                'public',
                'src'
            ].sort()
        );

        // Verify public directory
        const publicDir = rootDir.children.find(c => c.name === 'public');
        assert.ok(publicDir);
        assert.strictEqual(publicDir.children.length, 4);

        // Verify src directory
        const srcDir = rootDir.children.find(c => c.name === 'src');
        assert.ok(srcDir);
        assert.strictEqual(srcDir.children.length, 9);

        // Verify components structure
        const componentsDir = srcDir.children.find(c => c.name === 'components');
        assert.ok(componentsDir);
        assert.strictEqual(componentsDir.children.length, 2);

        // Verify Header component
        const headerDir = componentsDir.children.find(c => c.name === 'Header');
        assert.ok(headerDir);
        assert.strictEqual(headerDir.children.length, 3);

        // Verify Footer component
        const footerDir = componentsDir.children.find(c => c.name === 'Footer');
        assert.ok(footerDir);
        assert.strictEqual(footerDir.children.length, 3);
    });
});