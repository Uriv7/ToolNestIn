'use client';
import { useState, useCallback } from 'react';

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState<'v4' | 'v7'>('v4');
  const [copied, setCopied] = useState<number | null>(null);

  const generateV4 = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  };

  const generateV7 = (): string => {
    const now = Date.now();
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Embed timestamp in first 48 bits
    bytes[0] = (now / 0x10000000000) & 0xff;
    bytes[1] = (now / 0x100000000) & 0xff;
    bytes[2] = (now / 0x1000000) & 0xff;
    bytes[3] = (now / 0x10000) & 0xff;
    bytes[4] = (now / 0x100) & 0xff;
    bytes[5] = now & 0xff;
    bytes[6] = (bytes[6] & 0x0f) | 0x70;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  };

  const generate = useCallback(() => {
    setUuids(Array.from({ length: count }, () => version === 'v4' ? generateV4() : generateV7()));
  }, [count, version]);

  const copy = (uuid: string, i: number) => {
    navigator.clipboard.writeText(uuid);
    setCopied(i); setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(-1); setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-3 items-end">
        <div className="flex gap-2">
          {(['v4', 'v7'] as const).map(v => (
            <button key={v} onClick={() => setVersion(v)}
              className={`px-4 py-2.5 rounded-xl text-sm font-700 border transition ${version === v ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
              UUID {v.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs text-slate-500">Count:</span>
          {[1, 5, 10, 25].map(n => (
            <button key={n} onClick={() => setCount(n)}
              className={`w-9 h-8 rounded-lg text-xs font-700 border transition ${count === n ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500'}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={generate} className="btn-primary flex-1">⚡ Generate UUID{count > 1 ? 's' : ''}</button>
        {uuids.length > 1 && <button onClick={copyAll} className="btn-secondary">{copied === -1 ? '✓ Copied!' : '📋 Copy All'}</button>}
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center gap-3 bg-dark-900/80 border border-white/10 rounded-xl px-4 py-3">
              <code className="flex-1 font-mono text-sm text-brand-300 tracking-wider">{uuid}</code>
              <button onClick={() => copy(uuid, i)} className="btn-secondary text-xs py-1 px-2 shrink-0">
                {copied === i ? '✓' : '📋'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="glass rounded-xl p-4 text-xs text-slate-500 space-y-1">
        <p><strong className="text-slate-400">UUID v4:</strong> Purely random. Most widely used. No temporal ordering.</p>
        <p><strong className="text-slate-400">UUID v7:</strong> Time-sortable (timestamp + random). Better for database primary keys.</p>
      </div>
      <p className="text-xs text-slate-600 text-center">Generated using Web Crypto API. All UUIDs are client-side and unique.</p>
    </div>
  );
}
