import fs from 'fs';

const p = fs.readFileSync(`${process.cwd()}/package.json`).toString();
console.log(JSON.parse(p).name);

