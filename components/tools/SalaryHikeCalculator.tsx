'use client';
import { useState } from 'react';
export default function SalaryHikeCalculator() {
  const [oldCTC, setOldCTC] = useState('');
  const [newCTC, setNewCTC] = useState('');
  const [hikePct, setHikePct] = useState('');
  const [mode, setMode] = useState<'calc'|'find'>('calc');
  const old = parseFloat(oldCTC)||0;
  const nw = parseFloat(newCTC)||0;
  const hp = parseFloat(hikePct)||0;
  const calcNew = old && hp ? old*(1+hp/100) : 0;
  const calcPct = old && nw ? ((nw-old)/old*100) : 0;
  const fmtL = (n: number) => { if (n>=100000) return `₹${(n/100000).toFixed(2)} LPA`; return `₹${Math.round(n).toLocaleString('en-IN')}`; };
  const fmtM = (n: number) => `₹${Math.round(n/12).toLocaleString('en-IN')}/mo`;
  return (
    <div className="space-y-5">
      <div className="flex gap-2">{([['calc','Calculate New CTC'],['find','Find Hike %']] as const).map(([m,l])=>(<button key={m} onClick={()=>setMode(m)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${mode===m?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{l}</button>))}</div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Current CTC (₹ per year)</label><input type="number" className="tool-input" value={oldCTC} onChange={e => setOldCTC(e.target.value)} aria-label="Current CTC (₹ per year)" placeholder="1000000" /></div>
        {mode==='calc'
          ? <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Hike %</label><input type="number" className="tool-input" value={hikePct} onChange={e => setHikePct(e.target.value)} aria-label="Hike %" placeholder="20" /></div>
          : <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">New CTC (₹ per year)</label><input type="number" className="tool-input" value={newCTC} onChange={e => setNewCTC(e.target.value)} aria-label="New CTC (₹ per year)" placeholder="1200000" /></div>
        }
      </div>
      {((mode==='calc'&&calcNew>0)||(mode==='find'&&calcPct!==0)) && (
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 space-y-3">
          {mode==='calc' ? (<>
            <div className="text-center"><div className="text-xs text-slate-400 uppercase tracking-widest mb-1">New CTC</div><div className="gradient-text font-extrabold text-4xl">{fmtL(calcNew)}</div><div className="text-slate-400 text-sm mt-1">{fmtM(calcNew)}</div></div>
            <div className="grid grid-cols-2 gap-3 text-sm border-t border-white/5 pt-3">
              <div><div className="text-slate-400">Monthly increment</div><div className="text-emerald-400 font-bold">{fmtM(calcNew-old)}</div></div>
              <div><div className="text-slate-400">Annual increment</div><div className="text-emerald-400 font-bold">{fmtL(calcNew-old)}</div></div>
            </div>
          </>) : (<>
            <div className="text-center"><div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Hike Percentage</div><div className={`font-extrabold text-4xl ${calcPct>0?'gradient-text':'text-red-400'}`}>{calcPct.toFixed(2)}%</div></div>
            <div className="grid grid-cols-2 gap-3 text-sm border-t border-white/5 pt-3">
              <div><div className="text-slate-400">Old CTC</div><div className="text-slate-200 font-bold">{fmtL(old)}</div></div>
              <div><div className="text-slate-400">New CTC</div><div className="text-slate-200 font-bold">{fmtL(nw)}</div></div>
              <div><div className="text-slate-400">Annual gain</div><div className="text-emerald-400 font-bold">{fmtL(Math.abs(nw-old))}</div></div>
              <div><div className="text-slate-400">Monthly gain</div><div className="text-emerald-400 font-bold">{fmtM(Math.abs(nw-old))}</div></div>
            </div>
          </>)}
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">Note: Actual take-home change will be less due to higher income tax. Use CTC Calculator for exact in-hand.</p>
    </div>
  );
}
