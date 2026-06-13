'use client';
import { useState } from 'react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = () => {
    setError('');
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(mode === 'decode' ? 'Invalid Base64 string. Please check your input.' : 'Encoding error.');
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-600 border transition capitalize ${mode === m ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {m === 'encode' ? '🔐 Encode to Base64' : '🔓 Decode from Base64'}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">
          {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
        </label>
        <textarea className="tool-input resize-none font-mono text-sm" rows={6} value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'} />
      </div>

      <button onClick={process} className="btn-primary w-full">
        {mode === 'encode' ? '🔐 Encode' : '🔓 Decode'}
      </button>

      {(output || error) && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-600 text-slate-400 uppercase tracking-widest">Output</label>
            {output && <button onClick={copy} className="btn-secondary text-xs py-1.5 px-3">{copied ? '✓ Copied!' : '📋 Copy'}</button>}
          </div>
          {error ? (
            <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-4 text-sm text-rose-300">{error}</div>
          ) : (
            <div className="tool-output break-all">{output}</div>
          )}
        </div>
      )}
    </div>
  );
}
