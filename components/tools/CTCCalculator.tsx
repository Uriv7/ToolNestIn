'use client';
import { useState, useMemo } from 'react';

export default function CTCCalculator() {
  const [ctc, setCtc] = useState('1200000');
  const [regime, setRegime] = useState<'new' | 'old'>('new');
  const [pfOpt, setPfOpt] = useState(true);

  const result = useMemo(() => {
    const annual = parseFloat(ctc) || 0;

    // Typical CTC breakup
    const basic = annual * 0.40;
    const hra = basic * 0.50;
    const special = annual - basic - hra - (annual * 0.12) - 21600; // rest is special allowance
    const employerPF = pfOpt ? Math.min(basic * 0.12, 21600) : 0;
    const employeePF = pfOpt ? Math.min(basic * 0.12, 21600) : 0;
    const gratuity = basic * 0.0481;

    const grossSalary = annual - employerPF - gratuity;

    // Professional tax (~200/month = 2400/year)
    const profTax = 2400;

    // Standard deduction
    const stdDed = regime === 'new' ? 75000 : 50000;

    // Old regime 80C deduction (assumed max)
    const sec80c = regime === 'old' ? 150000 : 0;
    const nps = regime === 'old' ? 50000 : 0;

    const taxableIncome = Math.max(0, grossSalary - stdDed - employeePF - sec80c - nps - profTax);

    // New regime tax — Budget 2025 slabs, effective FY 2025-26 (AY 2026-27)
    const newSlabs = [
      { max: 400000, rate: 0 },
      { max: 800000, rate: 5 },
      { max: 1200000, rate: 10 },
      { max: 1600000, rate: 15 },
      { max: 2000000, rate: 20 },
      { max: 2400000, rate: 25 },
      { max: Infinity, rate: 30 },
    ];
    const oldSlabs = [
      { max: 250000, rate: 0 },
      { max: 500000, rate: 5 },
      { max: 1000000, rate: 20 },
      { max: Infinity, rate: 30 },
    ];

    const calcTax = (inc: number, slabs: typeof newSlabs) => {
      let tax = 0, prev = 0;
      for (const s of slabs) {
        if (inc <= prev) break;
        tax += (Math.min(inc, s.max) - prev) * s.rate / 100;
        prev = s.max;
      }
      return tax;
    };

    const slabs = regime === 'new' ? newSlabs : oldSlabs;
    const baseTax = calcTax(taxableIncome, slabs);
    // Rebate u/s 87A — New Regime: Budget 2025 raised this to a ₹12L taxable-income
    // threshold with a ₹60,000 cap (full rebate up to ₹12L). Old Regime unchanged.
    // Rebate must apply BEFORE cess, or someone exactly at the threshold would wrongly
    // show cess still owed even though their real tax liability is nil.
    const rebate = (regime === 'new' && taxableIncome <= 1200000) ? Math.min(baseTax, 60000) :
                   (regime === 'old' && taxableIncome <= 500000) ? Math.min(baseTax, 12500) : 0;
    const taxAfterRebate = Math.max(0, baseTax - rebate);
    const cess = taxAfterRebate * 0.04;
    const totalTax = taxAfterRebate + cess;

    const monthlyTax = totalTax / 12;
    const monthlyPF = employeePF / 12;
    const monthlyProfTax = profTax / 12;

    const monthlyGross = grossSalary / 12;
    const monthlyInHand = monthlyGross - monthlyTax - monthlyPF - monthlyProfTax;
    const annualInHand = monthlyInHand * 12;

    return {
      annual,
      grossSalary,
      basic: basic / 12,
      hra: hra / 12,
      monthlyGross,
      monthlyPF,
      monthlyTax,
      monthlyProfTax,
      monthlyInHand,
      annualInHand,
      totalTax,
      taxableIncome,
      effectiveRate: (totalTax / annual) * 100,
    };
  }, [ctc, regime, pfOpt]);

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Annual CTC (₹)</label>
          <input type="number" className="tool-input text-lg font-bold" value={ctc} onChange={e => setCtc(e.target.value)} placeholder="1200000"  aria-label="Annual CTC (₹)"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Tax Regime</label>
          <select className="tool-input" value={regime} onChange={e => setRegime(e.target.value as any)}>
            <option value="new">New Regime 2026</option>
            <option value="old">Old Regime</option>
          </select>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setPfOpt(!pfOpt)}
              className={`w-10 h-5 rounded-full transition relative ${pfOpt ? 'bg-brand-500' : 'bg-white/10'}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${pfOpt ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-slate-400">PF Deduction</span>
          </label>
        </div>
      </div>

      {/* Main result */}
      <div className="bg-brand-500/10 border border-brand-400/30 rounded-2xl p-5 text-center">
        <div className="text-sm text-slate-500 mb-1">Monthly In-Hand Salary</div>
        <div className="font-sans text-5xl font-black gradient-text">{fmt(result.monthlyInHand)}</div>
        <div className="text-sm text-slate-500 mt-1">Annual: {fmt(result.annualInHand)}</div>
      </div>

      {/* Breakup */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Monthly Salary Breakup</h3>
        {[
          { l: 'Gross Monthly Salary', v: fmt(result.monthlyGross), color: 'text-slate-200' },
          { l: '− PF (Employee 12%)', v: `−${fmt(result.monthlyPF)}`, color: 'text-rose-400' },
          { l: '− Income Tax (TDS)', v: `−${fmt(result.monthlyTax)}`, color: 'text-rose-400' },
          { l: '− Professional Tax', v: `−${fmt(result.monthlyProfTax)}`, color: 'text-rose-400' },
          { l: '= Net Take Home', v: fmt(result.monthlyInHand), color: 'text-brand-300' },
        ].map(r => (
          <div key={r.l} className="flex justify-between px-4 py-2.5 bg-white/3 border border-white/8 rounded-xl">
            <span className="text-sm text-slate-400">{r.l}</span>
            <span className={`font-bold text-sm ${r.color}`}>{r.v}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between px-4 py-2 text-xs text-slate-600">
        <span>Effective tax rate: {result.effectiveRate.toFixed(2)}%</span>
        <span>Annual tax: {fmt(result.totalTax)}</span>
      </div>
      <p className="text-xs text-slate-600 text-center">Approximate calculation. Actual take-home depends on company structure and individual exemptions.</p>
    </div>
  );
}
