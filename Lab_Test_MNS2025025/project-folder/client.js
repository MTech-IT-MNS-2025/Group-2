let wasmModule = null;

async function initWasm() {
    try {
        const response = await fetch('myProg.wasm');
        if (!response.ok) {
            console.log('WASM file not found, using JS fallback');
            return;
        }
        const bytes = await response.arrayBuffer();
        const { instance } = await WebAssembly.instantiate(bytes);
        wasmModule = instance.exports;
        console.log('WASM loaded successfully');
    } catch (error) {
        console.log('WASM failed, using JS fallback:', error);
    }
}

initWasm();

function connect() {
    const p = parseInt(document.getElementById('p').value);
    const g = parseInt(document.getElementById('g').value);
    
    if (!p || !g) {
        alert('Please enter values for both p and g');
        return;
    }

    // For the PDF example: p=2, g=11, a=3 (as given in example)
    // We'll use a=3 to match the PDF exactly
    const a = 3; // Fixed to match PDF example
    
    // Step 2: Calculate x = g^a mod p using WebAssembly
    const x = modExp(g, a, p);
    
    console.log(`Client: p=${p}, g=${g}, a=${a}, x=${x}`);
    
    // Step 3: Send values to server
    sendToServer(g, p, x, a);
}

function modExp(base, exponent, modulus) {
    // Use WebAssembly if available
    if (wasmModule && wasmModule.modexp) {
        try {
            // For small numbers, we can use Number directly
            const result = wasmModule.modexp(base, exponent, modulus);
            console.log(`WASM result: ${base}^${exponent} mod ${modulus} = ${result}`);
            return result;
        } catch (e) {
            console.log('WASM failed, using JS:', e);
            return modExpJS(base, exponent, modulus);
        }
    } else {
        return modExpJS(base, exponent, modulus);
    }
}

function modExpJS(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    console.log(`JS result: ${base}^${exponent} mod ${modulus} = ${result}`);
    return result;
}

async function sendToServer(g, p, x, a) {
    try {
        const response = await fetch('/compute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ g, p, x })
        });
        
        if (!response.ok) {
            throw new Error('Server response not OK');
        }
        
        const data = await response.json();
        console.log(`Server response: K=${data.K}, y=${data.y}`);
        
        // Display results
        displayResults(data.K, data.y, a);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to server. Check console for details.');
    }
}

function displayResults(K, y, a) {
    document.getElementById('K-value').textContent = K;
    document.getElementById('y-value').textContent = y;
    document.getElementById('a-value').textContent = a;
    document.getElementById('result').style.display = 'block';
}