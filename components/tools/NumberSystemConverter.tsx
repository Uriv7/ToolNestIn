'use client';
import { useState } from 'react';
export default function NumberSystemConverter() {
  const [val, setVal] = useState('');
  const [base, setBase] = useState(10);
  const num = parseInt(val, base);
  const valid = !isNaN(num) && val.trim()!=='';
  return (
    <div className="space-y-5">
      <div className="flex gap-2">{[{l:'Decimal',b:10},{l:'Binary',b:2},{l:'Octal',b:8},{l:'Hex',b:16}].map(b=>(<button key={b.b} onClick={()=>setBase(b.b)} className={`flex-1 py-2.5 rounded-xl text-sm font-600 border transition ${base===b.b?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>Base-{b.b}<br/><span className="text-xs opacity-70">{b.l}</span></button>))}</div>
      <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Enter {base===10?'Decimal':base===2?'Binary':base===8?'Octal':'Hexadecimal'} Number</label>
        <input className="tool-input font-mono text-xl tracking-wider uppercase" value={val} onChange={e=>setVal(e.target.value)} placeholder={base===10?'255':base===2?'11111111':base===8?'377':'FF'} />
      </div>
      {valid && (<div className="space-y-2">
        {[{l:'Decimal (Base 10)',v:num.toString(10)},{l:'Binary (Base 2)',v:num.toString(2)},{l:'Octal (Base 8)',v:num.toString(8)},{l:'Hexadecimal (Base 16)',v:num.toString(16).toUpperCase()}].map(r=>(<div key={r.l} className={`flex justify-between items-center px-4 py-3 rounded-xl border ${r.v===(base===10?num.toString(10):base===2?num.toString(2):base===8?num.toString(8):num.toString(16).toUpperCase())?'bg-brand-500/15 border-brand-400/40':'bg-white/3 border-white/10'}`}>
          <span className="text-slate-400 text-sm">{r.l}</span>
          <div className="flex items-center gap-2"><code className="text-slate-200 font-800 font-mono text-lg">{r.v}</code><button onClick={()=>navigator.clipboard.writeText(r.v)} className="text-xs text-slate-500 hover:text-brand-400">📋</button></div>
        </div>))}
      </div>)}
    </div>
  );
}
