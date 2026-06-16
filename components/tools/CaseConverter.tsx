'use client';
import { useState } from 'react';

const cases = [
  { id: 'upper', label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
  { id: 'lower', label: 'lowercase', fn: (s: string) => s.toLowerCase() },
  { id: 'title', label: 'Title Case', fn: (s: string) => s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()) },
  { id: 'sentence', label: 'Sentence case', fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  { id: 'camel', label: 'camelCase', fn: (s: string) => s.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, '') },
  { id: 'pascal', label: 'PascalCase', fn: (s: string) => s.replace(/(?:^\w|[A-Z]|\b\w)/g, w => w.toUpperCase()).replace(/\s+/g, '') },
  { id: 'snake', label: 'snake_case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '_') },
  { id: 'kebab', label: 'kebab-case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '-') },
];

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [active, setActive] = useState('upper');
  const [copied, setCopied] = useState(false);

  const current = cases.find(c => c.id === active)!;
  const output = input ? current.fn(input) : '';

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Input Text</label>
        <textarea className="tool-input resize-none" rows={5} value={input} onChange={e => setInput(e.target.value)} placeholder="Type or paste text here..." />
      </div>

      <div className="flex flex-wrap gap-2">
        {cases.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${active === c.id ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Output — {current.label}</label>
            <button onClick={copy} className="btn-secondary text-xs py-1.5 px-3">{copied ? '✓ Copied!' : '📋 Copy'}</button>
          </div>
          <div className="tool-output" style={{ color: '#e2e8f0', fontFamily: 'var(--font-outfit)' }}>{output}</div>
        </div>
      )}
    </div>
  );
}
