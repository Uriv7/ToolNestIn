'use client';
import { useState } from 'react';
export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [isDeg, setIsDeg] = useState(true);
  const toRad = (x: number) => isDeg ? x * Math.PI / 180 : x;
  const press = (k: string) => {
    const v = parseFloat(display);
    const ops: Record<string,(x:number)=>number> = {
      'sin':x=>Math.sin(toRad(x)),'cos':x=>Math.cos(toRad(x)),'tan':x=>Math.tan(toRad(x)),
      'log':x=>Math.log10(x),'ln':x=>Math.log(x),'√':x=>Math.sqrt(x),'∛':x=>Math.cbrt(x),
      'x²':x=>x*x,'1/x':x=>1/x,'n!':x=>{let f=1;for(let i=2;i<=x;i++)f*=i;return f;},'±':x=>-x,
    };
    if (ops[k]) { const r=ops[k](v); setHistory(h=>[`${k}(${v}) = ${r}`,...h.slice(0,9)]); setDisplay(String(r)); return; }
    if (k==='π') { setDisplay(String(Math.PI)); return; }
    if (k==='e') { setDisplay(String(Math.E)); return; }
    if (k==='M+') { setMemory(m=>m+v); return; }
    if (k==='MR') { setDisplay(String(memory)); return; }
    if (k==='MC') { setMemory(0); return; }
    if (k==='=') { try { const r=Function('"use strict";return ('+display.replace(/×/g,'*').replace(/÷/g,'/')+')()')(); setHistory(h=>[`${display} = ${r}`,...h.slice(0,9)]); setDisplay(String(r)); } catch { setDisplay('Error'); } return; }
    if (k==='C') { setDisplay('0'); return; }
    if (k==='⌫') { setDisplay(d=>d.length>1?d.slice(0,-1):'0'); return; }
    if (k==='.') { if (!display.includes('.')) setDisplay(d=>d+'.'); return; }
    setDisplay(d=>d==='0'&&!['.','+','-','×','÷','(',')','^'].includes(k)?k:d+k);
  };
  const KEYS = [['sin','cos','tan','π'],['log','ln','√','∛'],['x²','1/x','n!','±'],['M+','MR','MC','('],['7','8','9','÷'],['4','5','6','×'],['1','2','3','-'],['0','.','=','+'],['C','⌫',')','^']];
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center"><label className="text-xs font-600 text-slate-400 uppercase tracking-widest">Mode</label><button onClick={()=>setIsDeg(d=>!d)} className="px-3 py-1 rounded-lg text-xs font-700 bg-white/3 border border-white/10 text-slate-300">{isDeg?'DEG':'RAD'}</button></div>
      <div className="bg-dark-900 rounded-2xl border border-white/10 p-4 text-right"><div className="font-mono font-800 text-3xl text-slate-200 break-all">{display}</div>{memory!==0&&<div className="text-xs text-slate-500 mt-1">M: {memory}</div>}</div>
      <div className="grid grid-cols-4 gap-1.5">
        {KEYS.flat().map(k=>(<button key={k} onClick={()=>press(k)} className={`py-3 rounded-xl font-700 text-sm transition border ${['='].includes(k)?'bg-brand-500/30 border-brand-400/50 text-brand-200 col-span-1':['C','⌫'].includes(k)?'bg-red-500/15 border-red-400/30 text-red-300':'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}>{k}</button>))}
      </div>
      {history.length>0&&(<div><div className="text-xs text-slate-400 uppercase tracking-widest mb-2">History</div><div className="space-y-1 max-h-28 overflow-y-auto">{history.map((h,i)=>(<div key={i} className="text-xs text-slate-500 font-mono px-2 py-1 bg-white/3 rounded">{h}</div>))}</div></div>)}
    </div>
  );
}
