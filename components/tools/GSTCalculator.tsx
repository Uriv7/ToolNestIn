'use client';
import { useState } from 'react';

const SLABS = [5, 12, 18, 28];

export default function GSTCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [copied, setCopied] = useState(false);

  const num = parseFloat(amount) || 0;

  let baseAmount = 0, gstAmount = 0, totalAmount = 0;
  if (mode === 'exclusive') {
    baseAmount = num;
    gstAmount = (num * rate) / 100;
    totalAmount = num + gstAmount;
  } else {
    totalAmount = num;
    baseAmount = (num * 100) / (100 + rate);
    gstAmount = num - baseAmount;
  }

  const fmt = (n: number) => n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        {(['exclusive', 'inclusive'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-600 transition border ${
              mode === m
                ? 'bg-brand-500/20 border-brand-400/50 text-brand-300'
                : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'
            }`}
          >
            {m === 'exclusive' ? '➕ Add GST to amount' : '➖ Extract GST from total'}
          </button>
        ))}
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">
          {mode === 'exclusive' ? 'Enter Base Amount (₹)' : 'Enter Total Amount with GST (₹)'}
        </label>
        <input
          type="number"
          className="tool-input text-lg font-600"
          placeholder="e.g. 1000"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
        />
      </div>

      {/* GST Slab */}
      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">GST Rate</label>
        <div className="flex gap-2 flex-wrap">
          {SLABS.map(s => (
            <button
              key={s}
              onClick={() => setRate(s)}
              className={`px-5 py-2.5 rounded-xl text-sm font-700 transition border ${
                rate === s
                  ? 'bg-brand-500/25 border-brand-400/60 text-brand-200'
                  : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
              }`}
            >
              {s}%
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {num > 0 && (
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 overflow-hidden">
          <div className="p-5 space-y-0">
            {[
              { label: 'Base Amount', value: `₹${fmt(baseAmount)}`, sub: false },
              { label: `GST Amount (${rate}%)`, value: `₹${fmt(gstAmount)}`, sub: false },
              { label: 'Total Amount', value: `₹${fmt(totalAmount)}`, sub: true },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between py-3.5 ${
                  i < 2 ? 'border-b border-white/5' : ''
                } ${row.sub ? 'mt-1' : ''}`}
              >
                <span className={`text-sm ${row.sub ? 'text-slate-300 font-700' : 'text-slate-400'}`}>{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-display font-800 ${row.sub ? 'text-xl gradient-text' : 'text-slate-200 text-base'}`}>
                    {row.value}
                  </span>
                  <button onClick={() => copy(row.value.replace('₹', '').replace(',', ''))} className="text-slate-600 hover:text-brand-400 transition text-xs">📋</button>
                </div>
              </div>
            ))}
          </div>
          {copied && <div className="copy-toast">Copied!</div>}
        </div>
      )}

      <p className="text-xs text-slate-600 text-center">All calculations are client-side. No data is sent anywhere.</p>
    </div>
  );
}
