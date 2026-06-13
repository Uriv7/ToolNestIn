'use client';
import { useState, useMemo } from 'react';

const OLD_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];

const NEW_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 5 },
  { min: 700000, max: 1000000, rate: 10 },
  { min: 1000000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 },
];

function calcTax(income: number, slabs: typeof OLD_SLABS) {
  let tax = 0;
  for (const slab of slabs) {
    if (income <= slab.min) break;
    const taxable = Math.min(income, slab.max) - slab.min;
    tax += (taxable * slab.rate) / 100;
  }
  return tax;
}

function addSurchargeAndCess(tax: number, income: number) {
  let surcharge = 0;
  if (income > 5000000 && income <= 10000000) surcharge = tax * 0.10;
  else if (income > 10000000 && income <= 20000000) surcharge = tax * 0.15;
  else if (income > 20000000 && income <= 50000000) surcharge = tax * 0.25;
  else if (income > 50000000) surcharge = tax * 0.37;
  const cess = (tax + surcharge) * 0.04;
  return { surcharge, cess, total: tax + surcharge + cess };
}

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState('');
  const [age, setAge] = useState<'below60' | '60to80' | 'above80'>('below60');

  // Old regime deductions
  const [sec80c, setSec80c] = useState('150000');
  const [hra, setHra] = useState('');
  const [nps, setNps] = useState('');
  const [homeLoanInt, setHomeLoanInt] = useState('');
  const [otherDed, setOtherDed] = useState('');

  const result = useMemo(() => {
    const grossIncome = parseFloat(income) || 0;
    if (!grossIncome) return null;

    // Old regime
    const stdDed = 50000;
    const totalDed = stdDed +
      Math.min(parseFloat(sec80c) || 0, 150000) +
      Math.min(parseFloat(nps) || 0, 50000) +
      Math.min(parseFloat(homeLoanInt) || 0, 200000) +
      (parseFloat(hra) || 0) +
      (parseFloat(otherDed) || 0);

    const oldTaxableIncome = Math.max(0, grossIncome - totalDed);

    // Senior citizen exemption adjustments
    let oldSlabs = [...OLD_SLABS];
    if (age === '60to80') oldSlabs[0] = { ...oldSlabs[0], max: 300000 };
    if (age === 'above80') { oldSlabs[0] = { ...oldSlabs[0], max: 500000 }; oldSlabs[1] = { ...oldSlabs[1], min: 500000 }; }

    const oldBaseTax = calcTax(oldTaxableIncome, oldSlabs);
    // Rebate u/s 87A
    const oldRebate = oldTaxableIncome <= 500000 ? Math.min(oldBaseTax, 12500) : 0;
    const oldTaxAfterRebate = Math.max(0, oldBaseTax - oldRebate);
    const oldFinal = addSurchargeAndCess(oldTaxAfterRebate, oldTaxableIncome);

    // New regime (2026-27)
    const newStdDed = 75000;
    const newTaxableIncome = Math.max(0, grossIncome - newStdDed);
    const newBaseTax = calcTax(newTaxableIncome, NEW_SLABS);
    const newRebate = newTaxableIncome <= 700000 ? Math.min(newBaseTax, 25000) : 0;
    const newTaxAfterRebate = Math.max(0, newBaseTax - newRebate);
    const newFinal = addSurchargeAndCess(newTaxAfterRebate, newTaxableIncome);

    return {
      old: { taxable: oldTaxableIncome, base: oldBaseTax, rebate: oldRebate, ...oldFinal, deductions: totalDed },
      new: { taxable: newTaxableIncome, base: newBaseTax, rebate: newRebate, ...newFinal, deductions: newStdDed },
      savings: oldFinal.total - newFinal.total,
      better: oldFinal.total <= newFinal.total ? 'old' : 'new',
    };
  }, [income, age, sec80c, hra, nps, homeLoanInt, otherDed]);

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Income & Age */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Annual Income (₹)</label>
          <input type="number" className="tool-input text-lg font-700" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 1200000" />
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Age Group</label>
          <select className="tool-input" value={age} onChange={e => setAge(e.target.value as any)}>
            <option value="below60">Below 60 years</option>
            <option value="60to80">Senior Citizen (60–80)</option>
            <option value="above80">Super Senior (80+)</option>
          </select>
        </div>
      </div>

      {/* Old Regime Deductions */}
      <div className="glass rounded-xl p-4">
        <h3 className="text-sm font-700 text-slate-300 mb-3">Old Regime Deductions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: '80C (max ₹1.5L)', val: sec80c, set: setSec80c, placeholder: '150000' },
            { label: 'HRA Exemption', val: hra, set: setHra, placeholder: '0' },
            { label: '80CCD NPS (max ₹50K)', val: nps, set: setNps, placeholder: '50000' },
            { label: 'Home Loan Interest (max ₹2L)', val: homeLoanInt, set: setHomeLoanInt, placeholder: '0' },
            { label: 'Other Deductions', val: otherDed, set: setOtherDed, placeholder: '0' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs text-slate-500 mb-1">{f.label}</label>
              <input type="number" className="tool-input text-sm py-2" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} />
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Recommendation */}
          <div className={`rounded-2xl p-4 border text-center ${result.better === 'new' ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-brand-500/10 border-brand-400/30'}`}>
            <div className="text-lg font-800 text-slate-100 mb-1">
              {result.better === 'new' ? '✅ New Regime is better for you' : '✅ Old Regime is better for you'}
            </div>
            <div className="text-sm text-slate-400">
              You save <strong className="text-emerald-400">{fmt(Math.abs(result.savings))}</strong> by choosing the {result.better} regime
            </div>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Old Regime', data: result.old, color: 'brand' },
              { label: 'New Regime 2026', data: result.new, color: 'emerald' },
            ].map(r => (
              <div key={r.label} className="glass rounded-xl p-4">
                <h4 className="font-700 text-slate-200 mb-3 text-sm">{r.label}</h4>
                <div className="space-y-2">
                  {[
                    { l: 'Gross Income', v: fmt(parseFloat(income) || 0) },
                    { l: 'Deductions', v: fmt(r.data.deductions) },
                    { l: 'Taxable Income', v: fmt(r.data.taxable) },
                    { l: 'Base Tax', v: fmt(r.data.base) },
                    { l: 'Rebate 87A', v: `−${fmt(r.data.rebate)}` },
                    { l: 'Surcharge', v: fmt(r.data.surcharge) },
                    { l: 'Health & Edu Cess (4%)', v: fmt(r.data.cess) },
                  ].map(row => (
                    <div key={row.l} className="flex justify-between text-xs border-b border-white/5 pb-1">
                      <span className="text-slate-500">{row.l}</span>
                      <span className="text-slate-300 font-600">{row.v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-1">
                    <span className="text-sm font-700 text-slate-200">Total Tax</span>
                    <span className="text-lg font-900 gradient-text">{fmt(r.data.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">Effective Rate</span>
                    <span className="text-xs text-slate-300">{((r.data.total / (parseFloat(income) || 1)) * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-600 text-center">Based on Union Budget 2025–26 (AY 2026–27). Consult a CA for final tax planning.</p>
    </div>
  );
}
