import { join, normalize, resolve, extname } from 'path';
import { readFile, accessSync, constants } from 'fs';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';
import fs from 'fs';

dotenv.config(); // Load environment variables from .env file

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

const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'production') {
  // HTTPS server setup
  const privateKeyPath = process.env.SSL_PRIVATE_KEY_PATH;
  const certificatePath = process.env.SSL_CERTIFICATE_PATH;

  if (!privateKeyPath || !certificatePath) {
    console.error('SSL certificate paths are not set in the .env file');
    process.exit(1);
  }

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const certificate = fs.readFileSync(certificatePath, 'utf8');

  const credentials = { key: privateKey, cert: certificate };

  const httpsPort = process.env.HTTPS_PORT || 443;
  https.createServer(credentials, serveFiles).listen(httpsPort, () => {
    console.log(`HTTPS Server is listening on port ${httpsPort}`);
  });

  // HTTP to HTTPS redirect server
  const httpPort = process.env.HTTP_PORT || 80;
  http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(httpPort, () => {
    console.log(`HTTP to HTTPS redirect server listening on port ${httpPort}`);
  });
} else {
  // Use plain HTTP in development
  const port = 8100;
  http.createServer(serveFiles).listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}.`);
  });
}
