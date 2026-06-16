'use client';
import { useState } from 'react';
export default function TextToSlug() {
  const [input, setInput] = useState('');
  const [domain, setDomain] = useState('https://yoursite.com/blog/');
  const toSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  const slug = toSlug(input);
  const full = domain + slug;
  return (
    <div className="space-y-4">
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Title or Text</label><input className="tool-input text-lg" value={input} onChange={e=>setInput(e.target.value)} placeholder="How to Calculate GST in India 2026" /></div>
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Domain Prefix (optional)</label><input className="tool-input text-sm" value={domain} onChange={e=>setDomain(e.target.value)} /></div>
      {slug && (<div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 space-y-3">
        <div><div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Slug</div><div className="flex items-center gap-2"><code className="text-brand-300 font-extrabold text-lg font-mono">{slug}</code><button onClick={()=>navigator.clipboard.writeText(slug)} className="text-xs text-slate-500 hover:text-brand-400">📋</button></div></div>
        <div><div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Full URL</div><div className="flex items-center gap-2 flex-wrap"><code className="text-slate-300 text-sm font-mono break-all">{full}</code><button onClick={()=>navigator.clipboard.writeText(full)} className="text-xs text-slate-500 hover:text-brand-400 flex-shrink-0">📋</button></div></div>
        <div className="text-xs text-slate-500">Length: {slug.length} chars · Hyphens used (SEO best practice)</div>
      </div>)}
    </div>
  );
}
