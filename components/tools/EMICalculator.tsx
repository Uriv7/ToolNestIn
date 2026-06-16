'use client';
import { useState, useMemo } from 'react';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate]           = useState('8.5');
  const [tenure, setTenure]       = useState('20');
  const [tenureType, setTenureType] = useState<'years'|'months'>('years');

  const result = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = tenureType === 'years' ? (parseInt(tenure)||0) * 12 : parseInt(tenure)||0;
    if (!P || !r || !n) return null;
    const emi    = P * r * Math.pow(1+r, n) / (Math.pow(1+r, n) - 1);
    const total  = emi * n;
    const interest = total - P;
    return { emi, total, interest, n };
  }, [principal, rate, tenure, tenureType]);

  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n/10000000).toFixed(2)} Cr`;
    if (n >= 100000)   return `₹${(n/100000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
  };

  const pct = result ? Math.round(result.interest / result.total * 100) : 0;

  const QUICK = [{ l: 'Home Loan', p: '5000000', r: '8.5', t: '20' }, { l: 'Car Loan', p: '800000', r: '9.5', t: '5' }, { l: 'Personal', p: '500000', r: '13', t: '3' }];

  return (
    <div className="space-y-5">

      {/* Quick presets */}
      <div className="flex gap-2 flex-wrap">
        {QUICK.map(q => (
          <button key={q.l} onClick={() => { setPrincipal(q.p); setRate(q.r); setTenure(q.t); setTenureType('years'); }}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
            {q.l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Loan Amount (₹)</label>
          <input type="number" className="tool-input" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="50,00,000" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Interest Rate (% p.a.)</label>
          <input type="number" className="tool-input" value={rate} onChange={e => setRate(e.target.value)} step="0.05" placeholder="8.5" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tenure</label>
          <div className="flex gap-2">
            <input type="number" className="tool-input flex-1" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="20" />
            <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              {(['years','months'] as const).map(t => (
                <button key={t} onClick={() => setTenureType(t)}
                  className="px-2.5 text-xs font-semibold transition-all"
                  style={{ background: tenureType === t ? 'rgba(12,147,240,0.2)' : 'rgba(255,255,255,0.03)', color: tenureType === t ? '#36b0fb' : '#64748b' }}>
                  {t === 'years' ? 'Yr' : 'Mo'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <>
          {/* Main result */}
          <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(12,147,240,0.06)', border: '1px solid rgba(12,147,240,0.2)' }}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Monthly EMI</p>
            <p className="text-5xl font-black text-blue-400">{fmt(result.emi)}</p>
            <p className="text-xs text-slate-600 mt-2">for {result.n} months</p>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Principal',      value: fmt(parseFloat(principal)), color: '#36b0fb' },
              { label: 'Total Interest', value: fmt(result.interest),       color: '#f59e0b' },
              { label: 'Total Payment',  value: fmt(result.total),          color: '#94a3b8' },
              { label: 'Interest %',     value: `${pct}% of total`,         color: '#94a3b8' },
            ].map(c => (
              <div key={c.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs text-slate-600 mb-1">{c.label}</p>
                <p className="font-bold text-base" style={{ color: c.color }}>{c.value}</p>
              </div>
            ))}
          </div>

          {/* Visual ratio bar */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
              <span>Principal {100 - pct}%</span>
              <span>Interest {pct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-full rounded-full" style={{ width: `${100-pct}%`, background: 'linear-gradient(90deg,#0073ce,#36b0fb)' }} />
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-center" style={{ color: '#334155' }}>Uses reducing balance method. Actual rates vary by bank and credit profile.</p>
    </div>
  );
}
