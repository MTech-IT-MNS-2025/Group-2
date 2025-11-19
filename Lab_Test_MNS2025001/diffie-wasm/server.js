const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let modexpWasm = null;

// Try to load emscripten produced myProg.js if present
function tryLoadEmscriptenNode() {
  try {
    const wasmJsPath = path.join(__dirname, 'wasm', 'myProg.js');
    if (fs.existsSync(wasmJsPath)) {
      global.Module = {}; // emscripten expects Module
      require(wasmJsPath); // this may synchronously create Module.cwrap or later
      if (global.Module && typeof global.Module.cwrap === 'function') {
        modexpWasm = global.Module.cwrap('modexp', 'number', ['number','number','number']);
        console.log('Loaded emscripten myProg.js in Node');
      } else {
        // If Module.cwrap isn't ready immediately, wait short time:
        setTimeout(() => {
          if (global.Module && typeof global.Module.cwrap === 'function')
            modexpWasm = global.Module.cwrap('modexp', 'number', ['number','number','number']);
        }, 200);
      }
    }
  } catch (e) {
    console.warn('No emscripten wasm for Node or failed to load:', e.message);
  }
}
tryLoadEmscriptenNode();

// JS BigInt fallback (exact correctness for large integers)
function modexpJS(a,b,n) {
  let A = BigInt(a) % BigInt(n);
  let res = 1n;
  let base = A;
  let exp = BigInt(b);
  let mod = BigInt(n);
  while (exp > 0n) {
    if (exp & 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  // return as Number if fits, else return string to be safe
  if (res <= BigInt(Number.MAX_SAFE_INTEGER)) return Number(res);
  return res.toString();
}

app.post('/compute', (req, res) => {
  try {
    const { p, g, x } = req.body;
    if (p === undefined || g === undefined || x === undefined) {
      return res.status(400).json({ error: 'missing p,g,x' });
    }

    const pnum = Number(p);
    if (!Number.isFinite(pnum) || pnum < 2) return res.status(400).json({ error: 'invalid p' });

    // choose random b in [1, p-1] using crypto if available
    const crypto = require('crypto');
    const b = crypto.randomInt(1, Math.max(2,pnum)); // upper bound exclusive, so pnum works

    let y, K;
    if (modexpWasm) {
      // WARNING: emscripten cwrap uses 32-bit numbers; for homework-sized p this is okay.
      y = modexpWasm(Number(g), b, Number(p));
      K = modexpWasm(Number(x), b, Number(p));
    } else {
      y = modexpJS(g,b,p);
      K = modexpJS(x,b,p);
    }

    // return both raw values; if BigInt returns string, they will be strings
    res.json({ K, y, b });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server listening at http://localhost:' + PORT));
