'use client';
import { useState, useMemo } from 'react';
export default function EMIMoratoriumCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('8.5');
  const [tenure, setTenure] = useState('20');
  const [moratorium, setMoratorium] = useState('3');
  const result = useMemo(() => {
    const P = parseFloat(principal)||0; const r = (parseFloat(rate)||0)/100/12;
    const n = (parseInt(tenure)||20)*12; const m = parseInt(moratorium)||0;
    if (!P || !r) return null;
    const emi = P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
    const totalWithout = emi*n;
    const newP = P*Math.pow(1+r,m);
    const newEmi = newP*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
    const totalWith = newEmi*(n+m);
    const extraCost = totalWith - totalWithout;
    return {emi, newEmi, totalWithout, totalWith, extraCost, newP, interest: totalWithout-P, newInterest: totalWith-P};
  }, [principal, rate, tenure, moratorium]);
  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Loan Amount (₹)</label><input type="number" className="tool-input" value={principal} onChange={e=>setPrincipal(e.target.value)} placeholder="5000000" /></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Interest Rate (% p.a.)</label><input type="number" className="tool-input" value={rate} onChange={e=>setRate(e.target.value)} step="0.05" /></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Loan Tenure (years)</label><input type="number" className="tool-input" value={tenure} onChange={e=>setTenure(e.target.value)} /></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Moratorium Period (months)</label><input type="number" className="tool-input" value={moratorium} onChange={e=>setMoratorium(e.target.value)} min="1" max="12" /></div>
      </div>
      {result && (<div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/3 border border-white/10 rounded-2xl p-4"><div className="text-xs text-slate-400 mb-1">Without Moratorium</div><div className="text-slate-200 font-extrabold text-lg">{fmt(result.emi)}/mo</div><div className="text-xs text-slate-500 mt-1">Total: {fmt(result.totalWithout)}</div></div>
          <div className="bg-brand-500/15 border border-brand-400/40 rounded-2xl p-4"><div className="text-xs text-slate-400 mb-1">With {moratorium}-Month Moratorium</div><div className="gradient-text font-extrabold text-lg">{fmt(result.newEmi)}/mo</div><div className="text-xs text-slate-500 mt-1">Total: {fmt(result.totalWith)}</div></div>
        </div>
        <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 text-center"><div className="text-xs text-slate-400 mb-1">Extra Cost of Moratorium</div><div className="text-red-400 font-extrabold text-2xl">{fmt(result.extraCost)}</div><div className="text-xs text-slate-500">Additional interest over full loan tenure</div></div>
      </div>)}
      <p className="text-xs text-slate-600 text-center">Assumes interest accrues during moratorium, added to principal. EMI remains same, tenure unchanged.</p>
    </div>
  );
}
