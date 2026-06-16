'use client';
import { useState } from 'react';
export default function StringUtilities() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('trim');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const process = () => {
    switch(mode) {
      case 'trim': return input.split('\n').map(l=>l.trim()).join('\n');
      case 'replace': return input.split(find).join(replace);
      case 'sort-asc': return input.split('\n').sort().join('\n');
      case 'sort-desc': return input.split('\n').sort().reverse().join('\n');
      case 'emails': return (input.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g)||[]).join('\n');
      case 'urls': return (input.match(/https?:\/\/[^\s]+/g)||[]).join('\n');
      case 'numbers': return (input.match(/\d+\.?\d*/g)||[]).join('\n');
      default: return input;
    }
  };
  const output = input ? process() : '';
  const modes = [['trim','Trim Whitespace'],['replace','Find & Replace'],['sort-asc','Sort A→Z'],['sort-desc','Sort Z→A'],['emails','Extract Emails'],['urls','Extract URLs'],['numbers','Extract Numbers']];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{modes.map(([m,l])=>(<button key={m} onClick={()=>setMode(m)} className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${mode===m?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{l}</button>))}</div>
      {mode==='replace' && (<div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Find</label><input className="tool-input" value={find} onChange={e=>setFind(e.target.value)} placeholder="text to find" /></div><div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Replace with</label><input className="tool-input" value={replace} onChange={e=>setReplace(e.target.value)} placeholder="replacement" /></div></div>)}
      <textarea className="tool-input h-32 font-mono text-sm" value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste your text here..." />
      {output && (<div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Result</label><textarea readOnly className="tool-input h-32 font-mono text-sm" value={output} /><button onClick={()=>navigator.clipboard.writeText(output)} className="mt-2 text-xs text-slate-500 hover:text-brand-400">📋 Copy</button></div>)}
    </div>
  );
}
