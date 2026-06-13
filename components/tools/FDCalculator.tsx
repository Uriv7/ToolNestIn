'use client';
import { useState, useMemo } from 'react';

export default function FDCalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('7.1');
  const [years, setYears] = useState('3');
  const [compound, setCompound] = useState<'quarterly' | 'monthly' | 'annually'>('quarterly');

  const result = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = compound === 'quarterly' ? 4 : compound === 'monthly' ? 12 : 1;
    const maturity = P * Math.pow(1 + r / n, n * t);
    const interest = maturity - P;
    // TDS at 10% if interest > 40000 (50000 for seniors)
    const tds = interest > 40000 ? interest * 0.10 : 0;
    return { maturity, interest, tds, netMaturity: maturity - tds };
  }, [principal, rate, years, compound]);

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  const BANKS = [
    { name: 'SBI', rate: '6.80' },
    { name: 'HDFC', rate: '7.10' },
    { name: 'ICICI', rate: '7.10' },
    { name: 'Axis', rate: '7.10' },
    { name: 'Post Office', rate: '7.50' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-1">
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Principal (₹)</label>
          <input type="number" className="tool-input" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Rate (% p.a.)</label>
          <input type="number" className="tool-input" value={rate} onChange={e => setRate(e.target.value)} step="0.1" />
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Duration (years)</label>
          <input type="number" className="tool-input" value={years} onChange={e => setYears(e.target.value)} step="0.5" min="0.5" max="10" />
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Compounding</label>
          <select className="tool-input" value={compound} onChange={e => setCompound(e.target.value as any)}>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
      </div>

      {/* Quick bank rates */}
      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Quick Select Bank Rate</label>
        <div className="flex gap-2 flex-wrap">
          {BANKS.map(b => (
            <button key={b.name} onClick={() => setRate(b.rate)}
              className="px-3 py-1.5 rounded-lg text-xs border bg-white/3 border-white/10 text-slate-400 hover:border-brand-400/40 hover:text-brand-300 transition">
              {b.name} {b.rate}%
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: 'Invested', v: fmt(parseFloat(principal) || 0) },
          { l: 'Interest Earned', v: fmt(result.interest) },
          { l: 'TDS Deducted', v: fmt(result.tds) },
          { l: 'Maturity Amount', v: fmt(result.netMaturity), h: true },
        ].map(r => (
          <div key={r.l} className={`rounded-2xl p-4 border text-center ${r.h ? 'bg-brand-500/15 border-brand-400/40' : 'bg-white/3 border-white/10'}`}>
            <div className={`font-display text-lg font-800 ${r.h ? 'gradient-text' : 'text-slate-200'}`}>{r.v}</div>
            <div className="text-xs text-slate-500 mt-1">{r.l}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600 text-center">TDS deducted at 10% if annual interest exceeds ₹40,000. Rates as of 2026.</p>
    </div>
  );
}
