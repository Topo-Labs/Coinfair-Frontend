const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = path.join(__dirname, 'dist');
const standaloneDir = path.join(distDir, 'standalone');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (!fs.existsSync(standaloneDir)) {
  fs.mkdirSync(standaloneDir, { recursive: true });
}

function copyFiles() {
  const publicSource = path.join(__dirname, 'public');
  const publicDest = path.join(standaloneDir, 'public');;

  fs.cpSync(publicSource, publicDest, { recursive: true });
  console.log('Public folder copied to standalone directory.');

  const staticSource = path.join(distDir, 'static');
  const staticDest = path.join(standaloneDir, '/dist/static');

  fs.mkdirSync(staticDest, { recursive: true });
  fs.cpSync(staticSource, staticDest, { recursive: true });
  console.log('Static folder copied to standalone/static directory.');
}

function compressStandalone() {
  const output = fs.createWriteStream(path.join(distDir, 'standalone.zip'));
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`Standalone folder compressed to standalone.zip (${archive.pointer()} total bytes)`);
  });

  archive.pipe(output);
  archive.directory(standaloneDir, false);
  archive.finalize();
}

copyFiles();
compressStandalone();