'use client';
import { useState, useMemo } from 'react';

export default function CSVToJSON() {
  const [csv, setCsv] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'csv2json' | 'json2csv'>('csv2json');

  const result = useMemo(() => {
    if (!csv.trim()) return { output: '', error: '', count: 0 };
    try {
      if (mode === 'csv2json') {
        const lines = csv.trim().split('\n').map(l => l.split(delimiter).map(c => c.trim().replace(/^"|"$/g, '')));
        if (lines.length === 0) return { output: '', error: '', count: 0 };
        const headers = hasHeader ? lines[0] : lines[0].map((_, i) => `col${i + 1}`);
        const rows = hasHeader ? lines.slice(1) : lines;
        const data = rows.filter(r => r.some(c => c)).map(row =>
          Object.fromEntries(headers.map((h, i) => [h, row[i] ?? '']))
        );
        return { output: JSON.stringify(data, null, indent), error: '', count: data.length };
      } else {
        const data = JSON.parse(csv);
        if (!Array.isArray(data)) return { output: '', error: 'Input must be a JSON array of objects', count: 0 };
        if (data.length === 0) return { output: '', error: 'Array is empty', count: 0 };
        const headers = Object.keys(data[0]);
        const csvLines = [
          headers.join(delimiter),
          ...data.map(row => headers.map(h => {
            const val = String(row[h] ?? '');
            return val.includes(delimiter) ? `"${val}"` : val;
          }).join(delimiter))
        ];
        return { output: csvLines.join('\n'), error: '', count: data.length };
      }
    } catch (e: any) {
      return { output: '', error: e.message, count: 0 };
    }
  }, [csv, delimiter, hasHeader, indent, mode]);

  const copy = () => { navigator.clipboard.writeText(result.output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const SAMPLE_CSV = `name,age,city,salary
Rahul Sharma,28,Mumbai,75000
Priya Gupta,32,Delhi,92000
Amit Kumar,25,Bangalore,68000`;

  const SAMPLE_JSON = `[{"name":"Rahul","age":28,"city":"Mumbai"},{"name":"Priya","age":32,"city":"Delhi"}]`;

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['csv2json', 'json2csv'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setCsv(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-600 border transition ${mode === m ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {m === 'csv2json' ? '📊 CSV → JSON' : '📋 JSON → CSV'}
          </button>
        ))}
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Delimiter:</label>
          {[',', ';', '\t', '|'].map(d => (
            <button key={d} onClick={() => setDelimiter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition ${delimiter === d ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500'}`}>
              {d === '\t' ? 'TAB' : d}
            </button>
          ))}
        </div>
        {mode === 'csv2json' && (
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setHasHeader(!hasHeader)}
              className={`w-10 h-5 rounded-full transition relative ${hasHeader ? 'bg-brand-500' : 'bg-white/10'}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${hasHeader ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-xs text-slate-400">First row is header</span>
          </label>
        )}
        <button onClick={() => setCsv(mode === 'csv2json' ? SAMPLE_CSV : SAMPLE_JSON)}
          className="text-xs text-brand-400 hover:underline">Load sample</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">
            {mode === 'csv2json' ? 'CSV Input' : 'JSON Input'}
          </label>
          <textarea className="tool-input resize-none font-mono text-xs" rows={14}
            value={csv} onChange={e => setCsv(e.target.value)}
            placeholder={mode === 'csv2json' ? 'name,age,city\nRahul,28,Mumbai' : '[{"name":"Rahul","age":28}]'} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-600 text-slate-400 uppercase tracking-widest">
              {result.count > 0 ? `Output (${result.count} rows)` : 'Output'}
            </label>
            {result.output && <button onClick={copy} className="btn-secondary text-xs py-1.5 px-3">{copied ? '✓ Copied!' : '📋 Copy'}</button>}
          </div>
          {result.error ? (
            <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-4 text-xs text-rose-300">{result.error}</div>
          ) : (
            <textarea className="tool-input resize-none font-mono text-xs bg-dark-900/80" rows={14} value={result.output} readOnly />
          )}
        </div>
      </div>
    </div>
  );
}
