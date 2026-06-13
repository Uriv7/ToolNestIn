'use client';
import { useState } from 'react';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError('');
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError('');
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const sample = () => setInput(JSON.stringify({ name: 'ToolNestIn', tools: ['GST Calculator', 'JSON Formatter'], free: true, users: 10000, meta: { version: '1.0', year: 2026 } }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={format} className="btn-primary">✨ Format / Validate</button>
        <button onClick={minify} className="btn-secondary">⚡ Minify</button>
        <button onClick={sample} className="btn-secondary">📋 Sample JSON</button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500">Indent:</span>
          {[2, 4].map(n => (
            <button key={n} onClick={() => setIndent(n)}
              className={`w-8 h-8 rounded-lg text-sm font-700 border transition ${indent === n ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500'}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Input JSON</label>
          <textarea
            className="tool-input resize-none font-mono text-sm"
            rows={16}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='{"paste": "your JSON here"}'
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-600 text-slate-400 uppercase tracking-widest">
              {error ? '❌ Error' : output ? '✅ Valid JSON' : 'Output'}
            </label>
            {output && <button onClick={copy} className="btn-secondary text-xs py-1.5 px-3">{copied ? '✓ Copied!' : '📋 Copy'}</button>}
          </div>
          {error ? (
            <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-4 font-mono text-sm text-rose-300">{error}</div>
          ) : (
            <textarea className="tool-input resize-none font-mono text-sm bg-dark-900/80" rows={16} value={output} readOnly />
          )}
        </div>
      </div>
    </div>
  );
}
