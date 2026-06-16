'use client';
import { useState } from 'react';

export default function IFSCFinder() {
  const [ifsc, setIfsc] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async () => {
    const code = ifsc.trim().toUpperCase();
    if (code.length !== 11) { setError('IFSC code must be exactly 11 characters'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${code}`);
      if (!res.ok) throw new Error('Invalid IFSC code');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Invalid IFSC code or bank not found. Please verify the code.');
    }
    setLoading(false);
  };

  const validate = (val: string) => {
    // IFSC format: 4 letters + 0 + 6 alphanumeric
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val.toUpperCase());
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Enter IFSC Code</label>
        <div className="flex gap-3">
          <input
            type="text"
            className="tool-input flex-1 uppercase font-mono tracking-widest text-lg"
            value={ifsc}
            onChange={e => { setIfsc(e.target.value.toUpperCase()); setError(''); setResult(null); }}
            placeholder="e.g. HDFC0001234"
            maxLength={11}
          />
          <button onClick={lookup} disabled={loading || ifsc.length !== 11}
            className="btn-primary px-6 disabled:opacity-50">
            {loading ? '⏳' : '🔍 Search'}
          </button>
        </div>
        {ifsc.length > 0 && ifsc.length === 11 && (
          <p className={`text-xs mt-1 ${validate(ifsc) ? 'text-emerald-400' : 'text-rose-400'}`}>
            {validate(ifsc) ? '✓ Valid IFSC format' : '✗ Invalid IFSC format'}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-4 text-sm text-rose-300">{error}</div>
      )}

      {result && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-xl">🏦</div>
            <div>
              <div className="font-sans font-extrabold text-slate-100">{result.BANK}</div>
              <div className="text-xs text-brand-400">{result.IFSC}</div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { l: 'Branch', v: result.BRANCH },
              { l: 'City', v: result.CITY },
              { l: 'District', v: result.DISTRICT },
              { l: 'State', v: result.STATE },
              { l: 'Address', v: result.ADDRESS },
              { l: 'MICR Code', v: result.MICR || 'N/A' },
              { l: 'RTGS', v: result.RTGS ? '✅ Enabled' : '❌ Not available' },
              { l: 'NEFT', v: result.NEFT ? '✅ Enabled' : '❌ Not available' },
              { l: 'IMPS', v: result.IMPS ? '✅ Enabled' : '❌ Not available' },
              { l: 'UPI', v: result.UPI ? '✅ Enabled' : '❌ Not available' },
            ].map(r => (
              <div key={r.l} className="flex gap-3 text-sm border-b border-white/5 pb-2">
                <span className="text-slate-500 w-28 shrink-0">{r.l}</span>
                <span className="text-slate-300">{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass rounded-xl p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">IFSC Code Format</h3>
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="px-2 py-1 rounded bg-brand-500/20 text-brand-300">HDFC</span>
          <span className="text-slate-500">Bank Code (4 letters)</span>
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">0</span>
          <span className="text-slate-500">Always 0</span>
          <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300">001234</span>
          <span className="text-slate-500">Branch Code</span>
        </div>
      </div>
    </div>
  );
}
