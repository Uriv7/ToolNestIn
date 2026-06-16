'use client';
import { useState, useMemo } from 'react';
export default function SukanyaCalculator() {
  const [annual, setAnnual] = useState('150000');
  const [girlAge, setGirlAge] = useState('0');
  const rate = 8.2;
  const result = useMemo(() => {
    const P = parseFloat(annual) || 0;
    const age = parseInt(girlAge) || 0;
    const yearsLeft = Math.max(0, 15 - age);
    const maturityAge = 21 - age;
    let corpus = 0;
    for (let i = 0; i < yearsLeft; i++) corpus = (corpus + P) * (1 + rate / 100);
    const lockinYears = Math.max(0, maturityAge - yearsLeft);
    corpus = corpus * Math.pow(1 + rate / 100, lockinYears);
    const invested = P * yearsLeft;
    return { corpus, invested, interest: corpus - invested, yearsLeft, maturityAge };
  }, [annual, girlAge]);
  const fmt = (n: number) => { if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`; if (n >= 100000) return `₹${(n/100000).toFixed(2)} L`; return `₹${Math.round(n).toLocaleString('en-IN')}`; };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Annual Deposit (₹)</label><input type="number" className="tool-input" value={annual} onChange={e => setAnnual(e.target.value)} min="250" max="150000" /></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Girl's Current Age (years)</label><input type="number" className="tool-input" value={girlAge} onChange={e => setGirlAge(e.target.value)} min="0" max="9" /></div>
      </div>
      <div className="bg-brand-500/10 border border-brand-400/20 rounded-xl p-3 text-sm text-slate-300 flex gap-2">
        <span>📌</span><span>Interest Rate: <strong className="text-brand-300">8.2% p.a.</strong> (Q1 2026) · EEE Tax Status · Deposits for {result.yearsLeft} years · Matures at age {result.maturityAge}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{ l: 'Total Deposited', v: fmt(result.invested) }, { l: 'Interest Earned', v: fmt(result.interest) }, { l: 'Maturity Amount', v: fmt(result.corpus) }].map(r => (
          <div key={r.l} className="bg-white/3 border border-white/10 rounded-2xl p-4 text-center">
            <div className="font-sans text-lg font-extrabold gradient-text">{r.v}</div>
            <div className="text-xs text-slate-500 mt-1">{r.l}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600 text-center">All returns are tax-free (EEE status). 80C deduction up to ₹1.5L/year applies.</p>
    </div>
  );
}
