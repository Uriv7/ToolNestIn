'use client';
import { useState, useMemo } from 'react';

export default function PasswordStrengthChecker() {
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);

  const analysis = useMemo(() => {
    if (!pwd) return null;
    const checks = {
      length8: pwd.length >= 8,
      length12: pwd.length >= 12,
      length16: pwd.length >= 16,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
      noCommon: !['password','123456','qwerty','abc123','admin','letmein','welcome','monkey','dragon'].includes(pwd.toLowerCase()),
      noRepeat: !/(.)\1{2,}/.test(pwd),
    };

    const score = Object.values(checks).filter(Boolean).length;
    const strength = score <= 3 ? 'Very Weak' : score <= 5 ? 'Weak' : score <= 7 ? 'Fair' : score <= 8 ? 'Strong' : 'Very Strong';
    const color = score <= 3 ? '#f87171' : score <= 5 ? '#fb923c' : score <= 7 ? '#fbbf24' : score <= 8 ? '#34d399' : '#10b981';

    // Estimate crack time
    let charset = 0;
    if (checks.lower) charset += 26;
    if (checks.upper) charset += 26;
    if (checks.number) charset += 10;
    if (checks.special) charset += 32;
    const combinations = Math.pow(charset || 26, pwd.length);
    const guessesPerSec = 1e10; // 10 billion/sec (GPU)
    const seconds = combinations / guessesPerSec;

    const crackTime = seconds < 1 ? 'Instantly' :
      seconds < 60 ? `${Math.round(seconds)} seconds` :
      seconds < 3600 ? `${Math.round(seconds / 60)} minutes` :
      seconds < 86400 ? `${Math.round(seconds / 3600)} hours` :
      seconds < 31536000 ? `${Math.round(seconds / 86400)} days` :
      seconds < 31536000 * 1000 ? `${Math.round(seconds / 31536000)} years` : 'Centuries';

    return { checks, score, strength, color, crackTime, maxScore: Object.keys(checks).length };
  }, [pwd]);

  const RULES = [
    { key: 'length8', label: 'At least 8 characters' },
    { key: 'length12', label: 'At least 12 characters (recommended)' },
    { key: 'length16', label: 'At least 16 characters (best)' },
    { key: 'upper', label: 'Contains uppercase letter (A-Z)' },
    { key: 'lower', label: 'Contains lowercase letter (a-z)' },
    { key: 'number', label: 'Contains number (0-9)' },
    { key: 'special', label: 'Contains special character (!@#$...)' },
    { key: 'noCommon', label: 'Not a common password' },
    { key: 'noRepeat', label: 'No repeated characters (aaa, 111)' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Enter Password to Check</label>
        <div className="relative">
          <input type={show ? 'text' : 'password'} className="tool-input pr-12 font-mono text-lg"
            value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Type your password..." />
          <button onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-400 transition">
            {show ? '🙈' : '👁️'}
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1">⚠️ Analysis is 100% client-side. Your password is never sent anywhere.</p>
      </div>

      {analysis && (
        <div className="space-y-4">
          {/* Strength meter */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-700 text-lg" style={{ color: analysis.color }}>{analysis.strength}</span>
              <span className="text-sm text-slate-500">{analysis.score}/{analysis.maxScore} checks passed</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(analysis.score / analysis.maxScore) * 100}%`, background: analysis.color }} />
            </div>
            <div className="mt-3 text-sm text-slate-400">
              ⏱️ Est. crack time: <strong style={{ color: analysis.color }}>{analysis.crackTime}</strong>
              <span className="text-xs text-slate-600 ml-2">(10B guesses/sec GPU attack)</span>
            </div>
          </div>

          {/* Rules checklist */}
          <div className="space-y-2">
            {RULES.map(rule => {
              const passed = analysis.checks[rule.key as keyof typeof analysis.checks];
              return (
                <div key={rule.key} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/3">
                  <span className={`text-sm ${passed ? 'text-emerald-400' : 'text-rose-400/50'}`}>
                    {passed ? '✓' : '✗'}
                  </span>
                  <span className={`text-sm ${passed ? 'text-slate-300' : 'text-slate-600'}`}>{rule.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
