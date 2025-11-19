# 🔐 Diffie–Hellman Key Exchange (WebAssembly + Node.js + C)

This project implements a complete Diffie–Hellman Key Exchange using:
* **C (modexp)** – core modular exponentiation
* **WebAssembly (WASM)** – client-side secure computation
* **Node.js (Express)** – backend API
* **HTML + JavaScript** – frontend interface

Both the client and server use the same C modular exponentiation function, ensuring correctness and consistency.

---

## 🧠 Diffie–Hellman Workflow

### 🔵 Client Side (Browser)
1. User enters `p` and `g`
2. Client generates random `a ∈ Z*p`
3. Client computes using WASM:
```
   x = g^a mod p
```
4. Client sends `<g, p, x>` to the server
5. After receiving server response, client displays: `a, y, K`

### 🔴 Server Side (Node.js + C)
1. Receives `<g, p, x>`
2. Generates random `b ∈ Z*p`
3. Computes (using `process_server.exe`):
```
   y = g^b mod p
   K = x^b mod p
```
4. Sends `<K, y>` back to client

---

## 🛠 Installation

### ✅ Install Emscripten (WASM compiler)
```bash
emsdk install latest
emsdk activate latest
emsdk_env.ps1
```

### ✅ Install Node.js
Download from: [https://nodejs.org](https://nodejs.org)

### ✅ Install GCC (MinGW)
Required to compile server-side C program. Install MinGW-w64 or similar.

---

## ⚙️ Build Instructions

### 1️⃣ Compile Client-Side WASM
Run inside the `frontend` folder:
```bash
emcc process.c -o process.js ^
  -s EXPORTED_FUNCTIONS='["_process"]' ^
  -s EXPORTED_RUNTIME_METHODS='["cwrap"]' ^
  -s WASM_BIGINT=1
```

This generates:
* `process.js`
* `process.wasm`

### 2️⃣ Compile Server-Side C Program
Run inside the `server` folder:
```bash
gcc process_server.c -o modexp_server.exe
```

---

## ▶️ Running the Project

### 1. Start Backend
Inside the `server` directory:
```bash
node server.js
```
**Expected output:** `Server running on port 3000`

### 2. Start Frontend
Inside the `frontend` directory:
```bash
python -m http.server 8000
```
Then open browser: [http://localhost:8000/](http://localhost:8000/)

---

## 🎯 Diffie–Hellman Exchange Result

Once executed, the client and server share the same secret key:
```
K = y^a mod p = x^b mod p
```

---



---

## 🔒 Security Notes
- This implementation is for **educational purposes**
- Random number generation should use cryptographically secure sources in production
- Use sufficiently large prime numbers (`p`) for real-world security
- Consider using established libraries for production cryptography

---

## 📝 License
MIT License - Feel free to use and modify

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.
