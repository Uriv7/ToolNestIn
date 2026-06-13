'use client';
import { useState } from 'react';
export default function XMLFormatter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'format'|'minify'>('format');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const process = () => {
    setError(''); setOutput('');
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const err = doc.querySelector('parsererror');
      if (err) { setError('XML parse error: ' + err.textContent?.split('\n')[0]); return; }
      if (mode === 'minify') { setOutput(input.replace(/>\s+</g,'><').replace(/\s+/g,' ').trim()); return; }
      const serializer = new XMLSerializer();
      let str = serializer.serializeToString(doc);
      let indent = 0; const lines: string[] = [];
      str.replace(/>\s*</g,'>\n<').split('\n').forEach(line => {
        const t = line.trim();
        if (!t) return;
        if (t.startsWith('</')) indent = Math.max(0, indent - 2);
        lines.push(' '.repeat(indent) + t);
        if (!t.startsWith('</') && !t.endsWith('/>') && t.startsWith('<') && !t.includes('</')) indent += 2;
      });
      setOutput(lines.join('\n'));
    } catch (e: any) { setError(e.message); }
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">{(['format','minify'] as const).map(m=>(<button key={m} onClick={()=>setMode(m)} className={`flex-1 py-2.5 rounded-xl text-sm font-600 border transition ${mode===m?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{m==='format'?'✨ Beautify':'🗜️ Minify'}</button>))}</div>
      <textarea className="tool-input h-40 font-mono text-xs" value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste XML here..." />
      <button onClick={process} className="w-full py-2.5 rounded-xl bg-brand-500/20 border border-brand-400/40 text-brand-300 font-700 hover:bg-brand-500/30 transition">Process XML</button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {output && <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Output {output.length < input.length && <span className="text-emerald-400">({Math.round((1-output.length/input.length)*100)}% smaller)</span>}</label><textarea readOnly className="tool-input h-40 font-mono text-xs" value={output} /></div>}
    </div>
  );
}
