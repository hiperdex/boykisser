import fs from 'fs';
import clipboardy from 'clipboardy';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path'; // Import path module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


interface MethodOptions {
    includeFilename: boolean;
}

interface Options {
    allowNSFW: boolean;
}

interface AsciiArt {
    fileName: string;
    content: string;
}

export class owo {

    private loadedAsciiArt: AsciiArt[] = [];
    public options: Options;

    constructor(options?: Options) {
        let allowNSFW = false; // Default to false
        if (options && typeof options.allowNSFW === 'boolean') {
            allowNSFW = options.allowNSFW;
        } else if (process.env.BOYKISSER_ALLOW_NSFW) {
            // Check env var if option not provided
            allowNSFW = process.env.BOYKISSER_ALLOW_NSFW.toLowerCase() === 'true';
        }

        // Validate the final allowNSFW value
        if (typeof allowNSFW !== 'boolean') {
            throw new Error('allowNSFW must resolve to a boolean');
        }

        this.options = { allowNSFW }; // Use the resolved value
        this.loadAsciiArt();
    }

    async loadAsciiArt() {
        // Use path.join for cross-platform compatibility and __dirname
        const baseDir = path.join(__dirname, 'ascii'); // Assuming ascii is one level up from src/dist
        const nsfwDir = path.join(baseDir, 'nsfw');
        const sfwDir = path.join(baseDir, 'sfw');
        const dirsToLoad = this.options.allowNSFW ? [nsfwDir, sfwDir] : [sfwDir];
        for (const dir of dirsToLoad) {
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    if (file.endsWith('.txt')) {
                        const filePath = path.join(dir, file); // Use path.join
                        const content = fs.readFileSync(filePath, 'utf-8');
                        this.loadedAsciiArt.push({ fileName: file, content });
                    }
                }
            } else {
                // Use console.error for warnings/errors
                console.error(`Warning: Directory ${dir} does not exist.`);
            }
        }
        // Add a check if no art was loaded
        if (this.loadedAsciiArt.length === 0) {
            console.error("Error: No ASCII art files found. Looked in:", dirsToLoad.join(', '));
            // Optionally, throw an error or exit
            // throw new Error("No ASCII art files found.");
        }
    }

    /**
     * getAllAsciiArt
     * @returns {AsciiArt[]} - Returns an array of all loaded ascii art objects.
     * Each object contains the file name and the content of the ascii art.
     */
    getAllAsciiArt(): AsciiArt[] {
        return this.loadedAsciiArt;
    }

    /**
     * getRandomAsciiArt
     * @param {MethodOptions} options - Options to include the filename in the output.
     * @returns {string | AsciiArt} - Returns a random ascii art string or object based on the options.
     */
    getRandomAsciiArt(options?: MethodOptions): string | AsciiArt {
        const randomIndex = Math.floor(Math.random() * this.loadedAsciiArt.length);
        const asciiArt = this.loadedAsciiArt[randomIndex];
        if (options && options.includeFilename) {
            return asciiArt
        }
        return asciiArt.content;
    }

    /**
     * getAsciiArtByName
     * @param {string} name - The name of the ascii art file to retrieve.
     * @param {MethodOptions} options - Options to include the filename in the output.
     * @returns {string | AsciiArt} - Returns the ascii art string or object based on the options.
     */
    getAsciiArtByName(name: string, options?: MethodOptions): string | AsciiArt {
        const shouldAddExt = !name.endsWith('.txt');
        if (shouldAddExt) {
            name += '.txt';
        }
        const asciiArt = this.loadedAsciiArt.find(art => art.fileName === name);
        if (asciiArt) {
            if (options && options.includeFilename) {
                return asciiArt
            }
            return asciiArt.content;
        } else {
            throw new Error(`Ascii art with name ${name} not found.`);
        }
    }

    /**
     * getAsciiArtByIndex
     * @param {number} index - The index of the ascii art to retrieve.
     * @param {MethodOptions} options - Options to include the filename in the output.
     * @returns {string | AsciiArt} - Returns the ascii art string or object based on the options.
     */
    getAsciiArtByIndex(index: number, options?: MethodOptions): string | AsciiArt {
        if (index < 0 || index >= this.loadedAsciiArt.length) {
            throw new Error(`Index ${index} out of bounds.`);
        }
        if (options && options.includeFilename) {
            return this.loadedAsciiArt[index]
        }
        return this.loadedAsciiArt[index].content;
    }


    /**
     * copyRandomAsciiArtToClipboard
     * @description Copies a random ascii art to the clipboard.
     */
    copyRandomAsciiArtToClipboard(): void {
        const randomAsciiArt = this.getRandomAsciiArt({ includeFilename: false });
        clipboardy.writeSync((randomAsciiArt as string));
    }


    /**
     * copyAsciiArtByNameToClipboard
     * @param {string} name - The name of the ascii art file to copy to the clipboard.
     * @description Copies the ascii art with the given name to the clipboard.
     */
    copyAsciiArtByNameToClipboard(name: string): void {
        const asciiArt = this.getAsciiArtByName(name, { includeFilename: false });
        clipboardy.writeSync((asciiArt as string));
    }

    /**
     * copyAsciiArtByIndexToClipboard
     * @param {number} index - The index of the ascii art to copy to the clipboard.
     * @description Copies the ascii art with the given index to the clipboard.
     */
    copyAsciiArtByIndexToClipboard(index: number): void {
        const asciiArt = this.getAsciiArtByIndex(index, { includeFilename: false });
        clipboardy.writeSync((asciiArt as string));
    }

}

export default owo;