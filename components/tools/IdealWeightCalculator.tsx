'use client';
import { useState } from 'react';
export default function IdealWeightCalculator() {
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'m'|'f'>('m');
  const h = parseFloat(height) || 0;
  const hIn = h / 2.54;
  const over5ft = Math.max(0, hIn - 60);
  const hamwi = gender==='m' ? 48 + 2.7 * over5ft : 45.5 + 2.2 * over5ft;
  const devine = gender==='m' ? 50 + 2.3 * over5ft : 45.5 + 2.3 * over5ft;
  const robinson = gender==='m' ? 52 + 1.9 * over5ft : 49 + 1.7 * over5ft;
  const bmiLow = 18.5 * (h/100)**2;
  const bmiHigh = 22.9 * (h/100)**2;
  return (
    <div className="space-y-5">
      <div className="flex gap-2">{(['m','f'] as const).map(g => (<button key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-xl text-sm font-600 border transition ${gender===g?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{g==='m'?'👨 Male':'👩 Female'}</button>))}</div>
      <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Height (cm)</label><input type="number" className="tool-input" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" /></div>
      {h > 0 && (
        <div className="space-y-3">
          <div className="bg-brand-500/15 border border-brand-400/40 rounded-2xl p-4 text-center">
            <div className="text-xs text-slate-400 mb-1">Healthy BMI Range for Indians (18.5–22.9)</div>
            <div className="gradient-text font-800 text-2xl">{bmiLow.toFixed(1)} – {bmiHigh.toFixed(1)} kg</div>
          </div>
          {[{label:'Hamwi',val:hamwi},{label:'Devine',val:devine},{label:'Robinson',val:robinson}].map(f=>(
            <div key={f.label} className="flex justify-between items-center bg-white/3 border border-white/10 rounded-xl px-4 py-3">
              <span className="text-slate-400 text-sm">{f.label} Formula</span>
              <span className="text-slate-200 font-700">{f.val.toFixed(1)} kg</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">Ideal weight is a range, not a single number. Consult a doctor for personalised guidance.</p>
    </div>
  );
}
