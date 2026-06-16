'use client';
import { useState, useMemo } from 'react';

export default function RDCalculator() {
  const [monthly, setMonthly] = useState('5000');
  const [rate, setRate] = useState('6.7');
  const [months, setMonths] = useState('60');

  const result = useMemo(() => {
    const R = parseFloat(monthly) || 0;
    const n = parseInt(months) || 0;
    const r = (parseFloat(rate) || 0) / 400;
    const quarters = n / 3;
    let maturity = 0;
    for (let i = 1; i <= n; i++) {
      const qRemaining = (n - i + 1) / 3;
      maturity += R * Math.pow(1 + r, qRemaining);
    }
    const invested = R * n;
    return { maturity, invested, interest: maturity - invested };
  }, [monthly, rate, months]);

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
  const PRESETS = [{ label: 'Post Office RD (6.7%)', rate: '6.7', months: '60' }, { label: 'SBI RD (6.5%)', rate: '6.5', months: '12' }, { label: 'HDFC RD (7.0%)', rate: '7.0', months: '24' }];

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => { setRate(p.rate); setMonths(p.months); }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/3 border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 transition">{p.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Monthly Deposit (₹)</label>
          <input type="number" className="tool-input" value={monthly} onChange={e => setMonthly(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Rate (% p.a.)</label>
          <input type="number" className="tool-input" value={rate} onChange={e => setRate(e.target.value)} step="0.1" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Tenure (months)</label>
          <input type="number" className="tool-input" value={months} onChange={e => setMonths(e.target.value)} min="6" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[{ l: 'Total Invested', v: fmt(result.invested) }, { l: 'Interest Earned', v: fmt(result.interest) }, { l: 'Maturity Amount', v: fmt(result.maturity) }].map(r => (
          <div key={r.l} className="bg-white/3 border border-white/10 rounded-2xl p-4 text-center">
            <div className="font-sans text-lg font-extrabold gradient-text">{r.v}</div>
            <div className="text-xs text-slate-500 mt-1">{r.l}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600 text-center">Quarterly compounding as per Indian banking norm. Interest is taxable at slab rate.</p>
    </div>
  );
}
