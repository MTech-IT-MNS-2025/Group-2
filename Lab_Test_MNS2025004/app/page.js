'use client';

import { useState } from 'react';
import { initWASM, computeModExp } from '@/lib/wasm-module';

export default function Home() {
  const [p, setP] = useState('');
  const [g, setG] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!p || !g) {
      alert('Please enter values for p and g');
      return;
    }

    // Validate inputs
    const pNum = Number(p);
    const gNum = Number(g);
    
    if (pNum <= 2) {
      alert('p must be greater than 2');
      return;
    }
    
    if (gNum <= 1) {
      alert('g must be greater than 1');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const pBig = BigInt(p);
      const gBig = BigInt(g);

      // Step 2: Generate random a in Z_p^* (1 <= a <= p-1)
      const a = BigInt(Math.floor(Math.random() * Number(pBig - 1n)) + 1);
      
      // Step 3: Compute x = g^a mod p
      const x = await computeModExp(gBig, a, pBig);
      
      console.log(`Client values: p=${pBig}, g=${gBig}, a=${a}, x=${x}`);

      // Step 4: Send values to server
      const response = await fetch('/api/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          g: gBig.toString(), 
          p: pBig.toString(), 
          x: x.toString() 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Step 5: Display results
      setResult({
        K: data.K,
        y: data.y,
        a: a.toString()
      });

      console.log('Results displayed:', { K: data.K, y: data.y, a: a.toString() });

    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setP('');
    setG('');
    setResult(null);
  };

  return (
    <main style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>
        Diffie-Hellman Key Exchange
      </h1>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '2rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="p" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Enter the Value of p:
          </label>
          <input
            id="p"
            type="number"
            value={p}
            onChange={(e) => setP(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            min="3"
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="g" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Enter the Value of g:
          </label>
          <input
            id="g"
            type="number"
            value={g}
            onChange={(e) => setG(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
            min="2"
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleConnect}
            disabled={loading || !p || !g}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: (loading || !p || !g) ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || !p || !g) ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Computing...' : 'CONNECT'}
          </button>
          
          <button
            onClick={handleClear}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div style={{
          backgroundColor: '#e8f5e8',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          fontFamily: 'monospace',
          border: '2px solid #4caf50'
        }}>
          <h3 style={{ marginTop: 0, color: '#2d5016', borderBottom: '1px solid #4caf50', paddingBottom: '0.5rem' }}>
            Results
          </h3>
          <div style={{ lineHeight: '2' }}>
            <div><strong>K =</strong> {result.K}</div>
            <div><strong>y =</strong> {result.y}</div>
            <div><strong>a =</strong> {result.a}</div>
          </div>
        </div>
      )}

      {/* Empty state message */}
      {!result && !loading && (
        <div style={{
          backgroundColor: '#fff3cd',
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '2rem',
          textAlign: 'center',
          border: '1px solid #ffeaa7'
        }}>
          <p style={{ margin: 0, color: '#856404' }}>
            <strong>Enter values for p and g, then click CONNECT</strong>
          </p>
        </div>
      )}
    </main>
  );
}