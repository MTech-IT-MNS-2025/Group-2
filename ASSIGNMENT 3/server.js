require('dotenv').config({ path: '.env.local' });


const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// --- UPDATE THIS LINE ---
// Use the new CommonJS socket handler
const { initSocketServer } = require('./src/lib/socket-handler.cjs');
// ------------------------

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  initSocketServer(httpServer);

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch(err => {
    console.error('Error during app preparation:', err);
    process.exit(1);
});