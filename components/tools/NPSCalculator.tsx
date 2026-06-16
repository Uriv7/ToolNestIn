'use client';
import { useState, useMemo } from 'react';

export default function NPSCalculator() {
  const [monthly, setMonthly] = useState('5000');
  const [age, setAge] = useState('30');
  const [retireAge] = useState(60);
  const [equityPct, setEquityPct] = useState('75');
  const [corpPct] = useState('15');

  const result = useMemo(() => {
    const yrs = Math.max(0, retireAge - (parseInt(age) || 30));
    const n = yrs * 12;
    const P = parseFloat(monthly) || 0;
    const eqR = (parseInt(equityPct) || 75) / 100 * 0.13;
    const cgR = (parseInt(corpPct) || 15) / 100 * 0.095;
    const govR = (100 - (parseInt(equityPct)||75) - (parseInt(corpPct)||15)) / 100 * 0.085;
    const blended = (eqR + cgR + govR) / 12;
    const fv = P * ((Math.pow(1 + blended, n) - 1) / blended) * (1 + blended);
    const invested = P * n;
    const lumpsum = fv * 0.6;
    const annuityCorpus = fv * 0.4;
    const monthlyPension = annuityCorpus * 0.065 / 12;
    return { fv, invested, gains: fv - invested, lumpsum, annuityCorpus, monthlyPension, yrs };
  }, [monthly, age, equityPct, corpPct]);

  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Monthly Contribution (₹)</label>
          <input type="number" className="tool-input" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="5000" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Current Age</label>
          <input type="number" className="tool-input" value={age} onChange={e => setAge(e.target.value)} placeholder="30" min="18" max="59" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Equity Allocation: {equityPct}% (max 75% till age 50)</label>
        <input type="range" min="0" max="75" value={equityPct} onChange={e => setEquityPct(e.target.value)} className="w-full" />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Equity: {equityPct}% (~13% p.a.)</span>
          <span>Corp Bonds: {corpPct}% (~9.5% p.a.)</span>
          <span>Govt Sec: {100-(parseInt(equityPct)||75)-(parseInt(corpPct)||15)}% (~8.5% p.a.)</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { l: 'Total Invested', v: fmt(result.invested) },
          { l: 'Estimated Corpus', v: fmt(result.fv) },
          { l: '60% Tax-Free Lump Sum', v: fmt(result.lumpsum) },
          { l: 'Est. Monthly Pension', v: fmt(result.monthlyPension) },
        ].map(r => (
          <div key={r.l} className="bg-white/3 border border-white/10 rounded-2xl p-4 text-center">
            <div className="font-sans text-lg font-extrabold gradient-text">{r.v}</div>
            <div className="text-xs text-slate-500 mt-1">{r.l}</div>
          </div>
        ))}
      </div>
      <div className="bg-brand-500/10 border border-brand-400/20 rounded-xl p-4 text-sm text-slate-300">
        💡 <strong>80CCD(1B) benefit:</strong> ₹50,000 extra deduction beyond ₹1.5L 80C. Saves ₹10,400–₹15,600/year depending on tax slab.
      </div>
      <p className="text-xs text-slate-600 text-center">NPS returns are indicative. Subject to market risk. Pension is estimated at 6.5% annuity rate.</p>
    </div>
  );
}
