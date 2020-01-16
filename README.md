# jsmin.js

## Overview

`jsmin.js` is a JavaScript Minifier given the target file uses `"use strict";` style.

## Features

The minifier applies these transformations:

- Removal of Nonessentials
- Removal of Comments
- Preservation of Shebangs
- Preservation of Strings

## Usage

```shell
./<path/to/jsmin.js> <path/to/file>(.<ext>)?
```

## Motivation

In my exploration of language parsing, I found [Douglas Crockford's work](https://www.crockford.com) where there is a [JavaScript Minifier](https://www.crockford.com/jsmin.html) that he implemented in C.

However, some of the code was verbose for a simple utility, so I wanted to write some clever (**not clean**) code that would produce a similar result.

Through multiple tests, I had to battle the syntax of JavaScript as I stripped nonessential elements of existing programs to produce unreadable functionally equivalent code.

However, this is not an obfuscator, as I decided that I did not want to change the `Object` output, such as `console.log({ a })`, in which changing the name of the variables would change the output (however, that might be good for another project idea).

Side Note: As a personal challenge, there are no `{` or `}` characters in the source code!

```shell
# Running jsmin.js on jsmin.js
./jsmin.js jsmin.js
jsmin.js     size: 1898
jsmin.min.js size: 1117
```

Without any comments or blank lines, the [source code](https://github.com/syall/jsmin.js/blob/master/jsmin.simp.js) comes out to 34 LOC which is much less than [Crockford's jsmin.c](https://github.com/douglascrockford/JSMin/blob/master/jsmin.c) with 319 LOC (although it includes a large comment block and blank lines, but is still significantly smaller overall).

## Example

Using the same code snippet in [Crockford's blog post](https://www.crockford.com/jsmin.html), these are the results using `jsmin.js`:

```shell
./jsmin.js example/is.js
example/is.js     size: 990
example/is.min.js size: 435
```

### Original

```javascript
// (c) 2001 Douglas Crockford
// 2001 June 3


// is

// The 'is' object is used to identify the browser.  Every browser edition
// identifies itself, but there is no standard way of doing it, and some of
// the identification is deceptive. This is because the authors of web
// browsers are liars. For example, Microsoft's IE browsers claim to be
// Mozilla 4. Netscape 6 claims to be version 5. This code is seriously
// wrongheaded and obsolete.

var is = {
    ie: navigator.appName == 'Microsoft Internet Explorer',
    java: navigator.javaEnabled(),
    ns: navigator.appName == 'Netscape',
    ua: navigator.userAgent.toLowerCase(),
    version: parseFloat(navigator.appVersion.substr(21)) ||
        parseFloat(navigator.appVersion),
    win: navigator.platform == 'Win32'
};
is.mac = is.ua.indexOf('mac') >= 0;
if (is.ua.indexOf('opera') >= 0) {
    is.ie = is.ns = false;
    is.opera = true;
}
if (is.ua.indexOf('gecko') >= 0) {
    is.ie = is.ns = false;
    is.gecko = true;
}

```

### Minified

```javascript
var is={ie:navigator.appName=='Microsoft Internet Explorer',java:navigator.javaEnabled(),ns:navigator.appName=='Netscape',ua:navigator.userAgent.toLowerCase(),version:parseFloat(navigator.appVersion.substr(21))||parseFloat(navigator.appVersion),win:navigator.platform=='Win32'};is.mac=is.ua.indexOf('mac')>=0;if(is.ua.indexOf('opera')>=0){is.ie=is.ns=false;is.opera=true;}if(is.ua.indexOf('gecko')>=0){is.ie=is.ns=false;is.gecko=true;}
```
