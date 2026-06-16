'use client';
import { useState } from 'react';

const PAN_TYPES: Record<string, string> = {
  P: 'Individual Person',
  C: 'Company / Corporation',
  H: 'Hindu Undivided Family (HUF)',
  F: 'Firm / Partnership',
  A: 'Association of Persons (AOP)',
  T: 'Trust',
  B: 'Body of Individuals (BOI)',
  L: 'Local Authority',
  J: 'Artificial Juridical Person',
  G: 'Government Entity',
};

export default function PANValidator() {
  const [pan, setPan] = useState('');

  const validate = (p: string) => {
    const upper = p.toUpperCase().trim();
    if (upper.length !== 10) return null;
    const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!regex.test(upper)) return { valid: false, reason: 'Invalid format. PAN must be 5 letters + 4 digits + 1 letter' };

    const fourthChar = upper[3];
    const type = PAN_TYPES[fourthChar];
    if (!type) return { valid: false, reason: `Invalid 4th character: ${fourthChar}` };

    const fifthChar = upper[4];
    const lastName = fifthChar; // First letter of surname for individuals

    return {
      valid: true,
      type,
      fourthChar,
      fifthChar,
      lastNameInitial: fourthChar === 'P' ? fifthChar : null,
      formatted: `${upper.slice(0, 5)} ${upper.slice(5, 9)} ${upper[9]}`,
    };
  };

  const result = validate(pan);
  const upper = pan.toUpperCase();

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Enter PAN Number</label>
        <input
          type="text"
          className="tool-input font-mono uppercase tracking-widest text-xl text-center"
          value={upper}
          onChange={e => setPan(e.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
          maxLength={10}
        />
        <div className="flex justify-between text-xs text-slate-600 mt-1">
          <span>Format: AAAAA9999A</span>
          <span>{upper.length}/10</span>
        </div>
      </div>

      {result !== null && (
        <div className={`rounded-2xl p-5 border ${result.valid ? 'bg-emerald-500/8 border-emerald-400/30' : 'bg-rose-500/8 border-rose-400/30'}`}>
          {result.valid ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="font-bold text-emerald-300">Valid PAN Number</div>
                  <div className="font-mono text-2xl font-black text-slate-100 tracking-widest">{result.formatted}</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { l: 'PAN Type', v: result.type },
                  { l: '4th Character', v: `${result.fourthChar} → ${result.type}` },
                  result.lastNameInitial ? { l: 'Surname Initial', v: result.lastNameInitial } : null,
                  { l: 'Check Digit', v: upper[9] },
                ].filter(Boolean).map((r: any) => (
                  <div key={r.l} className="flex gap-3 text-sm">
                    <span className="text-slate-500 w-32">{r.l}</span>
                    <span className="text-slate-300 font-semibold">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <div className="font-bold text-rose-300">Invalid PAN</div>
                <div className="text-sm text-slate-400 mt-1">{result.reason}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Format guide */}
      <div className="glass rounded-xl p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">PAN Format Guide</h3>
        <div className="space-y-1 text-xs text-slate-500">
          <div className="flex gap-2"><span className="font-mono text-brand-300 w-8">1–3</span><span>First 3 letters: Sequence number assigned by IT dept</span></div>
          <div className="flex gap-2"><span className="font-mono text-brand-300 w-8">4th</span><span>Type of taxpayer: P=Person, C=Company, H=HUF, F=Firm, T=Trust</span></div>
          <div className="flex gap-2"><span className="font-mono text-brand-300 w-8">5th</span><span>First letter of surname (for individuals) or entity name</span></div>
          <div className="flex gap-2"><span className="font-mono text-brand-300 w-8">6–9</span><span>4-digit sequential number</span></div>
          <div className="flex gap-2"><span className="font-mono text-brand-300 w-8">10th</span><span>Check digit (alphabetic)</span></div>
        </div>
      </div>
    </div>
  );
}
