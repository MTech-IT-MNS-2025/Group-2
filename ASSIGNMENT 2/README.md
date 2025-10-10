# 🔐 Exploring Post-Quantum Cryptography with liboqs

---

## 📌 Objective

- Explore and use the **liboqs** library.
- Compare **classical cryptography** (RSA, ECC) with **post-quantum algorithms** (Kyber, Dilithium, Falcon, etc.).
- Implement **KEM** and **Digital Signature** demos.
- Perform a **comparative study** of key sizes and performance.

---

## 🧰 Prerequisites

Ensure you have the following installed:

- Linux or **WSL** environment  
- **GCC** or **Clang** compiler  
- **git** and **cmake**  
- **liboqs** library

---

## 🛠️ Installing liboqs

### 1. Clone the repository
```bash
git clone https://github.com/open-quantum-safe/liboqs.git
cd liboqs
```

### 2. Build and install
```bash
cmake -S . -B build -DBUILD_SHARED_LIBS=ON -DOQS_BUILD_ONLY_LIB=ON
cmake --build build
sudo cmake --install build
```

### 3. Verify installation
```bash
ldconfig -p | grep oqs
```

If you see entries like `liboqs.so`, the installation was successful ✅

---

## 📁 Project Structure

```
Assignment2/
│
├── src/
│   ├── task1_list_algorithms.c   # Task 1: List algorithms
│   ├── task2_kem_demo.c          # Task 2: KEM demo
│   ├── task3_sig_demo.c          # Task 3: Signature demo
│
├── docs/
│   └── report.pdf                # Task 4: Comparative study report
│
├── CONTRIBUTIONS.txt
└── README.md
```

---

## 🚀 How to Build and Run (Without Makefile)

You don’t need a **Makefile** — just use these commands directly in your terminal.

### 🧩 Task 1: List Algorithms

**File:** `src/task1_list_algorithms.c`

**Compile:**
```bash
gcc src/task1_list_algorithms.c -o task1 -loqs
```

**Run:**
```bash
./task1
```

**What it does:**
- Lists all supported **KEM** and **Signature** algorithms from liboqs  
- Prints algorithm name, public key length, secret key length, and ciphertext/signature length

---

### 🔑 Task 2: Key Encapsulation (KEM Demo)

**File:** `src/task2_kem_demo.c`

**Compile:**
```bash
gcc src/task2_kem_demo.c -o task2 -loqs
```

**Run:**
```bash
./task2
```

**What it does:**
- Alice generates a keypair  
- Bob encapsulates a shared secret  
- Alice decapsulates and verifies the same secret  
- Measures time taken for key generation, encapsulation, and decapsulation

---

### ✍️ Task 3: Digital Signature Demo

**File:** `src/task3_sig_demo.c`

**Compile:**
```bash
gcc src/task3_sig_demo.c -o task3 -loqs
```

**Run:**
```bash
./task3
```

**What it does:**
- Generates keypair for **Dilithium2**  
- Signs and verifies a message  
- Compares key and signature sizes with **RSA/ECDSA**

---

## 📊 Task 4: Comparative Study

Prepare a short **2–3 page report** (`docs/report.pdf`) summarizing:

- Key sizes (Public, Secret, Ciphertext/Signature)
- Performance metrics (encryption/signing speed)
- Comparison between:
  - **Classical algorithms**: RSA, ECDSA  
  - **Post-Quantum algorithms**: Kyber, Dilithium, Falcon  
- Discussion on:
  - Trade-offs in speed, size, and security  
  - Practicality of PQC algorithms for real-world use  

---

## 👥 Contributions

Each member’s contribution details are listed in `CONTRIBUTIONS.txt`.

---

## 🧾 References

- [liboqs GitHub](https://github.com/open-quantum-safe/liboqs)
- [Open Quantum Safe Project](https://openquantumsafe.org)
- [NIST PQC Standardization Project](https://csrc.nist.gov/projects/post-quantum-cryptography)
