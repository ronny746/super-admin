import { readFileSync } from 'fs';
const docx = require('html-docx-js');
const html = "<h1>Hello</h1>";
const converted = docx.asBlob(html);
console.log(converted);
