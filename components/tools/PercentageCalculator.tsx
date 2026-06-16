'use client';
import { useState } from 'react';

type Mode = 'percent-of' | 'is-what-percent' | 'change';

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('percent-of');
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const modes = [
    { id: 'percent-of' as Mode, label: 'X% of Y' },
    { id: 'is-what-percent' as Mode, label: 'X is what % of Y' },
    { id: 'change' as Mode, label: '% Change' },
  ];

  const calc = () => {
    const x = parseFloat(a), y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return '';
    if (mode === 'percent-of') return `${((x / 100) * y).toFixed(4).replace(/\.?0+$/, '')}`;
    if (mode === 'is-what-percent') return `${((x / y) * 100).toFixed(4).replace(/\.?0+$/, '')}%`;
    if (mode === 'change') return `${(((y - x) / x) * 100).toFixed(4).replace(/\.?0+$/, '')}%`;
    return '';
  };

  const result = calc();

  const labels: Record<Mode, { a: string; b: string; question: string }> = {
    'percent-of': { a: 'Percentage (%)', b: 'Of Number', question: `${a}% of ${b} = ?` },
    'is-what-percent': { a: 'Number (X)', b: 'Of Number (Y)', question: `${a} is what % of ${b}?` },
    'change': { a: 'From (Old Value)', b: 'To (New Value)', question: `Change from ${a} to ${b} = ?` },
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {modes.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${mode === m.id ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{labels[mode].a}</label>
          <input type="number" className="tool-input" value={a} onChange={e => setA(e.target.value)} placeholder="e.g. 20" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{labels[mode].b}</label>
          <input type="number" className="tool-input" value={b} onChange={e => setB(e.target.value)} placeholder="e.g. 500" />
        </div>
      </div>

      {result && (
        <div className="bg-brand-500/10 border border-brand-400/30 rounded-2xl p-6 text-center">
          <p className="text-slate-500 text-sm mb-3">{labels[mode].question}</p>
          <div className="font-sans text-4xl font-black gradient-text">{result}</div>
        </div>
      )}
    </div>
  );
}
