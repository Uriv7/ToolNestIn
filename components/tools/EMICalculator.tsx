'use client';
import { useState, useMemo } from 'react';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState('500000');
  const [rate, setRate] = useState('8.5');
  const [tenure, setTenure] = useState('60');
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 12 / 100;
    const n = parseInt(tenure) || 0;
    if (!P || !r || !n) return null;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    const interest = total - P;
    return { emi, total, interest, P, r, n };
  }, [principal, rate, tenure]);

  const schedule = useMemo(() => {
    if (!result || !showTable) return [];
    let balance = result.P;
    return Array.from({ length: result.n }, (_, i) => {
      const intPart = balance * result.r;
      const prinPart = result.emi - intPart;
      balance -= prinPart;
      return { month: i + 1, emi: result.emi, principal: prinPart, interest: intPart, balance: Math.max(0, balance) };
    });
  }, [result, showTable]);

  const fmt = (n: number) => `₹${n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Loan Amount (₹)', val: principal, set: setPrincipal, placeholder: '500000', min: '1000' },
          { label: 'Interest Rate (% per year)', val: rate, set: setRate, placeholder: '8.5', min: '0.1' },
          { label: 'Tenure (months)', val: tenure, set: setTenure, placeholder: '60', min: '1' },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">{f.label}</label>
            <input type="number" className="tool-input" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} min={f.min} />
          </div>
        ))}
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Monthly EMI', value: fmt(result.emi), highlight: true },
              { label: 'Total Interest', value: fmt(result.interest), highlight: false },
              { label: 'Total Payment', value: fmt(result.total), highlight: false },
            ].map(r => (
              <div key={r.label} className={`rounded-2xl p-5 border text-center ${r.highlight ? 'bg-brand-500/15 border-brand-400/40' : 'bg-white/3 border-white/10'}`}>
                <div className={`font-display text-2xl font-800 mb-1 ${r.highlight ? 'gradient-text' : 'text-slate-200'}`}>{r.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">{r.label}</div>
              </div>
            ))}
          </div>

          {/* Pie-like bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Principal: {((result.P / result.total) * 100).toFixed(1)}%</span>
              <span>Interest: {((result.interest / result.total) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden bg-white/5 flex">
              <div className="bg-brand-400 h-full transition-all" style={{ width: `${(result.P / result.total) * 100}%` }} />
              <div className="bg-rose-500/70 h-full flex-1" />
            </div>
          </div>

          <button onClick={() => setShowTable(!showTable)} className="btn-secondary w-full">
            {showTable ? '▲ Hide' : '▼ Show'} Full Amortization Schedule
          </button>

          {showTable && (
            <div className="overflow-x-auto rounded-xl border border-white/10 max-h-80 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-dark-800">
                  <tr>
                    {['Month', 'EMI', 'Principal', 'Interest', 'Balance'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-slate-400 font-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schedule.map(row => (
                    <tr key={row.month} className="border-t border-white/5 hover:bg-white/3 transition">
                      <td className="px-4 py-2.5 text-slate-400">{row.month}</td>
                      <td className="px-4 py-2.5 text-slate-300 font-mono">{fmt(row.emi)}</td>
                      <td className="px-4 py-2.5 text-brand-400 font-mono">{fmt(row.principal)}</td>
                      <td className="px-4 py-2.5 text-rose-400 font-mono">{fmt(row.interest)}</td>
                      <td className="px-4 py-2.5 text-slate-400 font-mono">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
