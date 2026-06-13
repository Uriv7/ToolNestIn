'use client';
import { useState, useMemo } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testStr, setTestStr] = useState('');
  const [copied, setCopied] = useState(false);

  const FLAGS = ['g', 'i', 'm', 's', 'u'];

  const result = useMemo(() => {
    if (!pattern || !testStr) return null;
    try {
      const re = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups: Record<string, string> | null }[] = [];
      let m: RegExpExecArray | null;
      const r = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      while ((m = r.exec(testStr)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.groups || null });
        if (!flags.includes('g')) break;
      }
      // Highlight matches in test string
      const highlighted = testStr.replace(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'),
        (match) => `§§${match}§§`);
      return { matches, highlighted, valid: true, count: matches.length };
    } catch (e: any) {
      return { valid: false, error: e.message, matches: [], highlighted: testStr, count: 0 };
    }
  }, [pattern, flags, testStr]);

  const EXAMPLES = [
    { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { label: 'Indian Mobile', pattern: '[6-9]\\d{9}' },
    { label: 'PAN Card', pattern: '[A-Z]{5}[0-9]{4}[A-Z]' },
    { label: 'PIN Code', pattern: '[1-9][0-9]{5}' },
    { label: 'Date (DD/MM/YYYY)', pattern: '\\d{2}/\\d{2}/\\d{4}' },
    { label: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}' },
  ];

  const toggleFlag = (f: string) => setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f);

  return (
    <div className="space-y-5">
      {/* Quick examples */}
      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Quick Examples</label>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map(ex => (
            <button key={ex.label} onClick={() => setPattern(ex.pattern)}
              className="px-3 py-1.5 rounded-lg text-xs border bg-white/3 border-white/10 text-slate-400 hover:border-brand-400/40 hover:text-brand-300 transition">
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern input */}
      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Regular Expression</label>
        <div className="flex items-center gap-2 bg-dark-900/80 border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand-400/50">
          <span className="text-slate-500 font-mono text-lg">/</span>
          <input type="text" className="flex-1 bg-transparent font-mono text-brand-300 outline-none text-sm"
            value={pattern} onChange={e => setPattern(e.target.value)} placeholder="your-pattern-here" />
          <span className="text-slate-500 font-mono text-lg">/</span>
          <span className="font-mono text-amber-400 text-sm">{flags}</span>
        </div>
      </div>

      {/* Flags */}
      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Flags</label>
        <div className="flex gap-2">
          {FLAGS.map(f => (
            <button key={f} onClick={() => toggleFlag(f)}
              className={`w-10 h-9 rounded-lg font-mono text-sm font-700 border transition ${flags.includes(f) ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
              {f}
            </button>
          ))}
          <div className="flex items-center gap-3 ml-4 text-xs text-slate-600">
            <span>g=global</span><span>i=case-insensitive</span><span>m=multiline</span>
          </div>
        </div>
      </div>

      {/* Test string */}
      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Test String</label>
        <textarea className="tool-input resize-none font-mono text-sm" rows={5}
          value={testStr} onChange={e => setTestStr(e.target.value)}
          placeholder="Paste your test string here..." />
      </div>

      {/* Results */}
      {result && (
        <div>
          {!result.valid ? (
            <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-4 text-sm text-rose-300">
              ❌ Invalid regex: {result.error}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-600 ${result.count > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {result.count > 0 ? `✅ ${result.count} match${result.count > 1 ? 'es' : ''} found` : '⚪ No matches found'}
                </span>
              </div>

              {/* Highlighted output */}
              {testStr && (
                <div className="bg-dark-900/80 border border-white/10 rounded-xl p-4 font-mono text-sm leading-relaxed">
                  {result.highlighted.split('§§').map((part, i) =>
                    i % 2 === 1
                      ? <mark key={i} className="bg-brand-400/30 text-brand-200 rounded px-0.5">{part}</mark>
                      : <span key={i} className="text-slate-400">{part}</span>
                  )}
                </div>
              )}

              {/* Match list */}
              {result.matches.length > 0 && (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {result.matches.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 bg-white/3 rounded-lg text-xs">
                      <span className="text-slate-600 w-6">#{i + 1}</span>
                      <code className="text-brand-300 font-mono">{m.match}</code>
                      <span className="text-slate-600">index: {m.index}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
