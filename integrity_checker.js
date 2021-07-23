/**
 * Loads the integrity.json into memory.
 * Creates a new hash of all files and compares the results
 * to integrity.json.
 */
 const fs = require("fs");
 const { resolve } = require('path');
 const { readdir } = require('fs').promises;
 const crypto = require('crypto')
 const hashArray = [];
 let integrityDataHash = null;
 let integritySum = crypto.createHash('sha256');
 const { exec } = require("child_process");

 try{
    let data = fs.readFileSync('./integrity.json', 'utf8');
    integritySum.update(data);
    integrityDataHash = integritySum.digest('hex');
 }catch(error){
     throw Error(error);
 };

 async function* getFiles(dir) {
     const dirents = await readdir(dir, { withFileTypes: true });
     for (const dirent of dirents) {
       const res = resolve(dir, dirent.name);
       if (dirent.isDirectory()) {
         yield* getFiles(res);
       } else {
         yield res;
       }
     }
 }
 
;(async () => {
    for await (const f of getFiles('.')) {
        if(
            f.indexOf('node_modules') === -1 && 
            f.indexOf('.git') === -1 && 
            f.indexOf('.gitignore') === -1 &&
            f.indexOf('lock') === -1 &&
            f.indexOf('integrity.json') === -1
        ){
            let hashSum = crypto.createHash('sha256');
            let fileBuffer = fs.readFileSync(`${f}`);
            hashSum.update(fileBuffer);
            let hex = hashSum.digest('hex')
            hashArray.push(hex);
        }
    }

    let hashArraySum = crypto.createHash('sha256');
    hashArraySum.update(JSON.stringify(hashArray));
    let hashArrayHash = hashArraySum.digest('hex')

    console.log(hashArrayHash)
    console.log(integrityDataHash)

    try{
        if(hashArrayHash !== integrityDataHash){
            throw new Error('The integrity of this software is compromised. Please contact the author for a valid copy.');
        }else{
            console.log('INTEGRITY CHECK HAS PASSED!')
            exec("gpg --keyserver keyserver.ubuntu.com --recv-keys FFA74E7AD9377292 && gpg --verify integrity.json.gpg", (error, stdout, stderr) => {
                if (error) {
                    console.error('The integrity of this software is compromised. Please contact the author for a valid copy.');
                }
                if (stderr) {
                    console.log(`${stderr}`);
                }
                console.log(`${stdout}`);
                process.exit(1);
            });
        }
    }catch(error){
         console.error(error)
         process.exit(1);
    }
 })()