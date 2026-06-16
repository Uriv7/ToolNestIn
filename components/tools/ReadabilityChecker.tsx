'use client';
import { useState } from 'react';
export default function ReadabilityChecker() {
  const [text, setText] = useState('');
  const analyse = () => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(s=>s.trim().length>2);
    const syllables = words.reduce((a,w)=>{const s=w.toLowerCase().replace(/[^a-z]/g,'').replace(/[^aeiouy]+$/,'').replace(/[^aeiouy]{2,}/g,'a').replace(/[aeiouy]/g,'1');return a+Math.max(1,s.split('1').length-1);},0);
    const complexWords = words.filter(w=>{const s=w.toLowerCase().replace(/[^a-z]/g,'').replace(/[^aeiouy]+$/,'').replace(/[^aeiouy]{2,}/g,'a').replace(/[aeiouy]/g,'1');return Math.max(1,s.split('1').length-1)>=3;}).length;
    const wc = words.length; const sc = sentences.length || 1; const avgWPS = wc/sc; const avgSPW = syllables/wc||1;
    const flesch = Math.round(206.835 - 1.015*avgWPS - 84.6*avgSPW);
    const fkgl = Math.round(0.39*avgWPS + 11.8*avgSPW - 15.59);
    const fog = Math.round(0.4*(avgWPS + 100*complexWords/wc));
    const getLabel = (f: number) => f>=90?'Very Easy':f>=70?'Easy':f>=60?'Standard':f>=50?'Fairly Difficult':f>=30?'Difficult':'Very Difficult';
    return { flesch, fkgl, fog, wc, sc, syllables, readTime: Math.ceil(wc/200), label: getLabel(flesch) };
  };
  const r = text.trim().split(/\s+/).filter(Boolean).length>10 ? analyse() : null;
  const color = r ? r.flesch>=70?'text-emerald-400':r.flesch>=50?'text-amber-400':'text-red-400' : '';
  return (
    <div className="space-y-5">
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Paste Your Content</label><textarea className="tool-input h-40" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your blog post, article, or any text here (minimum 50 words for accurate results)..." /></div>
      {r && (<div className="space-y-3">
        <div className={`bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 text-center`}>
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Flesch Reading Ease</div>
          <div className={`font-extrabold text-5xl ${color}`}>{Math.min(100,Math.max(0,r.flesch))}</div>
          <div className={`font-bold mt-1 ${color}`}>{r.label}</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{l:'Grade Level',v:`Grade ${Math.max(1,r.fkgl)}`},{l:'Gunning Fog',v:r.fog+' grade'},{l:'Read Time',v:r.readTime+' min'}].map(s=>(<div key={s.l} className="bg-white/3 border border-white/10 rounded-xl p-3 text-center"><div className="text-slate-200 font-extrabold">{s.v}</div><div className="text-xs text-slate-500 mt-1">{s.l}</div></div>))}
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          {[{l:'Words',v:r.wc},{l:'Sentences',v:r.sc},{l:'Syllables',v:r.syllables}].map(s=>(<div key={s.l} className="bg-white/3 border border-white/10 rounded-xl px-3 py-2 flex justify-between"><span className="text-slate-400">{s.l}</span><span className="text-slate-200 font-bold">{s.v}</span></div>))}
        </div>
        <div className="bg-white/3 rounded-xl p-3 text-xs text-slate-400"><strong className="text-slate-300">Target for web content:</strong> Flesch 60-70 (Standard). If your score is below 50, shorten sentences and use simpler words.</div>
      </div>)}
    </div>
  );
}
