#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import clipboardy from 'clipboardy'; // Import clipboardy
import owo from './index.js'; // Assuming index.js is the compiled output

const program = new Command();

program
    .name('boykisser')
    .version('1.0.0') // Replace with your actual version
    .description(chalk.magenta('A CLI tool to display and copy boykisser ASCII art.'))
    .option('-c, --copy', 'Copy the ASCII art content to the clipboard instead of displaying it.')
    .option('-n, --nsfw', 'Allow NSFW ASCII art. This does not mean you will get NSFW every time, it just allows for NSFW art to be shown', false)
    .option('--name <name>, --id <name>', 'Get ASCII art by its file name (without .txt extension).')
    .option('--index <index>', 'Get ASCII art by its index.', (value) => parseInt(value, 10)) // Parse index as integer
    .action(async (options) => {
        try {
            const boykisser = new owo({ allowNSFW: options.nsfw });
            await boykisser.loadAsciiArt(); // Ensure art is loaded

            // Check if art loaded successfully
            if (boykisser.getAllAsciiArt().length === 0) {
                 console.error(chalk.red('Error: No ASCII art could be loaded. Please check the ascii directories.'));
                 process.exit(1);
            }


            let art: string | { fileName: string; content: string; };
            let sourceDescription = 'randomly'; // Default description
            let artContent: string; // Declare artContent here

            if (options.name) {
                sourceDescription = `by name "${options.name}"`;
                art = boykisser.getAsciiArtByName(options.name, { includeFilename: false });
                artContent = typeof art === 'string' ? art : art.content; // Assign here
            } else if (options.index !== undefined && !isNaN(options.index)) {
                 if (options.index < 0) {
                    console.error(chalk.red('Error: Index cannot be negative.'));
                    process.exit(1);
                 }
                sourceDescription = `by index ${options.index}`;
                art = boykisser.getAsciiArtByIndex(options.index, { includeFilename: false });
                artContent = typeof art === 'string' ? art : art.content; // Assign here
            } else {
                // Default: Get random
                art = boykisser.getRandomAsciiArt({ includeFilename: false });
                artContent = typeof art === 'string' ? art : art.content; // Assign here
            }


            if (options.copy) {
                // Use clipboardy directly
                await clipboardy.write(artContent);
                console.log(chalk.green(`Successfully copied ASCII art (${sourceDescription}${options.allowNsfw ? ' - NSFW allowed' : ''}) to clipboard!`));
            } else {
                 console.log(chalk.cyan(artContent));
                 console.log(chalk.dim(`
(Art source: ${sourceDescription}${options.allowNsfw ? ' - NSFW allowed' : ''})`)); // Add source info
            }
        } catch (error: any) {
            console.error(chalk.red(`Error: ${error.message}`));
            // Optionally show help on error or specific errors
            // program.outputHelp();
            process.exit(1);
        }
    });

// Enhance help display
program.on('--help', () => {
    console.log('');
    console.log(chalk.yellow('Examples:'));
    console.log(chalk.gray('  $ npx boykisser'));
    console.log(chalk.gray('  $ npx boykisser --copy'));
    console.log(chalk.gray('  $ npx boykisser --nsfw'));
    console.log(chalk.gray('  $ npx boykisser --name c41277f57a66a917'));
    console.log(chalk.gray('  $ npx boykisser --name c41277f57a66a917 --copy'));
    console.log(chalk.gray('  $ npx boykisser --index 0 --nsfw'));
    console.log(chalk.gray('  $ npx boykisser --index 5 --copy --nsfw'));

});

// Handle cases where no arguments might be provided, though .action covers the default
if (!process.argv.slice(2).length) {
   // If no arguments are given, the .action block will run by default.
   // You could uncomment the line below if you prefer showing help instead.
   // program.outputHelp();
}

program.parse(process.argv);

// If no specific action triggered by options like --name or --index,
// the main .action() block handles the default behavior (random art).
// Commander's default behavior when no command matches might show help,
// but our .action() on the base program handles the "no command" case.
