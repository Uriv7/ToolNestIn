'use client';
import { useState } from 'react';

export default function HRACalculator() {
  const [basic, setBasic] = useState('');
  const [da, setDa] = useState('');
  const [hraReceived, setHraReceived] = useState('');
  const [rentPaid, setRentPaid] = useState('');
  const [isMetro, setIsMetro] = useState(true);

  const b = parseFloat(basic) || 0;
  const d = parseFloat(da) || 0;
  const h = parseFloat(hraReceived) || 0;
  const r = parseFloat(rentPaid) || 0;
  const basicDA = b + d;

  const c1 = h;
  const c2 = isMetro ? basicDA * 0.5 : basicDA * 0.4;
  const c3 = Math.max(0, r - basicDA * 0.1);
  const exemption = Math.min(c1, c2, c3);
  const taxable = Math.max(0, h - exemption);

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
  const show = b > 0 && h > 0 && r > 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Basic Salary (₹/mo)</label>
          <input type="number" className="tool-input" placeholder="40000" value={basic} onChange={e => setBasic(e.target.value)}  aria-label="Basic Salary (₹/mo)"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">DA (₹/mo, if any)</label>
          <input type="number" className="tool-input" placeholder="0" value={da} onChange={e => setDa(e.target.value)}  aria-label="DA (₹/mo, if any)"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">HRA Received (₹/mo)</label>
          <input type="number" className="tool-input" placeholder="20000" value={hraReceived} onChange={e => setHraReceived(e.target.value)}  aria-label="HRA Received (₹/mo)"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Rent Paid (₹/mo)</label>
          <input type="number" className="tool-input" placeholder="18000" value={rentPaid} onChange={e => setRentPaid(e.target.value)}  aria-label="Rent Paid (₹/mo)"/>
        </div>
      </div>
      <div className="flex gap-2">
        {[true, false].map(m => (
          <button key={String(m)} onClick={() => setIsMetro(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${isMetro === m ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {m ? '🏙️ Metro City (Delhi/Mumbai/Kolkata/Chennai)' : '🏘️ Non-Metro City'}
          </button>
        ))}
      </div>
      {show && (
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">HRA Exemption — Minimum of 3 criteria</p>
          {[
            { label: 'Actual HRA received', value: c1, winner: Math.min(c1,c2,c3) === c1 },
            { label: `${isMetro?'50%':'40%'} of Basic+DA`, value: c2, winner: Math.min(c1,c2,c3) === c2 },
            { label: 'Rent − 10% of Basic+DA', value: c3, winner: Math.min(c1,c2,c3) === c3 },
          ].map(row => (
            <div key={row.label} className={`flex justify-between items-center py-2 border-b border-white/5 ${row.winner ? 'text-brand-300' : 'text-slate-400'}`}>
              <span className="text-sm">{row.winner && '✓ '}{row.label}</span>
              <span className={`font-bold ${row.winner ? 'gradient-text text-lg' : ''}`}>{fmt(row.value)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <span className="text-slate-300 font-bold">HRA Exemption</span>
            <span className="gradient-text font-extrabold text-xl">{fmt(exemption)}/mo</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Taxable HRA</span>
            <span className="text-red-400 font-bold">{fmt(taxable)}/mo</span>
          </div>
          <div className="flex justify-between text-sm border-t border-white/5 pt-2">
            <span className="text-slate-400">Annual HRA Exemption</span>
            <span className="text-emerald-400 font-bold">{fmt(exemption * 12)}/year</span>
          </div>
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">Section 10(13A) exemption calculation. Client-side only.</p>
    </div>
  );
}
