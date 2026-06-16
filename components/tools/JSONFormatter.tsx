'use client';
import { useState } from 'react';

export default function JSONFormatter() {
  const [input, setInput]   = useState('');
  const [output, setOutput] = useState('');
  const [error, setError]   = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [mode, setMode]     = useState<'format'|'minify'|'validate'>('format');

  const process = () => {
    setError(''); setOutput('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      if (mode === 'minify') {
        setOutput(JSON.stringify(parsed));
      } else {
        setOutput(JSON.stringify(parsed, null, indent));
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const size = (s: string) => s.length > 1024 ? `${(s.length/1024).toFixed(1)} KB` : `${s.length} B`;

  return (
    <div className="space-y-4">
      {/* Mode */}
      <div className="grid grid-cols-3 gap-2">
        {(['format','minify','validate'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className="py-2 rounded-xl text-sm font-semibold border capitalize transition-all"
            style={{ background: mode===m ? 'rgba(12,147,240,0.12)' : 'rgba(255,255,255,0.03)', borderColor: mode===m ? 'rgba(12,147,240,0.4)' : 'rgba(255,255,255,0.08)', color: mode===m ? '#36b0fb' : '#64748b' }}>
            {m}
          </button>
        ))}
      </div>

      {mode === 'format' && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Indent:</span>
          {[2,4].map(i => (
            <button key={i} onClick={() => setIndent(i)}
              className="px-3 py-1 rounded-lg text-xs font-semibold border transition-all"
              style={{ background: indent===i ? 'rgba(12,147,240,0.12)' : 'rgba(255,255,255,0.03)', borderColor: indent===i ? 'rgba(12,147,240,0.4)' : 'rgba(255,255,255,0.08)', color: indent===i ? '#36b0fb' : '#64748b' }}>
              {i} spaces
            </button>
          ))}
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Input JSON</label>
          {input && <span className="text-xs text-slate-600">{size(input)}</span>}
        </div>
        <textarea
          className="tool-input h-44 font-mono text-xs"
          value={input}
          onChange={e => { setInput(e.target.value); setOutput(''); setError(''); }}
          placeholder={'{\n  "name": "ToolNestIn",\n  "tools": 79\n}'}
          spellCheck={false}
        />
      </div>

      <button onClick={process}
        className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
        style={{ background: 'rgba(12,147,240,0.15)', border: '1px solid rgba(12,147,240,0.3)', color: '#36b0fb' }}>
        {mode === 'format' ? '✨ Format JSON' : mode === 'minify' ? '🗜 Minify JSON' : '✓ Validate JSON'}
      </button>

      {error && (
        <div className="rounded-xl px-4 py-3 flex gap-2 items-start" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <span className="text-red-400 mt-0.5 text-sm">✗</span>
          <p className="text-red-400 text-sm font-mono">{error}</p>
        </div>
      )}

      {output && mode === 'validate' && !error && (
        <div className="rounded-xl px-4 py-3 flex gap-2 items-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <span className="text-emerald-400 text-xl">✓</span>
          <p className="text-emerald-400 text-sm font-semibold">Valid JSON</p>
        </div>
      )}

      {output && mode !== 'validate' && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Output ({size(output)})</label>
            <button onClick={copy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#34d399' : '#94a3b8' }}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
          <textarea readOnly className="tool-input h-44 font-mono text-xs" value={output} />
        </div>
      )}
    </div>
  );
}
