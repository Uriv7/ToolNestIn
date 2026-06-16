'use client';
import { useState, useCallback } from 'react';

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function getStrength(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (pwd.length >= 16) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[a-z]/.test(pwd)) s++;
  if (/\d/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return Math.min(4, Math.floor(s * 4 / 7));
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: true });
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    const pool = Object.entries(opts).filter(([, v]) => v).map(([k]) => CHARS[k as keyof typeof CHARS]).join('');
    if (!pool) return;
    setPasswords(Array.from({ length: count }, () => {
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      return Array.from(arr, n => pool[n % pool.length]).join('');
    }));
  }, [length, opts, count]);

  const copy = (pwd: string, i: number) => {
    navigator.clipboard.writeText(pwd);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  const strengthColors = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#10b981'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Length: {length}</label>
        <input type="range" min="8" max="64" value={length} onChange={e => setLength(+e.target.value)}
          className="w-full accent-brand-400 cursor-pointer" />
        <div className="flex justify-between text-xs text-slate-600 mt-1"><span>8</span><span>64</span></div>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.entries(opts).map(([key, val]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
            <div onClick={() => setOpts(o => ({ ...o, [key]: !o[key as keyof typeof o] }))}
              className={`w-10 h-5 rounded-full transition relative ${val ? 'bg-brand-500' : 'bg-white/10'}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${val ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-slate-400 capitalize">
              {key === 'upper' ? 'A–Z' : key === 'lower' ? 'a–z' : key === 'digits' ? '0–9' : '!@#$'}
            </span>
          </label>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500">Count:</span>
          {[1, 3, 5, 10].map(n => (
            <button key={n} onClick={() => setCount(n)}
              className={`w-8 h-7 rounded-lg text-xs font-bold border transition ${count === n ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500'}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <button onClick={generate} className="btn-primary w-full">🔒 Generate Passwords</button>

      {passwords.length > 0 && (
        <div className="space-y-2">
          {passwords.map((pwd, i) => {
            const s = getStrength(pwd);
            return (
              <div key={i} className="flex items-center gap-3 bg-dark-900/80 border border-white/10 rounded-xl px-4 py-3">
                <span className="font-mono text-sm text-slate-200 flex-1 break-all">{pwd}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 4 }, (_, j) => (
                      <div key={j} className="w-1.5 h-4 rounded-sm transition" style={{ background: j < s ? strengthColors[s] : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                  <span className="text-xs w-16" style={{ color: strengthColors[s] }}>{strengthLabels[s]}</span>
                  <button onClick={() => copy(pwd, i)} className="btn-secondary text-xs py-1 px-2">{copied === i ? '✓' : '📋'}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">Passwords are generated using the Web Crypto API. Nothing is transmitted.</p>
    </div>
  );
}
