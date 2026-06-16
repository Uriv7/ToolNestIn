'use client';
import { useState } from 'react';
export default function CronGenerator() {
  const [min,setMin]=useState('*');const [hour,setHour]=useState('*');const [dom,setDom]=useState('*');const [month,setMonth]=useState('*');const [dow,setDow]=useState('*');
  const expr = `${min} ${hour} ${dom} ${month} ${dow}`;
  const explain = () => {
    const m = min==='*'?'every minute':`minute ${min}`;
    const h = hour==='*'?'every hour':`at hour ${hour}`;
    const d = dom==='*'?'every day':`on day ${dom}`;
    const mo = month==='*'?'every month':`in month ${month}`;
    const wd = dow==='*'?'every weekday':`on weekday ${dow}`;
    return `Runs ${m}, ${h}, ${d} of ${mo}, ${wd}`;
  };
  const PRESETS=[
    {l:'Every minute',v:'* * * * *'},{l:'Every hour',v:'0 * * * *'},{l:'Daily at midnight',v:'0 0 * * *'},
    {l:'Daily 9AM IST (3:30 UTC)',v:'30 3 * * *'},{l:'Weekly Monday',v:'0 9 * * 1'},{l:'Monthly 1st',v:'0 0 1 * *'},
  ];
  const apply = (v: string) => { const p=v.split(' ');setMin(p[0]);setHour(p[1]);setDom(p[2]);setMonth(p[3]);setDow(p[4]); };
  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">{PRESETS.map(p=>(<button key={p.l} onClick={()=>apply(p.v)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/3 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 transition">{p.l}</button>))}</div>
      <div className="grid grid-cols-5 gap-2">
        {[['Minute','0-59',min,setMin],['Hour','0-23',hour,setHour],['Day','1-31',dom,setDom],['Month','1-12',month,setMonth],['Weekday','0-7',dow,setDow]].map(([l,p,v,s]:any)=>(
          <div key={l}><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{l}</label><input className="tool-input text-center" value={v} onChange={e=>s(e.target.value)} placeholder={p} /></div>
        ))}
      </div>
      <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 space-y-3">
        <div className="flex items-center gap-3"><code className="text-brand-300 font-extrabold text-xl font-mono">{expr}</code><button onClick={()=>navigator.clipboard.writeText(expr)} className="text-xs text-slate-500 hover:text-brand-400">📋 Copy</button></div>
        <p className="text-slate-300 text-sm">{explain()}</p>
      </div>
    </div>
  );
}
