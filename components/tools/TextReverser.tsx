'use client';
import { useState } from 'react';
export default function TextReverser() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chars'|'words'|'lines'>('chars');
  const output = mode==='chars' ? input.split('').reverse().join('') : mode==='words' ? input.split(' ').reverse().join(' ') : input.split('\n').reverse().join('\n');
  return (
    <div className="space-y-4">
      <div className="flex gap-2">{([['chars','🔤 Reverse Characters'],['words','📝 Reverse Words'],['lines','📋 Reverse Lines']] as const).map(([m,l])=>(<button key={m} onClick={()=>setMode(m)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${mode===m?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{l}</button>))}</div>
      <textarea className="tool-input h-32" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type or paste text here..." />
      {input && (<div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Result</label>
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-4 font-mono text-slate-200 break-all">{output}</div>
        <button onClick={()=>navigator.clipboard.writeText(output)} className="mt-2 text-xs text-slate-500 hover:text-brand-400">📋 Copy result</button>
      </div>)}
      {input && mode==='chars' && input===output && <p className="text-emerald-400 text-sm text-center">✨ This is a palindrome!</p>}
    </div>
  );
}
