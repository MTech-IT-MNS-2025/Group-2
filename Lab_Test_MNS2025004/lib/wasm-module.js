let wasmModule = null;
let wasmInitialized = false;

export async function initWASM() {
  if (wasmInitialized) return wasmModule;
  
  console.log("WASM: Initialization started");
  wasmInitialized = true;
  
  // For now, return null to force JavaScript fallback
  console.log("WASM: Using JavaScript fallback");
  return null;
}

export async function computeModExp(base, exponent, modulus) {
  console.log("Computing modular exponentiation with:", {base, exponent, modulus});
  
  // Always use JavaScript implementation for now
  return jsModExp(BigInt(base), BigInt(exponent), BigInt(modulus));
}

// JavaScript implementation of modular exponentiation
function jsModExp(base, exponent, modulus) {
  let result = 1n;
  base = base % modulus;
  
  while (exponent > 0n) {
    if (exponent & 1n) {
      result = (result * base) % modulus;
    }
    base = (base * base) % modulus;
    exponent >>= 1n;
  }
  
  console.log("JavaScript modExp result:", result);
  return result;
}