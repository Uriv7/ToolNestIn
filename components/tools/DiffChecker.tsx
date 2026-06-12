'use client';
import { useState } from 'react';
export default function DiffChecker() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const diff = () => {
    const a = (ignoreCase ? left.toLowerCase() : left).split('\n');
    const b = (ignoreCase ? right.toLowerCase() : right).split('\n');
    const al = left.split('\n'); const bl = right.split('\n');
    const max = Math.max(a.length, b.length);
    return Array.from({length:max},(_,i)=>{
      const la = al[i]; const lb = bl[i];
      const ca = a[i]; const cb = b[i];
      if (ca === undefined) return {type:'add', l:lb};
      if (cb === undefined) return {type:'del', l:la};
      if (ca === cb) return {type:'same', l:la};
      return {type:'change', l:la, r:lb};
    });
  };
  const diffs = left||right ? diff() : [];
  const added = diffs.filter(d=>d.type==='add').length;
  const removed = diffs.filter(d=>d.type==='del').length;
  const changed = diffs.filter(d=>d.type==='change').length;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer"><input type="checkbox" checked={ignoreCase} onChange={e=>setIgnoreCase(e.target.checked)} className="rounded" /><span>Ignore case</span></label>
        {diffs.length > 0 && <div className="flex gap-3 text-xs ml-auto"><span className="text-emerald-400">+{added} added</span><span className="text-red-400">-{removed} removed</span><span className="text-amber-400">~{changed} changed</span></div>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Original</label><textarea className="tool-input h-40 font-mono text-xs" value={left} onChange={e=>setLeft(e.target.value)} placeholder="Paste first text here..." /></div>
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Modified</label><textarea className="tool-input h-40 font-mono text-xs" value={right} onChange={e=>setRight(e.target.value)} placeholder="Paste second text here..." /></div>
      </div>
      {diffs.length > 0 && (
        <div className="rounded-xl border border-white/10 overflow-hidden font-mono text-xs">
          {diffs.map((d,i)=>(
            <div key={i} className={`px-3 py-1 ${d.type==='add'?'bg-emerald-500/15 text-emerald-300':d.type==='del'?'bg-red-500/15 text-red-300':d.type==='change'?'bg-amber-500/15 text-amber-300':'text-slate-400'}`}>
              {d.type==='add'?'+ ':d.type==='del'?'- ':d.type==='change'?'~ ':'  '}{d.type==='change'?`${d.l} → ${d.r}`:d.l||d.r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
