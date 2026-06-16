'use client';
import { useState } from 'react';
export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('moderate');
  const [climate, setClimate] = useState('normal');
  const w = parseFloat(weight) || 0;
  const base = w * 35;
  const actAdd = activity==='active'?500:activity==='very-active'?1000:0;
  const climAdd = climate==='hot'?500:climate==='very-hot'?1000:0;
  const total = base + actAdd + climAdd;
  const glasses = Math.round(total / 250);
  const levels = [{label:'Sedentary',id:'sedentary'},{label:'Moderate',id:'moderate'},{label:'Active (gym)',id:'active'},{label:'Very Active',id:'very-active'}];
  return (
    <div className="space-y-5">
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Body Weight (kg)</label><input type="number" className="tool-input" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" /></div>
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Activity Level</label>
        <div className="grid grid-cols-2 gap-2">{levels.map(l=>(<button key={l.id} onClick={()=>setActivity(l.id)} className={`py-2 rounded-xl text-sm font-semibold border transition ${activity===l.id?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{l.label}</button>))}</div>
      </div>
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Climate</label>
        <div className="grid grid-cols-3 gap-2">{[{id:'normal',l:'Normal'},{id:'hot',l:'Hot Summer'},{id:'very-hot',l:'Very Hot 40°C+'}].map(c=>(<button key={c.id} onClick={()=>setClimate(c.id)} className={`py-2 rounded-xl text-sm font-semibold border transition ${climate===c.id?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{c.l}</button>))}</div>
      </div>
      {w > 0 && (
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 text-center space-y-2">
          <div className="gradient-text font-extrabold text-4xl">{(total/1000).toFixed(1)} L</div>
          <div className="text-slate-300">daily water intake</div>
          <div className="text-slate-400 text-sm">≈ {glasses} glasses (250ml each)</div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-slate-500">
            <div>Base: {(base/1000).toFixed(1)}L</div>
            <div>Activity: +{((actAdd)/1000).toFixed(1)}L</div>
            <div>Climate: +{((climAdd)/1000).toFixed(1)}L</div>
          </div>
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">Based on ICMR guidelines: 35ml/kg body weight as baseline.</p>
    </div>
  );
}
