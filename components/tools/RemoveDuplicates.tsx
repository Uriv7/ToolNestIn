'use client';
import { useState, useMemo } from 'react';

export default function RemoveDuplicates() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [copied, setCopied] = useState(false);

  const { output, stats } = useMemo(() => {
    let lines = input.split('\n');
    const original = lines.length;
    if (trimLines) lines = lines.map(l => l.trim());
    if (removeEmpty) lines = lines.filter(l => l !== '');
    const seen = new Set<string>();
    const unique = lines.filter(l => {
      const key = caseSensitive ? l : l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return { output: unique.join('\n'), stats: { original, removed: original - unique.length, unique: unique.length } };
  }, [input, caseSensitive, trimLines, removeEmpty]);

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4">
        {[
          { label: 'Case Sensitive', val: caseSensitive, set: setCaseSensitive },
          { label: 'Trim Whitespace', val: trimLines, set: setTrimLines },
          { label: 'Remove Empty Lines', val: removeEmpty, set: setRemoveEmpty },
        ].map(opt => (
          <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => opt.set(!opt.val)}
              className={`w-10 h-5 rounded-full transition relative ${opt.val ? 'bg-brand-500' : 'bg-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${opt.val ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-slate-400">{opt.label}</span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Input ({input.split('\n').length} lines)</label>
          <textarea className="tool-input resize-none font-mono text-sm" rows={12} value={input} onChange={e => setInput(e.target.value)} placeholder="Paste lines here, one per line..." />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-600 text-slate-400 uppercase tracking-widest">Output ({stats.unique} lines)</label>
            {output && <button onClick={copy} className="btn-secondary text-xs py-1.5 px-3">{copied ? '✓ Copied!' : '📋 Copy'}</button>}
          </div>
          <textarea className="tool-input resize-none font-mono text-sm bg-dark-900/80" rows={12} value={output} readOnly />
        </div>
      </div>

      {input && (
        <div className="flex gap-4 text-sm">
          <span className="text-slate-500">Original: <strong className="text-slate-300">{stats.original}</strong></span>
          <span className="text-rose-400">Removed: <strong>{stats.removed}</strong></span>
          <span className="text-brand-400">Unique: <strong>{stats.unique}</strong></span>
        </div>
      )}
    </div>
  );
}
