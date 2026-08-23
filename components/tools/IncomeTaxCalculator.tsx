'use client';
import { useState, useMemo } from 'react';

// Old Regime — exemption threshold varies by age (unchanged by Budget 2025);
// rate structure above the exemption threshold is the same 5%/20%/30% for all ages.
function getOldSlabs(age: 'below60' | '60to80' | 'above80') {
  const exempt = age === 'above80' ? 500000 : age === '60to80' ? 300000 : 250000;
  return [
    { limit: exempt,     rate: 0    },
    { limit: 500000,     rate: 0.05 },
    { limit: 1000000,    rate: 0.20 },
    { limit: Infinity,   rate: 0.30 },
  ];
}
// New Regime — Budget 2025 slabs, effective FY 2025-26 (AY 2026-27). Same for all ages.
const NEW_SLABS = [
  { limit: 400000,  rate: 0    },
  { limit: 800000,  rate: 0.05 },
  { limit: 1200000, rate: 0.10 },
  { limit: 1600000, rate: 0.15 },
  { limit: 2000000, rate: 0.20 },
  { limit: 2400000, rate: 0.25 },
  { limit: Infinity,rate: 0.30 },
];

function calcTax(income: number, slabs: ReturnType<typeof getOldSlabs>) {
  let tax = 0, prev = 0;
  for (const slab of slabs) {
    if (income <= prev) break;
    tax += Math.min(income - prev, slab.limit - prev) * slab.rate;
    prev = slab.limit;
  }
  return tax;
}

