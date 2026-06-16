'use client';
import { useState } from 'react';

const SLABS = [5, 12, 18, 28];
const FMT = (n: number) => `₹${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

export default function GSTCalculator() {
  const [amount, setAmount]   = useState('');
  const [rate, setRate]       = useState(18);
  const [mode, setMode]       = useState<'exclusive' | 'inclusive'>('exclusive');
  const [inter, setInter]     = useState<'intra' | 'inter'>('intra');
  const [copied, setCopied]   = useState('');

  const num = parseFloat(amount) || 0;
  let base = 0, gst = 0, total = 0;
  if (mode === 'exclusive') { base = num; gst = num * rate / 100; total = num + gst; }
  else { total = num; base = num * 100 / (100 + rate); gst = num - base; }

  const cgst = gst / 2;
  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(''), 1500);
  };

  const show = num > 0;

  return (
    <div className="space-y-5">

      {/* Mode toggle */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Calculation Mode</label>
        <div className="grid grid-cols-2 gap-2">
          {(['exclusive','inclusive'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="py-2.5 rounded-xl text-sm font-semibold border transition-all"
              style={{
                background: mode === m ? 'rgba(12,147,240,0.12)' : 'rgba(255,255,255,0.03)',
                borderColor: mode === m ? 'rgba(12,147,240,0.4)' : 'rgba(255,255,255,0.08)',
                color: mode === m ? '#36b0fb' : '#64748b',
              }}>
              {m === 'exclusive' ? 'Add GST to price' : 'Extract GST from total'}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {mode === 'exclusive' ? 'Base Price (₹)' : 'Total Amount incl. GST (₹)'}
        </label>
        <input
          type="number"
          className="tool-input text-lg"
          placeholder="Enter amount…"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
        />
      </div>

      {/* GST rate */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">GST Rate</label>
        <div className="grid grid-cols-4 gap-2">
          {SLABS.map(s => (
            <button key={s} onClick={() => setRate(s)}
              className="py-2.5 rounded-xl text-sm font-bold border transition-all"
              style={{
                background: rate === s ? 'rgba(12,147,240,0.12)' : 'rgba(255,255,255,0.03)',
                borderColor: rate === s ? 'rgba(12,147,240,0.4)' : 'rgba(255,255,255,0.08)',
                color: rate === s ? '#36b0fb' : '#64748b',
              }}>
              {s}%
            </button>
          ))}
        </div>
      </div>

      {/* Interstate toggle */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Transaction Type</label>
        <div className="grid grid-cols-2 gap-2">
          {([['intra','Intrastate (CGST + SGST)'],['inter','Interstate (IGST)']] as const).map(([v,l]) => (
            <button key={v} onClick={() => setInter(v)}
              className="py-2.5 rounded-xl text-sm font-semibold border transition-all"
              style={{
                background: inter === v ? 'rgba(12,147,240,0.12)' : 'rgba(255,255,255,0.03)',
                borderColor: inter === v ? 'rgba(12,147,240,0.4)' : 'rgba(255,255,255,0.08)',
                color: inter === v ? '#36b0fb' : '#64748b',
              }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {show && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(12,147,240,0.2)', background: 'rgba(8,12,20,0.6)' }}>
          {/* Header */}
          <div className="px-5 py-3 border-b" style={{ borderColor: 'rgba(12,147,240,0.15)', background: 'rgba(12,147,240,0.06)' }}>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">GST Breakdown — {rate}%</span>
          </div>

          <div className="p-5 space-y-3">
            {[
              { label: 'Base Amount',   value: FMT(base),   key: 'base',  highlight: false },
              inter === 'intra'
                ? { label: `CGST (${rate/2}%)`, value: FMT(cgst), key: 'cgst', highlight: false }
                : null,
              inter === 'intra'
                ? { label: `SGST (${rate/2}%)`, value: FMT(cgst), key: 'sgst', highlight: false }
                : { label: `IGST (${rate}%)`,   value: FMT(gst),  key: 'igst', highlight: false },
              { label: 'Total GST',     value: FMT(gst),    key: 'gst',   highlight: false },
              { label: 'Total Amount',  value: FMT(total),  key: 'total', highlight: true  },
            ].filter(Boolean).map((row: any) => (
              <div key={row.key}
                className="flex items-center justify-between py-2.5 border-b last:border-0"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span className="text-sm" style={{ color: row.highlight ? '#94a3b8' : '#64748b' }}>{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${row.highlight ? 'text-2xl text-blue-400' : 'text-base text-slate-300'}`}>
                    {row.value}
                  </span>
                  <button
                    onClick={() => copy(row.value.replace('₹','').replace(/,/g,''), row.key)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                    title="Copy"
                    aria-label={`Copy ${row.label}`}>
                    {copied === row.key
                      ? <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" strokeWidth={2}/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth={2}/></svg>
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-center" style={{ color: '#334155' }}>
        Rates per GST Council 2025–26. Results are estimates — verify with a CA for invoicing.
      </p>
    </div>
  );
}
