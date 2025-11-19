# Diffie-Hellman Key Exchange Lab – README

## 📋 Assignment Objective
Establish a Diffie-Hellman shared secret key between client and server using WebAssembly for cryptographic computations.

---

## 🛠️ Platform & Tools Used
- **Platform:** Windows  
- **Software/Tools:** NodeJS, Emscripten

---

## 🚀 Commands to Run Your Codes

### **1. Install Dependencies**
```bash
npm install
```

### **2. Compile WebAssembly Module**
```bash
emcc myProg.c -O3 -s WASM=1 -s EXPORTED_FUNCTIONS="['_modexp']" -o myProg.wasm
```

### **3. Start the Application**
```bash
npm start
```

### **4. Access Application**
Open browser and go to:  
**http://localhost:3000**

---

## 🎯 Usage Instructions

### **Enter Parameters in Web Form**
- **p:** Prime number (e.g., 2)  
- **g:** Generator (e.g., 11)

Click **"CONNECT"** to initiate key exchange.

### **View Results**
- **K:** Shared secret key  
- **y:** Server's public key  
- **a:** Client's private key  

---

## 📘 Example Test Case (From Question Paper)

### **Input**
```
p = 2
g = 11
```

### **Expected Output**
```
K = 10
y = 10
a = 3
```

---

## 📁 File Structure

```
diffie-hellman-project/
├── package.json
├── index.html
├── client.js
├── server.js
├── myProg.c
├── myProg.wasm
└── README.md
```

---

## 🔧 MD5 Digest Command
To generate MD5 hash:

```cmd
certutil -hashfile "project-folder" MD5
```

> Replace `"project-folder"` with your actual project folder or ZIP file.

---

## 📝 Implementation Details

### **Client-Side**
- Takes values of **p** and **g**
- Generates random private key **a ∈ Z_p\***
- Computes **x = g^a mod p** using WASM
- Sends `<g, p, x>` to server
- Displays `<K, y, a>`

### **Server-Side**
- Receives `<g, p, x>`
- Generates random private key **b ∈ Z_p\***
- Computes:
  - **y = g^b mod p**
  - **K = x^b mod p**
- Sends `<K, y>` back to client

---

## 🐛 Troubleshooting

- **Emscripten not found:** Install and add to PATH  
- **Port 3000 busy:** Change port in `server.js`  
- **WASM load failure:** System automatically switches to JavaScript fallback  

---

## 📚 Academic Info
- **Course:** Introduction to Cryptography  
- **Session:** July–Dec 2025  
- **Lab Date:** 18 Nov 2025  

---

