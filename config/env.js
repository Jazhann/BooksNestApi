#!/usr/bin/env node
var fs = require('fs');

async function loadEnv() {
  const envFileName = process.env.NODE_ENV.trim();
  const envFilePath = './config/' + envFileName + '.env';
  const envFile = await readFile(envFilePath);
  const envLines = envFile.split('\n');
  for (let i = 0; i < envLines.length; i++) {
    let [key, ...value] = envLines[i].split('=');
    value = value.join('=');
    process.env[key] = value;
  }
}

function readFile(url) {
  return new Promise(function (resolve, reject) {
    fs.readFile(url, 'utf8', function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

module.exports = { loadEnv };
