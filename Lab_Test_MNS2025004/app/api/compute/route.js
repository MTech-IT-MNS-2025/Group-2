// JavaScript implementation of modular exponentiation
function modExp(base, exponent, modulus) {
    let result = 1n;
    base = base % modulus;
    
    while (exponent > 0n) {
        if (exponent & 1n) {
            result = (result * base) % modulus;
        }
        base = (base * base) % modulus;
        exponent >>= 1n;
    }
    
    return result;
}

export async function POST(request) {
    try {
        const { g, p, x } = await request.json();
        
        // Convert to BigInt
        const gBig = BigInt(g);
        const pBig = BigInt(p);
        const xBig = BigInt(x);

        // Generate random b in Z_p^*
        const b = BigInt(Math.floor(Math.random() * Number(pBig - 1n)) + 1);
        
        // Compute y = g^b mod p
        const y = modExp(gBig, b, pBig);
        
        // Compute K = x^b mod p  
        const K = modExp(xBig, b, pBig);
        
        console.log(`Server computed: y=${y}, K=${K}`);

        return Response.json({ 
            K: K.toString(), 
            y: y.toString() 
        });

    } catch (error) {
        console.error('Server error:', error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}