import { fileURLToPath } from 'url';
import { dirname, join, normalize, resolve, extname } from 'path';
import { readFile, accessSync, constants } from 'fs';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config(); // Load environment variables from .env file

// Simulating __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directoryName = './public';

const types = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  json: 'application/json',
  xml: 'application/xml',
  pdf: 'application/pdf',
  zip: 'application/zip',
  gz: 'application/gzip',
  tar: 'application/x-tar',
  ico: 'image/x-icon',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  webm: 'video/webm',
  svg: 'image/svg+xml',
  ttf: 'font/ttf',
  otf: 'font/otf',
  woff: 'font/woff',
  woff2: 'font/woff2',
  eot: 'font/eot',
  sfnt: 'font/sfnt',
  txt: 'text/plain',
  csv: 'text/csv',
  ics: 'text/calendar',
  vcf: 'text/vcard',
  htm: 'text/html',
  shtml: 'text/html',
  xhtml: 'application/xhtml+xml',
  md: 'text/markdown',
};

const root = normalize(resolve(directoryName));

const serveFiles = (req, res) => {
  console.log(`${req.method} ${req.url}`);

  const extension = extname(req.url).slice(1);
  const type = extension ? types[extension] : types.html;
  const supportedExtension = Boolean(type);

  if (!supportedExtension) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404: File not found');
    return;
  }

  let fileName = req.url;
  if (req.url === '/') fileName = 'index.html';
  else if (!extension) {
    try {
      accessSync(join(root, req.url + '.html'), constants.F_OK);
      fileName = req.url + '.html';
    } catch (e) {
      fileName = join(req.url, 'index.html');
    }
  }

  const filePath = join(root, fileName);
  const isPathUnderRoot = normalize(resolve(filePath)).startsWith(root);

  if (!isPathUnderRoot) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('404: File not found');
    return;
  }

  readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('404: File not found');
    } else {
      res.writeHead(200, { 'Content-Type': type });
      res.end(data);
    }
  });
};

const NODE_ENV = process.env.NODE_ENV || 'development'; // Default to development if not specified

if (NODE_ENV === 'production') {
  // Use Greenlock in production
  import('greenlock-express').then(({ default: Greenlock }) => {
    const maintainerEmail = process.env.MAINTAINER_EMAIL;

    Greenlock.init({
      packageRoot: __dirname,
      configDir: './greenlock.d',
      maintainerEmail,
      cluster: false
    })
    .serve(serveFiles);
  });
} else {
  // Use plain HTTP in development
  const port = 8100;
  http.createServer(serveFiles).listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
