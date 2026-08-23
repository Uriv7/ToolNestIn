'use client';
import { useState } from 'react';
const PRESETS = [{l:'16:9 (YouTube/TV)',r:[16,9]},{l:'9:16 (Reels/Stories)',r:[9,16]},{l:'1:1 (Instagram Square)',r:[1,1]},{l:'4:3 (Standard)',r:[4,3]},{l:'4:5 (Instagram Portrait)',r:[4,5]},{l:'21:9 (Ultrawide)',r:[21,9]}];
export default function AspectRatioCalculator() {
  const [w, setW] = useState('1920');
  const [h, setH] = useState('1080');
  const [mode, setMode] = useState<'findH'|'findW'|'ratio'>('findH');
  const apply = (r: number[]) => { if (mode==='findH') { setW('1920'); setH(String(Math.round(1920*r[1]/r[0]))); } else { setW(String(Math.round(1080*r[0]/r[1]))); setH('1080'); } };
  const gcd = (a: number, b: number): number => b===0?a:gcd(b,a%b);
  const wn = parseInt(w)||0; const hn = parseInt(h)||0;
  const g = gcd(wn,hn); const ratio = wn&&hn ? `${wn/g}:${hn/g}` : '';
  const mp = wn&&hn ? ((wn*hn)/1000000).toFixed(2) : '';
  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">{PRESETS.map(p=>(<button key={p.l} onClick={()=>apply(p.r)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/3 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 transition">{p.l}</button>))}</div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Width (px)</label><input type="number" className="tool-input text-lg" value={w} onChange={e => setW(e.target.value)} aria-label="Width (px)" /></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Height (px)</label><input type="number" className="tool-input text-lg" value={h} onChange={e => setH(e.target.value)} aria-label="Height (px)" /></div>
      </div>
      {ratio && (<div className="grid grid-cols-3 gap-3">
        <div className="bg-brand-500/15 border border-brand-400/40 rounded-2xl p-4 text-center"><div className="gradient-text font-extrabold text-2xl">{ratio}</div><div className="text-xs text-slate-400 mt-1">Aspect Ratio</div></div>
        <div className="bg-white/3 border border-white/10 rounded-2xl p-4 text-center"><div className="text-slate-200 font-extrabold text-xl">{mp} MP</div><div className="text-xs text-slate-400 mt-1">Megapixels</div></div>
        <div className="bg-white/3 border border-white/10 rounded-2xl p-4 text-center"><div className="text-slate-200 font-extrabold text-xl">{wn}×{hn}</div><div className="text-xs text-slate-400 mt-1">Dimensions</div></div>
      </div>)}
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
        {[[1920,1080,'Full HD'],[3840,2160,'4K UHD'],[1080,1920,'Stories'],[1080,1080,'Insta Square']].map(([pw,ph,pl])=>(<button key={pl} onClick={()=>{setW(String(pw));setH(String(ph));}} className="bg-white/3 border border-white/10 rounded-lg px-3 py-2 hover:border-white/20 hover:text-slate-300 transition text-left">{pl} — {pw}×{ph}</button>))}
      </div>
    </div>
  );
}
