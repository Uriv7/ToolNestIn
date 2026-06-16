'use client';
import { useState } from 'react';
export default function CodeMinifier() {
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<'css'|'js'>('css');
  const [output, setOutput] = useState('');
  const minify = () => {
    let r = input;
    if (lang === 'css') {
      r = r.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*([{}:;,>~+])\s*/g,'$1').replace(/\s+/g,' ').replace(/;}/g,'}').trim();
    } else {
      r = r.replace(/\/\/[^\n]*/g,'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*([=+\-*/<>!&|?:,;{}()\[\]])\s*/g,'$1').replace(/\s+/g,' ').trim();
    }
    setOutput(r);
  };
  const pct = output && input ? Math.round((1-output.length/input.length)*100) : 0;
  return (
    <div className="space-y-4">
      <div className="flex gap-2">{(['css','js'] as const).map(l=>(<button key={l} onClick={()=>setLang(l)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${lang===l?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{l==='css'?'🎨 CSS':'⚡ JavaScript'}</button>))}</div>
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Input ({input.length} bytes)</label><textarea className="tool-input h-40 font-mono text-xs" value={input} onChange={e=>setInput(e.target.value)} placeholder={`Paste ${lang.toUpperCase()} here...`} /></div>
      <button onClick={minify} className="w-full py-2.5 rounded-xl bg-brand-500/20 border border-brand-400/40 text-brand-300 font-bold hover:bg-brand-500/30 transition">🗜️ Minify</button>
      {output && (<div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Output ({output.length} bytes) {pct>0&&<span className="text-emerald-400 ml-2">▼ {pct}% smaller</span>}</label><textarea readOnly className="tool-input h-32 font-mono text-xs" value={output} /><button onClick={()=>navigator.clipboard.writeText(output)} className="mt-2 px-4 py-2 text-sm font-semibold bg-white/3 border border-white/10 rounded-lg text-slate-300 hover:text-white transition">📋 Copy</button></div>)}
    </div>
  );
}
