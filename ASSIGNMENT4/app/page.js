"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [Module, setModule] = useState(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [key, setKey] = useState("key");

  useEffect(() => {
  const script = document.createElement("script");
  script.src = "/wasm/rc4.js";
  script.async = true;
  script.onload = () => {
    try {
      // Module may be global function or variable depending on emscripten flags.
      const maybeModule = typeof Module !== "undefined" ? Module : null;
      // Some builds return a function entrypoint, try calling it.
      const init = (typeof maybeModule === "function") ? maybeModule : (typeof window.Module === "function" ? window.Module : null);

      if (init) {
        init().then(instance => {
          console.log("WASM: initialized (init()).");
          console.log("WASM instance keys", Object.keys(instance).slice(0,100));
          setModule(instance);
        }).catch(err => {
          console.error("WASM init() failed:", err);
        });
        return;
      }

      // If no function entrypoint, maybe Module is an object that becomes ready
      if (maybeModule && typeof maybeModule.then === "function") {
        maybeModule.then(instance => {
          console.log("WASM: Module (promise) resolved");
          console.log("WASM instance keys", Object.keys(instance).slice(0,100));
          setModule(instance);
        }).catch(e => console.error("Module promise failed", e));
        return;
      }

      // Last resort: wait a bit and inspect global Module
      setTimeout(() => {
        const globalM = window.Module || window.module || window.emscriptenModule || Module;
        console.log("WASM: global Module fallback:", !!globalM);
        if (globalM) {
          // if it's a function, call it
          if (typeof globalM === "function") {
            globalM().then(i => {
              console.log("WASM: fallback module() resolved");
              console.log("WASM instance keys", Object.keys(i).slice(0,100));
              setModule(i);
            }).catch(err => console.error(err));
          } else {
            console.log("WASM: global Module is object keys:", Object.keys(globalM).slice(0,100));
            setModule(globalM);
          }
        } else {
          console.error("WASM: no Module found after loading rc4.js");
        }
      }, 300);
    } catch (e) {
      console.error("WASM loader error:", e);
    }
  };
  script.onerror = (e) => console.error("Failed to load /wasm/rc4.js", e);
  document.body.appendChild(script);

  return () => {
    // no cleanup needed for now
  };
}, []);


  const toBuf = s => new TextEncoder().encode(s);
  const toStr = b => new TextDecoder().decode(b);

  function runRC4(mode) {
  if (!Module) return;

  const keyBytes = new TextEncoder().encode(key);

  let inputBytes;

  if (mode === "decrypt") {
    // decode base64 ciphertext
    try {
      inputBytes = Uint8Array.from(atob(input), c => c.charCodeAt(0));
    } catch {
      alert("Invalid ciphertext (not base64)");
      return;
    }
  } else {
    // encode plaintext to bytes
    inputBytes = new TextEncoder().encode(input);
  }

  const pText = Module._malloc(inputBytes.length);
  const pKey  = Module._malloc(keyBytes.length);

  Module.HEAPU8.set(inputBytes, pText);
  Module.HEAPU8.set(keyBytes, pKey);

  const outPtr = Module._rc4(pText, inputBytes.length, pKey, keyBytes.length);
  const out = Module.HEAPU8.slice(outPtr, outPtr + inputBytes.length);

  Module._free(pText);
  Module._free(pKey);

  if (mode === "decrypt") {
    // show readable UTF-8 plaintext
    setOutput(new TextDecoder().decode(out));
  } else {
    // encode ciphertext as base64
    const b64 = btoa(String.fromCharCode(...out));
    setOutput(b64);
  }
}



  return (
    <div>
      <textarea rows={4} value={input} onChange={e => setInput(e.target.value)} />
      <br />
      <input value={key} onChange={e => setKey(e.target.value)} />
      <br /><br />
      <button onClick={() => runRC4("encrypt")}>Encrypt</button>
      <button onClick={() => runRC4("decrypt")} className="secondary">Decrypt</button>

      <br /><br />
      <textarea rows={4} value={output} readOnly />
    </div>
  );
}
