# RC4 WebAssembly Encryption App
A minimal RC4 encryption/decryption tool built using Next.js, WebAssembly (WASM), and C.

## Overview
This project implements the RC4 stream cipher in C, compiles it into WebAssembly using Emscripten, and runs it inside a Next.js frontend. The cipher is implemented without any cryptographic libraries. WebAssembly provides speed and security while Base64 encoding ensures safe handling of ciphertext.

## Features
- RC4 fully implemented in C (no crypto libraries)
- Compiled to WebAssembly for fast execution
- Clean, simple web interface
- Base64 encoded ciphertext (safe to copy/paste)
- No backend required—100% client-side
- Works offline

## Requirements
| Tool          | Purpose            | Check    |
|---------------|--------------------|----------|
| Node.js (18+) | Runs Next.js       | `node -v`|
| npm / yarn    | Package management | `npm -v` |
| Emscripten SDK| Compile C → WASM   | `emcc -v`|

If `emcc` is missing, install Emscripten.

 Installing Emscripten
```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh


## 📁 Folder Structure

RC4WASM/
├── app/
│   ├── page.js
│   ├── globals.css
│   └── layout.js
├── native/
│   └── rc4.c
├── public/
│   └── wasm/
│       ├── rc4.js
│       └── rc4.wasm
├── package.json
└── README.md

## ⚙️ Installation

### 📌 Clone the repo

```bash
git clone <repo-url>
cd RC4WASM
```

### 📌 Install dependencies

```bash
npm install
# or
yarn install
```

### Compile RC4 (C) into WebAssembly

cd native
emcc rc4.c -O3 \
  -s WASM=1 \
  -s EXPORTED_FUNCTIONS='["_rc4","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' \
  -o ../public/wasm/rc4.js

## ▶️ Run the project

npm run dev

App will run at: http://localhost:3000

## ✅ Commands for Git Setup

If project not initialized:

```bash
git init
```

Add files & commit:

```bash
git add .
git commit -m "Initial commit"
```

Add remote & push:

```bash
git remote add origin <repo-url>
git branch -M main
git push -u origin main
```

## 📄 License

This project is released under the **MIT License**.

---

### ⭐ If this helped, don’t forget to star the repo!