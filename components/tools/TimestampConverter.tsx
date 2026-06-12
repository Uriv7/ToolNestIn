'use client';
import { useState, useEffect } from 'react';

export default function TimestampConverter() {
  const [unix, setUnix] = useState(String(Math.floor(Date.now() / 1000)));
  const [human, setHuman] = useState('');
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const fromUnix = (ts: string) => {
    const n = parseInt(ts);
    if (isNaN(n)) return null;
    const ms = n > 1e10 ? n : n * 1000;
    const d = new Date(ms);
    return {
      utc: d.toUTCString(),
      local: d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      iso: d.toISOString(),
      date: d.toLocaleDateString('en-IN'),
      time: d.toLocaleTimeString('en-IN'),
      relative: (() => {
        const diff = Math.floor(Date.now() / 1000) - Math.floor(ms / 1000);
        if (Math.abs(diff) < 60) return `${Math.abs(diff)}s ${diff > 0 ? 'ago' : 'from now'}`;
        if (Math.abs(diff) < 3600) return `${Math.floor(Math.abs(diff) / 60)}m ${diff > 0 ? 'ago' : 'from now'}`;
        if (Math.abs(diff) < 86400) return `${Math.floor(Math.abs(diff) / 3600)}h ${diff > 0 ? 'ago' : 'from now'}`;
        return `${Math.floor(Math.abs(diff) / 86400)}d ${diff > 0 ? 'ago' : 'from now'}`;
      })(),
      isMs: n > 1e10,
    };
  };

  const fromHuman = (h: string) => {
    if (!h) return null;
    const d = new Date(h);
    if (isNaN(d.getTime())) return null;
    return { unix: Math.floor(d.getTime() / 1000), ms: d.getTime() };
  };

  const parsed = fromUnix(unix);
  const humanResult = fromHuman(human);
  const [copied, setCopied] = useState('');

  const copy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key); setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="space-y-5">
      {/* Live clock */}
      <div className="bg-brand-500/10 border border-brand-400/20 rounded-xl p-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">Current Unix Timestamp (live)</span>
        <div className="flex items-center gap-2">
          <code className="font-mono text-brand-300 font-700">{now}</code>
          <button onClick={() => setUnix(String(now))} className="btn-secondary text-xs py-1 px-2">Use Now</button>
        </div>
      </div>

      {/* Unix → Human */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-700 text-slate-300 mb-3">🕐 Unix Timestamp → Human Date</h3>
        <input type="text" className="tool-input font-mono" value={unix}
          onChange={e => setUnix(e.target.value)} placeholder="e.g. 1716000000" />

        {parsed && (
          <div className="mt-4 space-y-2">
            {[
              { l: 'IST (India)', v: parsed.local },
              { l: 'UTC', v: parsed.utc },
              { l: 'ISO 8601', v: parsed.iso },
              { l: 'Relative', v: parsed.relative },
              { l: 'Format', v: parsed.isMs ? 'Milliseconds (ms)' : 'Seconds (s)' },
            ].map(r => (
              <div key={r.l} className="flex items-center justify-between gap-3 px-3 py-2 bg-white/3 rounded-lg">
                <span className="text-xs text-slate-500 w-24 shrink-0">{r.l}</span>
                <span className="text-xs text-slate-300 font-mono flex-1">{r.v}</span>
                <button onClick={() => copy(r.l, r.v)} className="text-xs text-slate-600 hover:text-brand-400 shrink-0">
                  {copied === r.l ? '✓' : '📋'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Human → Unix */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-700 text-slate-300 mb-3">📅 Human Date → Unix Timestamp</h3>
        <input type="datetime-local" className="tool-input" value={human} onChange={e => setHuman(e.target.value)} />

        {humanResult && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { l: 'Unix (seconds)', v: String(humanResult.unix) },
              { l: 'Unix (milliseconds)', v: String(humanResult.ms) },
            ].map(r => (
              <div key={r.l} className="bg-white/3 rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">{r.l}</div>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-brand-300 font-700 text-sm">{r.v}</code>
                  <button onClick={() => copy(r.l, r.v)} className="text-xs text-slate-600 hover:text-brand-400">
                    {copied === r.l ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