export default function IncomeTaxCalculator() {
  const [income, setIncome]     = useState('');
  const [deductions, setDed]    = useState('150000');
  const [hra, setHra]           = useState('0');
  const [other, setOther]       = useState('0');
  const [age, setAge]           = useState<'below60'|'60to80'|'above80'>('below60');

  const result = useMemo(() => {
    const gross = parseFloat(income) || 0;
    if (!gross) return null;

    const stdDedOld = 50000;   // Old Regime standard deduction — unchanged, NOT 75,000
    const stdDedNew = 75000;   // New Regime standard deduction (Budget 2024, retained in Budget 2025)
    const ded80c    = Math.min(parseFloat(deductions)||0, 150000);
    const hraEx     = parseFloat(hra)||0;
    const otherDed  = parseFloat(other)||0;

    // Old regime
    const oldTaxable = Math.max(0, gross - stdDedOld - ded80c - hraEx - otherDed);
    const oldTax        = calcTax(oldTaxable, getOldSlabs(age));
    // Rebate 87A (Old Regime) — unchanged by Budget 2025: full rebate up to ₹5L taxable, capped at ₹12,500
    // Rebate applies BEFORE cess (matches actual computation order under the Income Tax Act)
    const oldRebateAmt  = oldTaxable <= 500000 ? Math.min(oldTax, 12500) : 0;
    const oldTaxAfterRebate = Math.max(0, oldTax - oldRebateAmt);
    const oldCess        = oldTaxAfterRebate * 0.04;
    const oldFinal        = oldTaxAfterRebate + oldCess;

    // New regime
    const newTaxable = Math.max(0, gross - stdDedNew);
    const newTax        = calcTax(newTaxable, NEW_SLABS);
    // Rebate 87A (New Regime) — Budget 2025: full rebate up to ₹12L taxable income, capped at ₹60,000
    // (tax on exactly ₹12L under the slabs above is exactly ₹60,000, so effective tax is nil up to ₹12L —
    // rebate must be applied before cess, or someone at exactly ₹12L would wrongly show cess still owed)
    const newRebateAmt  = newTaxable <= 1200000 ? Math.min(newTax, 60000) : 0;
    const newTaxAfterRebate = Math.max(0, newTax - newRebateAmt);
    const newCess        = newTaxAfterRebate * 0.04;
    const newFinal        = newTaxAfterRebate + newCess;

    const better = oldFinal < newFinal ? 'old' : 'new';
    const saving  = Math.abs(oldFinal - newFinal);

    return { oldTaxable, oldFinal, newTaxable, newFinal, better, saving, gross };
  }, [income, deductions, hra, other, age]);

  const fmt = (n: number) => {
    if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`;
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
  };
  const fmtFull = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Annual Gross Income (₹)</label>
          <input type="number" className="tool-input text-lg" value={income} onChange={e => setIncome(e.target.value)} placeholder="1,200,000" aria-label="Annual Gross Income in Rupees" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">80C Investments (₹, max 1.5L)</label>
          <input type="number" className="tool-input" value={deductions} onChange={e => setDed(e.target.value)} placeholder="150000" aria-label="Section 80C Investments in Rupees, maximum 1.5 lakh" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">HRA Exemption (₹)</label>
          <input type="number" className="tool-input" value={hra} onChange={e => setHra(e.target.value)} placeholder="0" aria-label="HRA Exemption in Rupees" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Other Deductions (₹)</label>
          <input type="number" className="tool-input" value={other} onChange={e => setOther(e.target.value)} placeholder="0" aria-label="Other Deductions in Rupees" />
        </div>
      </div>

      {/* Age */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Age Group</label>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Age Group">
          {([['below60','Below 60'],['60to80','60–80 yrs'],['above80','Above 80']] as const).map(([v,l]) => (
            <button key={v} onClick={() => setAge(v)} aria-pressed={age === v}
              className="py-2 rounded-xl text-sm font-semibold border transition-all"
              style={{ background: age===v ? 'rgba(12,147,240,0.12)' : 'rgba(255,255,255,0.03)', borderColor: age===v ? 'rgba(12,147,240,0.4)' : 'rgba(255,255,255,0.08)', color: age===v ? '#36b0fb' : '#64748b' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <>
          {/* Recommendation banner */}
          <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{
            background: result.better === 'new' ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.08)',
            border: `1px solid ${result.better === 'new' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)'}`,
          }}>
            <span className="text-xl" aria-hidden="true">{result.better === 'new' ? '✅' : '💡'}</span>
            <div>
              <p className="text-sm font-bold" style={{ color: result.better === 'new' ? '#34d399' : '#60a5fa' }}>
                {result.better === 'new' ? 'New Regime' : 'Old Regime'} saves you {fmtFull(result.saving)} this year
              </p>
              <p className="text-xs text-slate-500 mt-0.5">FY 2025-26 · Std. deduction: ₹50,000 (Old) / ₹75,000 (New)</p>
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Old Regime', taxable: result.oldTaxable, tax: result.oldFinal, isBetter: result.better === 'old' },
              { label: 'New Regime', taxable: result.newTaxable, tax: result.newFinal, isBetter: result.better === 'new' },
            ].map(r => (
              <div key={r.label} className="rounded-2xl p-5 text-center relative overflow-hidden" style={{
                background: r.isBetter ? 'rgba(12,147,240,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${r.isBetter ? 'rgba(12,147,240,0.3)' : 'rgba(255,255,255,0.07)'}`,
              }}>
                {r.isBetter && (
                  <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(12,147,240,0.2)', color: '#36b0fb' }}>Better</span>
                )}
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>{r.label}</p>
                <p className="text-2xl font-black" style={{ color: r.isBetter ? '#36b0fb' : '#94a3b8' }}>{fmtFull(r.tax)}</p>
                <p className="text-xs mt-1" style={{ color: '#475569' }}>Taxable: {fmt(r.taxable)}</p>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Eff. rate: {result.gross > 0 ? ((r.tax/result.gross)*100).toFixed(1) : 0}%</p>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-center" style={{ color: '#334155' }}>
        FY 2025-26 (AY 2026-27). Includes 4% health & education cess. Surcharge not included.
      </p>
    </div>
  );
}
