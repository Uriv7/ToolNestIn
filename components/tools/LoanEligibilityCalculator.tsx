'use client';
import { useState } from 'react';
export default function LoanEligibilityCalculator() {
  const [netIncome, setNetIncome] = useState('');
  const [existingEmi, setExistingEmi] = useState('0');
  const [foirPct, setFoirPct] = useState('50');
  const [rate, setRate] = useState('8.75');
  const [tenure, setTenure] = useState('20');
  const ni = parseFloat(netIncome) || 0;
  const ee = parseFloat(existingEmi) || 0;
  const foir = parseFloat(foirPct) / 100;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = (parseInt(tenure) || 20) * 12;
  const maxEmi = ni * foir - ee;
  const loanAmount = maxEmi > 0 && r > 0 ? maxEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : 0;
  const fmt = (n: number) => { if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`; if (n >= 100000) return `₹${(n/100000).toFixed(2)} L`; return `₹${Math.round(n).toLocaleString('en-IN')}`; };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Net Monthly Income (₹)</label><input type="number" className="tool-input" value={netIncome} onChange={e => setNetIncome(e.target.value)} placeholder="100000" /></div>
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Existing EMIs (₹/mo)</label><input type="number" className="tool-input" value={existingEmi} onChange={e => setExistingEmi(e.target.value)} placeholder="0" /></div>
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Interest Rate (% p.a.)</label><input type="number" className="tool-input" value={rate} onChange={e => setRate(e.target.value)} step="0.05" /></div>
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Loan Tenure (years)</label><input type="number" className="tool-input" value={tenure} onChange={e => setTenure(e.target.value)} min="1" max="30" /></div>
      </div>
      <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Bank FOIR Limit: {foirPct}%</label>
        <input type="range" min="40" max="60" step="5" value={foirPct} onChange={e => setFoirPct(e.target.value)} className="w-full" />
        <div className="flex justify-between text-xs text-slate-500 mt-1"><span>40% (Conservative)</span><span>50% (Most banks)</span><span>60% (Aggressive)</span></div>
      </div>
      {ni > 0 && loanAmount > 0 && (
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 space-y-3">
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Maximum Eligible Loan</div>
            <div className="gradient-text font-800 text-4xl">{fmt(loanAmount)}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-sm">
            <div><span className="text-slate-400">Max EMI capacity</span><div className="text-slate-200 font-700">{fmt(maxEmi)}/mo</div></div>
            <div><span className="text-slate-400">Available after existing EMIs</span><div className="text-slate-200 font-700">{fmt(maxEmi)}/mo</div></div>
          </div>
        </div>
      )}
      {maxEmi <= 0 && ni > 0 && <p className="text-red-400 text-sm text-center">⚠️ Existing EMIs exceed FOIR limit. Loan may not be approved.</p>}
      <p className="text-xs text-slate-600 text-center">Based on FOIR norms. Actual eligibility subject to bank credit policy and CIBIL score.</p>
    </div>
  );
}
