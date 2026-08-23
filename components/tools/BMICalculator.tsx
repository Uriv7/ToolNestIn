'use client';
import { useState } from 'react';

export default function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightIn, setHeightIn] = useState('');

  let bmi = 0;
  if (unit === 'metric') {
    const w = parseFloat(weight), h = parseFloat(height) / 100;
    if (w > 0 && h > 0) bmi = w / (h * h);
  } else {
    const w = parseFloat(weight), hFt = parseFloat(height), hInch = parseFloat(heightIn) || 0;
    const totalIn = hFt * 12 + hInch;
    if (w > 0 && totalIn > 0) bmi = (703 * w) / (totalIn * totalIn);
  }

  const getCategory = (b: number) => {
    if (b <= 0) return null;
    if (b < 18.5) return { label: 'Underweight', color: '#60a5fa', bar: 10 };
    if (b < 25)   return { label: 'Normal weight ✓', color: '#34d399', bar: 35 };
    if (b < 30)   return { label: 'Overweight', color: '#fbbf24', bar: 65 };
    return          { label: 'Obese', color: '#f87171', bar: 90 };
  };

  // Asia-Pacific classification (WHO Western Pacific Region / widely used in India) —
  // lower cutoffs than the standard WHO scale, since research (including ICMR-backed
  // studies) shows South Asians face higher metabolic risk at lower BMI values.
  const getAsiaPacificCategory = (b: number) => {
    if (b <= 0) return null;
    if (b < 18.5) return { label: 'Underweight', color: '#60a5fa' };
    if (b < 23)   return { label: 'Normal weight ✓', color: '#34d399' };
    if (b < 25)   return { label: 'Overweight (at risk)', color: '#fbbf24' };
    if (b < 30)   return { label: 'Obese I', color: '#f97316' };
    return          { label: 'Obese II', color: '#f87171' };
  };

  const cat = getCategory(bmi);
  const catAP = getAsiaPacificCategory(bmi);

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex gap-2">
        {(['metric', 'imperial'] as const).map(u => (
          <button key={u} onClick={() => setUnit(u)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition border ${unit === u ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {u === 'metric' ? '⚖️ Metric (kg/cm)' : '📐 Imperial (lb/in)'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Weight ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input type="number" className="tool-input" value={weight} onChange={e => setWeight(e.target.value)} placeholder={unit === 'metric' ? '70' : '154'}  aria-label="Height (cm)"/>
        </div>
        {unit === 'metric' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Height (cm)</label>
            <input type="number" className="tool-input" value={height} onChange={e => setHeight(e.target.value)} placeholder="175"  aria-label="Feet"/>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Feet</label>
              <input type="number" className="tool-input" value={height} onChange={e => setHeight(e.target.value)} placeholder="5"  aria-label="Inches"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Inches</label>
              <input type="number" className="tool-input" value={heightIn} onChange={e => setHeightIn(e.target.value)} placeholder="9" />
            </div>
          </div>
        )}
      </div>

      {bmi > 0 && cat && (
        <div className="bg-gradient-to-br from-dark-700 to-dark-800 rounded-2xl p-6 border border-white/10">
          <div className="text-center mb-5">
            <div className="font-sans text-6xl font-black mb-2" style={{ color: cat.color }}>
              {bmi.toFixed(1)}
            </div>
            <div className="text-lg font-semibold" style={{ color: cat.color }}>{cat.label}</div>
          </div>

          {/* BMI Scale */}
          <div className="mb-4">
            <div className="h-4 rounded-full overflow-hidden flex">
              {[{ c: '#60a5fa', w: 25 }, { c: '#34d399', w: 25 }, { c: '#fbbf24', w: 25 }, { c: '#f87171', w: 25 }].map((seg, i) => (
                <div key={i} className="h-full" style={{ width: `${seg.w}%`, background: seg.c, opacity: 0.6 }} />
              ))}
            </div>
            <div
              className="w-3 h-3 rounded-full border-2 border-white -mt-3.5 transition-all"
              style={{ marginLeft: `${Math.min(Math.max((bmi - 10) / 30 * 100, 2), 96)}%`, background: cat.color }}
            />
          </div>

          <div className="grid grid-cols-4 text-center text-xs text-slate-500 gap-1">
            {['<18.5 Underweight', '18.5–24.9 Normal', '25–29.9 Overweight', '>30 Obese'].map(s => (
              <span key={s}>{s}</span>
            ))}
          </div>

          {/* Dual classification — WHO standard vs Asia-Pacific scale */}
          {catAP && (
            <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">WHO Standard</p>
                <p className="text-sm font-bold" style={{ color: cat!.color }}>{cat!.label}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Asia-Pacific Scale</p>
                <p className="text-sm font-bold" style={{ color: catAP.color }}>{catAP.label}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
