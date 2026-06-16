'use client';
import { useState } from 'react';

export default function URLEncoder() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const output = (() => {
    if (!input.trim()) return '';
    try {
      return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch { return '⚠️ Invalid encoded URL string'; }
  })();

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${mode === m ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {m === 'encode' ? '🔗 URL Encode' : '🔓 URL Decode'}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Input</label>
        <textarea className="tool-input resize-none font-mono text-sm" rows={5} value={input} onChange={e => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'https://example.com/search?q=hello world&lang=en' : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world'} />
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Output</label>
            <button onClick={copy} className="btn-secondary text-xs py-1.5 px-3">{copied ? '✓ Copied!' : '📋 Copy'}</button>
          </div>
          <div className="tool-output break-all">{output}</div>
        </div>
      )}

      <div className="text-xs text-slate-600 p-3 rounded-lg bg-white/3 border border-white/5">
        <strong className="text-slate-500">Common encodings:</strong> Space → %20, & → %26, = → %3D, / → %2F, ? → %3F, # → %23
      </div>
    </div>
  );
}
