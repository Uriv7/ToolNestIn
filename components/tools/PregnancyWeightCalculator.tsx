'use client';
import { useState } from 'react';
export default function PregnancyWeightCalculator() {
  const [preBMI, setPreBMI] = useState('');
  const [week, setWeek] = useState('');
  const bmi = parseFloat(preBMI) || 0;
  const w = parseInt(week) || 0;
  const ranges: Record<string, [number,number,number,number,string]> = {
    underweight: [12.5,18,0.5,0.5,'Underweight (<18.5)'],
    normal: [11.5,16,0.36,0.45,'Normal Weight (18.5–24.9)'],
    overweight: [7,11.5,0.23,0.32,'Overweight (25–29.9)'],
    obese: [5,9,0.17,0.27,'Obese (≥30)'],
  };
  const cat = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : bmi >= 30 ? 'obese' : '';
  const range = cat ? ranges[cat] : null;
  const weeklyGainLow = range ? range[2] : 0;
  const weeklyGainHigh = range ? range[3] : 0;
  const expectedLow = w > 13 ? range ? (range[0]/40)+(weeklyGainLow*(w-13)) : 0 : 0;
  const expectedHigh = w > 13 ? range ? (range[1]/40)+(weeklyGainHigh*(w-13)) : 0 : 0;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Pre-Pregnancy BMI</label><input type="number" className="tool-input" value={preBMI} onChange={e => setPreBMI(e.target.value)} placeholder="22" step="0.1" /></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Current Week of Pregnancy</label><input type="number" className="tool-input" value={week} onChange={e => setWeek(e.target.value)} min="1" max="40" placeholder="20" /></div>
      </div>
      {range && (
        <div className="space-y-3">
          <div className="bg-brand-500/10 border border-brand-400/20 rounded-xl p-3 text-sm text-slate-300 text-center">{range[4]} — Total recommended gain: <strong className="text-brand-300">{range[0]}–{range[1]} kg</strong></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/3 border border-white/10 rounded-2xl p-4 text-center"><div className="gradient-text font-extrabold text-xl">{range[2]}–{range[3]} kg</div><div className="text-xs text-slate-500 mt-1">Weekly gain (2nd & 3rd trimester)</div></div>
            {w > 0 && <div className="bg-white/3 border border-white/10 rounded-2xl p-4 text-center"><div className="gradient-text font-extrabold text-xl">{expectedLow.toFixed(1)}–{expectedHigh.toFixed(1)} kg</div><div className="text-xs text-slate-500 mt-1">Expected gain at week {w}</div></div>}
          </div>
          <div className="bg-white/3 rounded-xl p-3 text-xs text-slate-400 space-y-1">
            <div>🔵 1st trimester (wk 1-13): gain 0.5-2 kg total</div>
            <div>🟢 2nd trimester (wk 14-27): ~{range[2]}–{range[3]} kg/week</div>
            <div>🟡 3rd trimester (wk 28-40): ~{range[2]}–{range[3]} kg/week</div>
          </div>
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">ACOG & FOGSI guidelines. Always follow your OB-GYN's specific advice.</p>
    </div>
  );
}
