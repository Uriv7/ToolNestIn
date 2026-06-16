'use client';
import { useState } from 'react';
export default function JSONToCSV() {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');
  const convert = () => {
    setError(''); setOutput('');
    try {
      const data = JSON.parse(input);
      if (!Array.isArray(data)) { setError('Input must be a JSON array of objects'); return; }
      const flatten = (obj: any, prefix = ''): Record<string,any> => Object.keys(obj).reduce((acc: any, k) => {
        const key = prefix ? `${prefix}.${k}` : k;
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) return { ...acc, ...flatten(obj[k], key) };
        acc[key] = Array.isArray(obj[k]) ? JSON.stringify(obj[k]) : obj[k];
        return acc;
      }, {});
      const flat = data.map(r => flatten(r));
      const keys = [...new Set(flat.flatMap(r => Object.keys(r)))];
      const rows = [keys.join(delimiter), ...flat.map(r => keys.map(k => { const v = String(r[k] ?? ''); return v.includes(delimiter) || v.includes('"') ? `"${v.replace(/"/g,'""')}"` : v; }).join(delimiter))];
      setOutput(rows.join('\n'));
    } catch (e: any) { setError(e.message); }
  };
  const download = () => { const b = new Blob([output], {type:'text/csv'}); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'data.csv'; a.click(); };
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Delimiter:</label>
        {[{l:'Comma',v:','},{l:'Semicolon',v:';'},{l:'Tab',v:'\t'},{l:'Pipe',v:'|'}].map(d=>(<button key={d.v} onClick={()=>setDelimiter(d.v)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${delimiter===d.v?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{d.l}</button>))}
      </div>
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">JSON Input (array of objects)</label><textarea className="tool-input h-40 font-mono text-sm" value={input} onChange={e => setInput(e.target.value)} placeholder={'[\n  {"name":"Alice","city":"Delhi"},\n  {"name":"Bob","city":"Mumbai"}\n]'} /></div>
      <button onClick={convert} className="w-full py-2.5 rounded-xl bg-brand-500/20 border border-brand-400/40 text-brand-300 font-bold hover:bg-brand-500/30 transition">Convert to CSV</button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {output && (<div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">CSV Output</label><textarea readOnly className="tool-input h-32 font-mono text-xs" value={output} /><button onClick={download} className="mt-2 px-4 py-2 text-sm font-semibold bg-white/3 border border-white/10 rounded-lg text-slate-300 hover:text-white transition">⬇ Download .csv</button></div>)}
    </div>
  );
}
