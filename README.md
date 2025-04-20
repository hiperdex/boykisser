# boykisser

A simple utility to display or copy random (or specific) boykisser ASCII art.

Supports both programmatic use as a Node.js library and a CLI tool for your terminal.

## Installation

Install from npm:

```bash
npm install boykisser
```

Or run directly with npx (no install required):

```bash
npx boykisser
```

## Usage as a Library

Import the default export (class `owo`) in your TypeScript or JavaScript project:

```ts
import Boykisser from 'boykisser';

// Initialize; set allowNSFW to true to include NSFW art
const boykisser = new Boykisser({ allowNSFW: true });

// Get a random ASCII art string
const art = boykisser.getRandomAsciiArt();
console.log(art);

// Include filename metadata
const artWithName = boykisser.getRandomAsciiArt({ includeFilename: true });
console.log(artWithName.fileName, artWithName.content);

// Get specific art by filename (without .txt extension)
const byName = boykisser.getAsciiArtByName('c41277f57a66a917');
console.log(byName);

// Get art by index
const byIndex = boykisser.getAsciiArtByIndex(0);
console.log(byIndex);

// Work with clipboard
boykisser.copyRandomAsciiArtToClipboard();
boykisser.copyAsciiArtByNameToClipboard('c41277f57a66a917');
boykisser.copyAsciiArtByIndexToClipboard(0);
```

### API Reference

#### `new Boykisser(options?: { allowNSFW: boolean })`
- `allowNSFW` (default `false`): include NSFW art when fetching.

#### `getAllAsciiArt(): { fileName: string; content: string }[]`
Returns an array of all loaded art objects.

#### `getRandomAsciiArt(options?: { includeFilename: boolean }): string | { fileName: string; content: string }`
Fetch a random art; pass `{ includeFilename: true }` to receive an object with filename.

#### `getAsciiArtByName(name: string, options?: { includeFilename: boolean }): string | { fileName: string; content: string }`
Fetch art by its filename (omit the `.txt` extension).

#### `getAsciiArtByIndex(index: number, options?: { includeFilename: boolean }): string | { fileName: string; content: string }`
Fetch art by its zero-based index.

#### Clipboard Helpers
- `copyRandomAsciiArtToClipboard(): void`
- `copyAsciiArtByNameToClipboard(name: string): void`
- `copyAsciiArtByIndexToClipboard(index: number): void`

### Environment Variables
Set `BOYKISSER_ALLOW_NSFW=true` to allow NSFW art if you prefer not to pass the option in code.

---

## Usage as a CLI Tool

After installation or via npx, run:

```bash
boykisser [options]
```

```
Usage: boykisser [options]

Options:
  -c, --copy             Copy the ASCII art content to the clipboard instead of displaying it.
  -n, --nsfw             Allow NSFW ASCII art.
  --name <name>, --id <name>    Get ASCII art by its file name (without `.txt`).
  --index <index>        Get ASCII art by its index (zero-based).
  -V, --version          Show version number.
  -h, --help             Display help for command.
```

### Examples

```bash
# Display a random art
npx boykisser

# Copy a random art to clipboard
npx boykisser --copy

# Include NSFW art in rotation
npx boykisser --nsfw

# Get art by filename
npx boykisser --name c41277f57a66a917

# Copy art by filename
npx boykisser --name c41277f57a66a917 --copy

# Get art by index
npx boykisser --index 0 --nsfw

# Copy art by index with NSFW allowed
npx boykisser --index 5 --copy --nsfw
```

---

## Contributing
Contributions, issues, and feature requests are welcome!

Feel free to check [issues](https://github.com/fishylunar/boykisser/issues) or submit a pull request.

## License

MIT © fishylunar
