# 🔐 Diffie–Hellman Key Exchange (C → WebAssembly → Node.js → Browser)

This project implements a complete Diffie–Hellman Key Exchange using:
- **C (`myProg.c`)** – modular exponentiation (`modexp`)
- **WebAssembly (WASM)** – used by both client and server
- **Node.js + Express** – backend API
- **HTML + CSS + JavaScript** – frontend UI

The same C function is compiled into WebAssembly to ensure identical computation on both sides.

---

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
diffie-wasm/
 ├── public/
 │    ├── index.html
 │    ├── style.css
 │    ├── app.js
 │    └── wasm/
 │         ├── myProg.js
 │         └── myProg.wasm
 ├── wasm/
 │    ├── myProg.js
 │    └── myProg.wasm
 ├── myProg.c
 ├── server.js
 ├── package.json
 ├── package-lock.json
 └── README.md
```

---

## ⚙️ Build Instructions

### 1️⃣ Compile `myProg.c` → WebAssembly
```bash
emcc myProg.c -O3 -s WASM=1 \
  -s EXPORTED_FUNCTIONS='["_modexp"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -o wasm/myProg.js
```

### Copy WASM files for frontend use:
```bash
cp wasm/myProg.js public/wasm/
cp wasm/myProg.wasm public/wasm/
```

---

## ▶️ Running the Project

### Install dependencies:
```bash
npm install
```

### Start backend server:
```bash
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

You will see:
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

## 🛠 Tools / Software Used
- Ubuntu (Linux)
- Node.js
- Express.js
- HTML, CSS, JavaScript
- Emscripten (WASM compiler)
- WebAssembly
- md5sum (Linux utility)

---

## 🔢 MD5 Digest Command
After zipping your project:
```bash
md5sum diffie-wasm.zip
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
