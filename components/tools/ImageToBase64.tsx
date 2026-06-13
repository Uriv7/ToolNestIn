'use client';
import { useState } from 'react';
export default function ImageToBase64() {
  const [b64, setB64] = useState('');
  const [mime, setMime] = useState('');
  const [size, setSize] = useState(0);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setMime(f.type); setSize(f.size);
    const r = new FileReader();
    r.onload = () => setB64(r.result as string);
    r.readAsDataURL(f);
  };
  const [decInput, setDecInput] = useState('');
  const decImg = decInput.startsWith('data:') ? decInput : `data:image/png;base64,${decInput}`;
  return (
    <div className="space-y-5">
      <div className="flex gap-2"><button className="flex-1 py-2.5 rounded-xl text-sm font-600 bg-brand-500/20 border border-brand-400/50 text-brand-300">🖼️ Image → Base64</button></div>
      <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Upload Image (PNG, JPG, WEBP, SVG, GIF)</label><input type="file" accept="image/*" onChange={handleFile} className="tool-input text-sm" /></div>
      {b64 && (<>
        <div className="flex items-center gap-3 text-sm text-slate-400"><span>{mime}</span><span>·</span><span>{(size/1024).toFixed(1)} KB original</span><span>·</span><span>{(b64.length/1024).toFixed(1)} KB base64 (+{Math.round((b64.length/size-1)*100)}%)</span></div>
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Base64 Data URI</label><textarea readOnly className="tool-input h-24 font-mono text-xs" value={b64} /><button onClick={()=>navigator.clipboard.writeText(b64)} className="mt-2 px-4 py-2 text-sm font-600 bg-white/3 border border-white/10 rounded-lg text-slate-300 hover:text-white transition">📋 Copy Data URI</button></div>
      </>)}
      <div className="border-t border-white/5 pt-4"><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Base64 → Image (Decode)</label>
        <textarea className="tool-input h-20 font-mono text-xs" value={decInput} onChange={e=>setDecInput(e.target.value)} placeholder="Paste base64 string or data URI here..." />
        {decInput.length > 20 && <img src={decImg} alt="decoded" className="mt-3 rounded-xl border border-white/10 max-h-48 object-contain" onError={()=>{}} />}
      </div>
    </div>
  );
}
