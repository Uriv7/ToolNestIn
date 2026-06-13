'use client';
import { useState, useMemo } from 'react';

const PPF_RATE = 7.1; // Current PPF rate 2026

export default function PPFCalculator() {
  const [yearly, setYearly] = useState('150000');
  const [years, setYears] = useState('15');
  const [extendYears, setExtendYears] = useState('0');

  const result = useMemo(() => {
    const P = Math.min(parseFloat(yearly) || 0, 150000); // Max ₹1.5L/year
    const n = parseInt(years) || 15;
    const r = PPF_RATE / 100;
    const ext = parseInt(extendYears) || 0;

    // PPF compounded annually
    let balance = 0;
    const yearlyData = [];
    for (let y = 1; y <= n; y++) {
      balance = (balance + P) * (1 + r);
      yearlyData.push({ year: y, balance, invested: P * y });
    }
    const maturity = balance;
    const totalInvested = P * n;

    // Extension period (in blocks of 5 years)
    let extBalance = maturity;
    for (let y = 1; y <= ext; y++) {
      extBalance = (extBalance + P) * (1 + r);
    }

    return {
      maturity,
      totalInvested,
      interest: maturity - totalInvested,
      extMaturity: extBalance,
      extInterest: extBalance - totalInvested - P * ext,
      yearlyData,
    };
  }, [yearly, years, extendYears]);

  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-5">
      <div className="glass rounded-xl p-3 text-center">
        <span className="text-xs text-amber-400">Current PPF Interest Rate: <strong>7.1% p.a.</strong> (Q1 2026) — Tax-free, EEE status</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Yearly Investment (₹)</label>
          <input type="number" className="tool-input" value={yearly} onChange={e => setYearly(e.target.value)} max="150000" />
          <p className="text-xs text-slate-600 mt-1">Max ₹1,50,000/year</p>
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Lock-in Period</label>
          <select className="tool-input" value={years} onChange={e => setYears(e.target.value)}>
            <option value="15">15 years (minimum)</option>
            <option value="20">20 years</option>
            <option value="25">25 years</option>
            <option value="30">30 years</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Extension (5yr blocks)</label>
          <select className="tool-input" value={extendYears} onChange={e => setExtendYears(e.target.value)}>
            <option value="0">No extension</option>
            <option value="5">+5 years</option>
            <option value="10">+10 years</option>
            <option value="15">+15 years</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/3 border border-white/10 rounded-2xl p-4 text-center">
          <div className="font-display text-xl font-800 text-slate-200">{fmt(result.totalInvested)}</div>
          <div className="text-xs text-slate-500 mt-1">Total Invested</div>
        </div>
        <div className="bg-white/3 border border-white/10 rounded-2xl p-4 text-center">
          <div className="font-display text-xl font-800 text-emerald-400">{fmt(result.interest)}</div>
          <div className="text-xs text-slate-500 mt-1">Tax-free Interest</div>
        </div>
        <div className="bg-brand-500/15 border border-brand-400/40 rounded-2xl p-4 text-center">
          <div className="font-display text-xl font-800 gradient-text">{fmt(result.maturity)}</div>
          <div className="text-xs text-slate-500 mt-1">Maturity Value</div>
        </div>
      </div>

      {/* Year by year mini chart */}
      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-3">Growth Over {years} Years</label>
        <div className="flex items-end gap-0.5 h-24">
          {result.yearlyData.map(d => (
            <div key={d.year} className="flex-1 flex flex-col justify-end" style={{ height: '100%' }}>
              <div className="w-full rounded-t-sm bg-emerald-400/50 transition-all"
                style={{ height: `${((d.balance - d.invested) / result.maturity) * 100}%` }} />
              <div className="w-full bg-brand-500/40"
                style={{ height: `${(d.invested / result.maturity) * 100}%` }} />
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-600 text-center">PPF interest is completely tax-free under Section 10(11). EEE tax benefit on invest, interest, and withdrawal.</p>
    </div>
  );
}
