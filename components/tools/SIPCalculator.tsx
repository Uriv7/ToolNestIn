'use client';
import { useState, useMemo } from 'react';

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState('5000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('10');
  const [mode, setMode] = useState<'sip' | 'lumpsum'>('sip');
  const [lumpsum, setLumpsum] = useState('100000');

  const result = useMemo(() => {
    const r = (parseFloat(rate) || 0) / 100;
    const n = (parseInt(years) || 0) * 12;

    if (mode === 'sip') {
      const P = parseFloat(monthly) || 0;
      const monthlyRate = r / 12;
      const fv = P * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
      const invested = P * n;
      return { fv, invested, gains: fv - invested, type: 'sip' };
    } else {
      const P = parseFloat(lumpsum) || 0;
      const fv = P * Math.pow(1 + r, parseInt(years) || 0);
      return { fv, invested: P, gains: fv - P, type: 'lumpsum' };
    }
  }, [monthly, rate, years, mode, lumpsum]);

  // Year-by-year data for chart
  const chartData = useMemo(() => {
    const r = (parseFloat(rate) || 0) / 100;
    const yrs = parseInt(years) || 10;
    const P = mode === 'sip' ? parseFloat(monthly) || 0 : parseFloat(lumpsum) || 0;
    const monthlyRate = r / 12;

    return Array.from({ length: yrs }, (_, i) => {
      const y = i + 1;
      const n = y * 12;
      if (mode === 'sip') {
        const fv = P * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
        return { year: y, invested: P * n, value: fv };
      } else {
        return { year: y, invested: P, value: P * Math.pow(1 + r, y) };
      }
    });
  }, [monthly, rate, years, mode, lumpsum]);

  const fmt = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
  };

  const maxVal = Math.max(...chartData.map(d => d.value));

  return (
    <div className="space-y-5">
      {/* Mode */}
      <div className="flex gap-2">
        {(['sip', 'lumpsum'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-600 border transition ${mode === m ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {m === 'sip' ? '📅 Monthly SIP' : '💰 Lump Sum'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {mode === 'sip' ? (
          <div>
            <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Monthly SIP (₹)</label>
            <input type="number" className="tool-input" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="5000" />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Lump Sum Amount (₹)</label>
            <input type="number" className="tool-input" value={lumpsum} onChange={e => setLumpsum(e.target.value)} placeholder="100000" />
          </div>
        )}
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Expected Return (% p.a.)</label>
          <input type="number" className="tool-input" value={rate} onChange={e => setRate(e.target.value)} placeholder="12" step="0.5" />
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Time Period (years)</label>
          <input type="number" className="tool-input" value={years} onChange={e => setYears(e.target.value)} placeholder="10" min="1" max="40" />
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: 'Total Invested', v: fmt(result.invested), highlight: false },
              { l: 'Est. Returns', v: fmt(result.gains), highlight: false },
              { l: 'Total Value', v: fmt(result.fv), highlight: true },
            ].map(r => (
              <div key={r.l} className={`rounded-2xl p-4 border text-center ${r.highlight ? 'bg-brand-500/15 border-brand-400/40' : 'bg-white/3 border-white/10'}`}>
                <div className={`font-display text-xl font-800 ${r.highlight ? 'gradient-text' : 'text-slate-200'}`}>{r.v}</div>
                <div className="text-xs text-slate-500 mt-1">{r.l}</div>
              </div>
            ))}
          </div>

          {/* Wealth growth chart */}
          <div>
            <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-3">Wealth Growth Over {years} Years</label>
            <div className="flex items-end gap-1 h-32">
              {chartData.map(d => (
                <div key={d.year} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full flex flex-col justify-end" style={{ height: '100px' }}>
                    {/* Gains portion */}
                    <div className="w-full rounded-t-sm bg-emerald-400/60 transition-all"
                      style={{ height: `${((d.value - d.invested) / maxVal) * 100}px` }} />
                    {/* Invested portion */}
                    <div className="w-full bg-brand-500/50"
                      style={{ height: `${(d.invested / maxVal) * 100}px` }} />
                  </div>
                  {d.year % Math.ceil(chartData.length / 5) === 0 && (
                    <span className="text-xs text-slate-600">Y{d.year}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-brand-500/50" /><span className="text-xs text-slate-500">Invested</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-400/60" /><span className="text-xs text-slate-500">Returns</span></div>
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-slate-600 text-center">Mutual fund investments are subject to market risks. Returns shown are estimates.</p>
    </div>
  );
}
