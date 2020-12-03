const fs = require('fs');

if (process.argv.length < 4) {
  console.log('process.argv', process.argv);
  console.log(`Usage: node update-manifest.js [manifest.json file] [version]`);
  process.exit(1);
}

const manifestFile = process.argv[2];
const version = process.argv[3];

const manifestJson = JSON.parse(fs.readFileSync(manifestFile).toString());

manifestJson.version = version;

fs.writeFileSync(manifestFile, JSON.stringify(manifestJson, null, 2));
