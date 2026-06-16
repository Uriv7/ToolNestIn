'use client';
import { useState } from 'react';

export default function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tip, setTip] = useState(18);
  const [people, setPeople] = useState('1');
  const TIPS = [10, 15, 18, 20, 25];

  const b = parseFloat(bill) || 0;
  const n = parseInt(people) || 1;
  const tipAmt = (b * tip) / 100;
  const total = b + tipAmt;
  const perPerson = total / n;
  const tipPerPerson = tipAmt / n;

  const fmt = (v: number) => `$${v.toFixed(2)}`;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Bill Amount ($)</label>
        <input type="number" className="tool-input text-lg" value={bill} onChange={e => setBill(e.target.value)} placeholder="0.00" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Tip Percentage</label>
        <div className="flex gap-2 flex-wrap">
          {TIPS.map(t => (
            <button key={t} onClick={() => setTip(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition border ${tip === t ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
              {t}%
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Number of People</label>
        <div className="flex items-center gap-3">
          <button onClick={() => setPeople(String(Math.max(1, n - 1)))} className="btn-secondary w-10 h-10 flex items-center justify-center text-lg">−</button>
          <input type="number" className="tool-input text-center text-lg font-bold" value={people} onChange={e => setPeople(e.target.value)} min="1" />
          <button onClick={() => setPeople(String(n + 1))} className="btn-secondary w-10 h-10 flex items-center justify-center text-lg">+</button>
        </div>
      </div>

      {b > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { l: 'Tip Amount', v: fmt(tipAmt) },
            { l: 'Total Bill', v: fmt(total) },
            { l: 'Tip per Person', v: fmt(tipPerPerson) },
            { l: 'Total per Person', v: fmt(perPerson), highlight: true },
          ].map(r => (
            <div key={r.l} className={`rounded-2xl p-4 border text-center ${r.highlight ? 'bg-brand-500/15 border-brand-400/40' : 'bg-white/3 border-white/10'}`}>
              <div className={`font-sans text-2xl font-extrabold ${r.highlight ? 'gradient-text' : 'text-slate-200'}`}>{r.v}</div>
              <div className="text-xs text-slate-500 mt-1">{r.l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
