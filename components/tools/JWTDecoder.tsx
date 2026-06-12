'use client';
import { useState, useMemo } from 'react';

function b64decode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  try {
    return decodeURIComponent(escape(atob(padded)));
  } catch {
    return atob(padded);
  }
}

export default function JWTDecoder() {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState('');

  const result = useMemo(() => {
    const t = token.trim();
    if (!t) return null;
    const parts = t.split('.');
    if (parts.length !== 3) return { error: 'Invalid JWT: must have 3 parts separated by dots' };

    try {
      const header = JSON.parse(b64decode(parts[0]));
      const payload = JSON.parse(b64decode(parts[1]));
      const signature = parts[2];

      // Check expiry
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp ? payload.exp < now : null;
      const expiresIn = payload.exp ? payload.exp - now : null;

      return { header, payload, signature, isExpired, expiresIn, valid: true };
    } catch (e: any) {
      return { error: 'Failed to decode JWT: ' + e.message };
    }
  }, [token]);

  const copy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key); setTimeout(() => setCopied(''), 1500);
  };

  const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlVyaXYgR3VwdGEiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest">JWT Token</label>
          <button onClick={() => setToken(SAMPLE)} className="text-xs text-brand-400 hover:underline">Load sample</button>
        </div>
        <textarea className="tool-input resize-none font-mono text-xs" rows={5}
          value={token} onChange={e => setToken(e.target.value)}
          placeholder="Paste your JWT token here..." />
      </div>

      {result && (
        'error' in result ? (
          <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-4 text-sm text-rose-300">❌ {result.error}</div>
        ) : (
          <div className="space-y-4">
            {/* Status */}
            {result.isExpired !== null && (
              <div className={`rounded-xl p-3 text-center text-sm font-600 ${result.isExpired ? 'bg-rose-500/10 border border-rose-400/30 text-rose-400' : 'bg-emerald-500/10 border border-emerald-400/30 text-emerald-400'}`}>
                {result.isExpired ? '❌ Token EXPIRED' : `✅ Token valid · Expires in ${Math.floor((result.expiresIn || 0) / 86400)}d ${Math.floor(((result.expiresIn || 0) % 86400) / 3600)}h`}
              </div>
            )}

            {/* Header */}
            {[
              { label: 'Header', data: result.header, key: 'header' },
              { label: 'Payload', data: result.payload, key: 'payload' },
            ].map(section => (
              <div key={section.key} className="bg-dark-900/80 border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                  <span className="text-xs font-700 text-slate-400 uppercase tracking-widest">{section.label}</span>
                  <button onClick={() => copy(section.key, JSON.stringify(section.data, null, 2))}
                    className="btn-secondary text-xs py-1 px-2">
                    {copied === section.key ? '✓' : '📋'}
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  {Object.entries(section.data).map(([k, v]) => {
                    const isTimestamp = ['iat', 'exp', 'nbf'].includes(k) && typeof v === 'number';
                    return (
                      <div key={k} className="flex gap-3 text-xs border-b border-white/5 pb-2">
                        <span className="text-brand-400 font-mono w-20 shrink-0">{k}</span>
                        <span className="text-slate-300 font-mono break-all">
                          {JSON.stringify(v)}
                          {isTimestamp && <span className="text-slate-600 ml-2">({new Date((v as number) * 1000).toLocaleString('en-IN')})</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Signature */}
            <div className="bg-dark-900/80 border border-white/10 rounded-xl p-4">
              <div className="text-xs font-700 text-slate-400 uppercase tracking-widest mb-2">Signature</div>
              <code className="text-xs text-amber-400 font-mono break-all">{result.signature}</code>
              <p className="text-xs text-slate-600 mt-2">⚠️ Signature verification requires the secret key — this tool only decodes the payload.</p>
            </div>
          </div>
        )
      )}

      <div className="glass rounded-xl p-4 text-xs text-slate-500">
        <p><strong className="text-slate-400">JWT Structure:</strong> header.payload.signature (Base64URL encoded)</p>
        <p className="mt-1">⚠️ Never paste production JWT tokens from users into any online tool. This decoder is client-side but exercise caution.</p>
      </div>
    </div>
  );
}
