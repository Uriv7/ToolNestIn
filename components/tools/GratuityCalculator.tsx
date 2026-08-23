'use client';
import { useState } from 'react';

export default function GratuityCalculator() {
  const [basic, setBasic] = useState('');
  const [da, setDa] = useState('');
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('0');
  const [empType, setEmpType] = useState<'act'|'non-act'>('act');

  const b = parseFloat(basic) || 0;
  const d = parseFloat(da) || 0;
  const y = parseInt(years) || 0;
  const m = parseInt(months) || 0;
  const totalYears = y + (m >= 6 ? 1 : 0);
  const basicDA = b + d;

  const gratuity = empType === 'act'
    ? (basicDA * 15 / 26) * totalYears
    : (basicDA * 15 / 30) * totalYears;

  const taxFreeLimit = 2000000;
  const taxable = Math.max(0, gratuity - taxFreeLimit);
  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
  const show = b > 0 && y >= 5;

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['act','non-act'] as const).map(t => (
          <button key={t} onClick={() => setEmpType(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${empType===t?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {t==='act'?'🏢 Covered under Gratuity Act':'🏠 Not covered (15/30 formula)'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Last Basic Salary (₹/mo)</label>
          <input type="number" className="tool-input" placeholder="50000" value={basic} onChange={e => setBasic(e.target.value)}  aria-label="Last Basic Salary (₹/mo)"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">DA (₹/mo, if any)</label>
          <input type="number" className="tool-input" placeholder="0" value={da} onChange={e => setDa(e.target.value)}  aria-label="DA (₹/mo, if any)"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Years of Service</label>
          <input type="number" className="tool-input" placeholder="10" value={years} onChange={e => setYears(e.target.value)} min="5"  aria-label="Years of Service"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Months (in addition)</label>
          <input type="number" className="tool-input" placeholder="6" value={months} onChange={e => setMonths(e.target.value)} min="0" max="11"  aria-label="Months (in addition)"/>
        </div>
      </div>
      {y > 0 && y < 5 && <p className="text-amber-400 text-sm text-center">⚠️ Minimum 5 years of service required for gratuity eligibility.</p>}
      {show && (
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 space-y-3">
          <div className="flex justify-between"><span className="text-slate-400 text-sm">Formula</span><span className="text-slate-300 text-sm">(Basic+DA) × 15/{empType==='act'?'26':'30'} × {totalYears} yrs</span></div>
          <div className="flex justify-between border-t border-white/5 pt-3">
            <span className="text-slate-300 font-bold">Gratuity Amount</span>
            <span className="gradient-text font-extrabold text-2xl">{fmt(gratuity)}</span>
          </div>
          <div className="flex justify-between text-sm"><span className="text-slate-400">Tax-Free (up to ₹20L)</span><span className="text-emerald-400 font-bold">{fmt(Math.min(gratuity, taxFreeLimit))}</span></div>
          {taxable > 0 && <div className="flex justify-between text-sm"><span className="text-slate-400">Taxable Amount</span><span className="text-red-400 font-bold">{fmt(taxable)}</span></div>}
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">Payment of Gratuity Act, 1972. Tax-free limit: ₹20 lakh (2024 amendment).</p>
    </div>
  );
}
