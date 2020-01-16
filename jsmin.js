#!/usr/bin/env node

// Usage
if (process.argv.length !== 3)
    console.error(`Usage: <path/to/jsmin.js> <path/to/file>(.<ext>)?`) ||
        process.exit(1);

// Import File System Dependencies
const fs = require('fs');

// Read File
const name = process.argv.pop();
const file = fs.readFileSync(name, 'utf8');

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
const str = c => c === "'" || c === '`' || c === '"';

/** Loop: Minified Content and Past character, Temporary index */
let minified = p = '', t = 0;
for (let i = 0; i < file.length; i++)
    // Line Comment
    if (is(file[i] + file[i + 1])('//'))
        (t = file.indexOf('\n', i)) && (i = t);
    // Block Comment
    else if (is(file[i] + file[i + 1])('/*'))
        (t = file.indexOf('*/', i + 1)) && (i = t + 1);
    // Shebang
    else if (is(file[i])('#')) (t = file.indexOf('\n', i)) &&
        (minified += file.slice(i, t + 1)) && (i = t);
    // Control Characters inbetween Variables
    else if (file[i] <= ' ' && !(vary(p) && vary(file[i + 1])))
        continue;
    // Strings
    else if (str(file[i])) (t = file.indexOf(file[i], i + 1)) &&
        (minified += file.slice(i, t + 1)) && (i = t);
    // Anything Else
    else (minified += file[i]) && (p = file[i]);

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
