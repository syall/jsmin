#!/usr/bin/env node

/**
 * JavaScript Minifier (jsmin)
 * Author: Steven Yuan (syall)
 * Date: 1/15/2020
 *
 * Usage: <path/to/jsmin> <path/to/file>(.<ext>)?
 *
 * jsmin for source code using "use strict"; style,
 * which will write to <path/to/file>.min(.<ext>)?.
 *
 * The minifier features these modifications:
 *  - Remove nonessential Control Characters
 *  - Keep Strings Identical
 *  - Strip Comments
 *  - Keep Shebang
 *
 * Fun Fact: The source code is written without '{' or '}'
 */

// Usage
if (process.argv.length !== 3)
    console.error(`Usage: <path/to/jsmin> <path/to/file>(.<ext>)?`) ||
        process.exit(1);

// Import File System Dependencies
const fs = require('fs');

// Read File
const name = process.argv.pop(), file = fs.readFileSync(name, 'utf8');

/** Utility Functions */
// is: checks equality of c and m
const is = c => m => c === m;
// vary: checks for variables
const vary = c =>
    'a' <= c && c <= 'z' ||
    'A' <= c && c <= 'Z' ||
    '0' <= c && c <= '9' ||
    c === '$' || c === '_';
// str: checks for quotation
const str = c =>
    c === "'" || c === '`' || c === '"';

/** Loop: Minified Content and Past character, Temporary index */
let minified = p = '', t = 0;
for (let i = 0; i < file.length; i++)
    // Line Comment
    if (is(file[i])('/') && is(file[i + 1])('/'))
        while (!is(file[++i])('\n'));
    // Block Comment
    else if (is(file[i])('/') && is(file[i + 1])('*'))
        while (!(is(file[i - 1])('*') && is(file[i])('/'))) i++;
    // Shebang
    else if (is(file[i])('#'))
        while (!is(file[i - 1])('\n')) minified += file[i++];
    // Control Characters inbetween Variables
    else if (file[i] <= ' ' && !(vary(p) && vary(file[i + 1])))
        continue;
    // Strings
    else if (str(file[i]) && (p = file[i]))
        (t = file.indexOf(p, i + 1)) &&
            (minified += file.slice(i, t + 1)) &&
            (i = t);
    // Anything Else
    else minified += file[i] && (p = file[i]);

// Index of last . of file
const dot = name.lastIndexOf('.');
// Minified File Name
const miniName = dot !== -1
    ? name.slice(0, dot).concat('.min', name.slice(dot))
    : name.concat('.min');

// Write Minified File
fs.writeFileSync(miniName, minified);

/** Console Result */
console.log(name.concat('     ', 'size: ', fs.statSync(name).size));
console.log(miniName.concat(' size: ', fs.statSync(miniName).size));
