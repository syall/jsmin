#!/usr/bin/env node
if (process.argv.length !== 3)
    console.error(`Usage: <path/to/jsmin.js> <path/to/file>(.<ext>)?`) ||
        process.exit(1);
const fs = require('fs');
const name = process.argv.pop();
const file = fs.readFileSync(name, 'utf8');
const is = c => m => c === m;
const vary = c =>
    'a' <= c && c <= 'z' ||
    'A' <= c && c <= 'Z' ||
    '0' <= c && c <= '9' ||
    c === '$' || c === '_';
const str = c => c === "'" || c === '`' || c === '"';
let minified = p = '', t = 0;
for (let i = 0; i < file.length; i++)
    if (is(file[i] + file[i + 1])('//'))
        (t = file.indexOf('\n', i)) && (i = t);
    else if (is(file[i] + file[i + 1])('/*'))
        (t = file.indexOf('*/', i + 1)) && (i = t + 1);
    else if (is(file[i])('#')) (t = file.indexOf('\n', i)) &&
        (minified += file.slice(i, t + 1)) && (i = t);
    else if (file[i] <= ' ' && !(vary(p) && vary(file[i + 1])))
        continue;
    else if (str(file[i])) (t = file.indexOf(file[i], i + 1)) &&
        (minified += file.slice(i, t + 1)) && (i = t);
    else (minified += file[i]) && (p = file[i]);
const dot = name.lastIndexOf('.');
const miniName = dot !== -1
    ? name.slice(0, dot).concat('.min', name.slice(dot))
    : name.concat('.min');
fs.writeFileSync(miniName, minified);
console.log(name.concat('     ', 'size: ', fs.statSync(name).size));
console.log(miniName.concat(' size: ', fs.statSync(miniName).size));
