'use client';
import { useState } from 'react';

export default function PincodeFinder() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async () => {
    const code = pincode.trim();
    if (code.length !== 6 || isNaN(+code)) { setError('Please enter a valid 6-digit pincode'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      const data = await res.json();
      if (data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
        setResult(data[0]);
      } else {
        setError('Pincode not found. Please verify the pincode.');
      }
    } catch {
      setError('Unable to fetch pincode data. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Enter PIN Code</label>
        <div className="flex gap-3">
          <input type="text" className="tool-input flex-1 font-mono text-xl tracking-widest text-center"
            value={pincode} onChange={e => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); setResult(null); }}
            placeholder="110001" maxLength={6}
            onKeyDown={e => e.key === 'Enter' && lookup()} />
          <button onClick={lookup} disabled={loading || pincode.length !== 6}
            className="btn-primary px-6 disabled:opacity-50">
            {loading ? '⏳' : '🔍 Find'}
          </button>
        </div>
        {pincode.length > 0 && pincode.length < 6 && (
          <p className="text-xs text-slate-500 mt-1">{6 - pincode.length} more digit{6 - pincode.length > 1 ? 's' : ''} needed</p>
        )}
      </div>

      {error && <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-4 text-sm text-rose-300">{error}</div>}

      {result && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="bg-brand-500/10 border border-brand-400/30 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <div className="font-sans font-extrabold text-xl text-slate-100">PIN: {pincode}</div>
                <div className="text-slate-400 text-sm mt-1">
                  {result.PostOffice[0].District}, {result.PostOffice[0].State}
                </div>
                <div className="text-slate-500 text-xs mt-1">
                  Division: {result.PostOffice[0].Division} · Circle: {result.PostOffice[0].Circle}
                </div>
              </div>
            </div>
          </div>

          {/* Post offices list */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Post Offices ({result.PostOffice.length})
            </label>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {result.PostOffice.map((po: any, i: number) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 bg-white/3 border border-white/8 rounded-xl">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-200 text-sm">{po.Name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {po.BranchType} · {po.DeliveryStatus}
                    </div>
                    <div className="text-xs text-slate-600">{po.Taluk} · {po.District} · {po.State}</div>
                  </div>
                  <span className="text-xs text-brand-400 shrink-0">{po.Country}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="glass rounded-xl p-4 text-xs text-slate-500">
        <strong className="text-slate-400">PIN Code Format:</strong> 6-digit code where first digit = postal circle (1=Delhi, 2=AP/Telangana, 3=Karnataka, 4=Maharashtra, 5=AP/Tamil Nadu, 6=Kerala, 7=West Bengal, 8=Rajasthan/Odisha, 9=Army Postal)
      </div>
    </div>
  );
}
