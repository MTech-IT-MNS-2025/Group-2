document.addEventListener('DOMContentLoaded', () => {
  const pInput = document.getElementById('p');
  const gInput = document.getElementById('g');
  const connectBtn = document.getElementById('connect');
  const resultBox = document.getElementById('resultBox');
  const resultText = document.getElementById('resultText');

  function modexpJS(a, b, n) {
    a = BigInt(a);
    b = BigInt(b);
    n = BigInt(n);

    let result = 1n;
    a = a % n;

    while (b > 0n) {
      if (b & 1n) {
        result = (result * a) % n;
      }
      a = (a * a) % n;
      b >>= 1n;
    }
    return result.toString();
  }

  function randomA(p) {
    const max = Math.max(2, Number(p) - 1);
    const r = crypto.getRandomValues(new Uint32Array(1))[0];
    return (r % (max - 1)) + 1;
  }

  connectBtn.addEventListener('click', async () => {
    let p = Number(pInput.value);
    let g = Number(gInput.value);

    if (!p || !g) {
      alert('Enter valid p and g');
      return;
    }

    const a = randomA(p);
    const x = modexpJS(g, a, p);

    const resp = await fetch('/compute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ p, g, x })
    });

    const data = await resp.json();

    resultBox.hidden = false;
    resultText.textContent = `K = ${data.K}\ny = ${data.y}\na = ${a}`;
  });
});
