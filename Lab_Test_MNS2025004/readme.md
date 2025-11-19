# Diffie-Hellman Key Exchange Implementation

## Project Overview
This project implements a complete Diffie-Hellman Key Exchange protocol using C, WebAssembly, Next.js, and Node.js for secure key establishment between client and server.

## Platform & Tools Used
- **Platform**: Ubuntu Linux
- **Tools**: Node.js, Next.js, React, JavaScript, Emscripten, WebAssembly, md5sum (Linux utility)


## 🧠 Diffie–Hellman Workflow

### 🔵 Client Side (Browser)
1. User inputs `p` and `g`
2. Client generates a random private value `a ∈ Z*p`
3. Client computes using WebAssembly (fallback: BigInt):
   ```
   x = g^a mod p
   ```
4. Client sends:
   ```
   <p, g, x>
   ```
   to the server
5. Client displays the final result received from server:
   ```
   K (shared key)
   y (server public value)
   a (client private value)
   ```

---

### 🔴 Server Side (Node.js)
1. Receives `<p, g, x>` from the client
2. Server generates private value `b ∈ Z*p`
3. Computes (using WASM first, fallback BigInt):
   ```
   y = g^b mod p
   K = x^b mod p
   ```
4. Sends `<K, y>` back to the client

Both parties now share the final secret:
```
K = g^(ab) mod p
```

---

## 📁 Directory Structure
```
lab_test/
├── app/
│ ├── api/
│ │ └── compute/
│ │ └── route.js
│ ├── globals.css
│ ├── layout.js
│ └── page.js
├── lib/
│ └── wasm-module.js
├── public/
│ └── myProg.wasm
├── myProg.c
├── package.json
└── README.md
```

---


## Protocol Workflow

### Client Side
1. User inputs prime `p` and generator `g`
2. Client generates random private value `a ∈ Z_p*`
3. Client computes `x = g^a mod p` using WebAssembly
4. Client sends `<p, g, x>` to server
5. Displays results: `K` (shared key), `y` (server public value), `a` (client private value)

### Server Side
1. Receives `<p, g, x>` from client
2. Generates random private value `b ∈ Z_p*`
3. Computes `y = g^b mod p` and `K = x^b mod p`
4. Sends `<K, y>` back to client

## Commands to Run

### Compile WebAssembly
```bash
emcc myProg.c -o public/myProg.wasm -s WASM=1 -s EXPORTED_FUNCTIONS='["_modexp"]' -s EXPORTED_RUNTIME_METHODS='["ccall"]' -s STANDALONE_WASM

---

## ▶️ Running the Project

### Install dependencies:
```bash
npm install
```

### Run Development Server:
```bash
npm run dev
```
### Build for Production
```bash

npm run build
npm start
```

Expected:
```
Server listening on http://localhost:3000
```

### Open frontend:
Go to:
```
http://localhost:3000
```

Enter values for `p` and `g`, then press **CONNECT**.

You will see:md5sum (Linux utility)
```
K = <shared key>
y = <server public value>
a = <client private value>
```

---

## 🧪 Correctness Check
The shared key satisfies:
```
K = y^a mod p = x^b mod p
```
ensuring correct Diffie–Hellman key agreement.

---

## 🔢 MD5 Digest Command
After zipping your project:
```bash
md5sum lab_test.zip
```

---

## 🔒 Security Notes
- Project is for **educational** purposes
- Real cryptographic systems must use verified libraries
- Choose sufficiently large prime `p` for real-world security

---

## 📄 License
MIT License — free to use and modify.

---

# 🎉 End of README.md