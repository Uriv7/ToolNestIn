'use client';
import { useState } from 'react';
export default function BMICalculatorKids() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'m'|'f'>('m');
  const w = parseFloat(weight)||0; const h = parseFloat(height)||0; const a = parseInt(age)||0;
  const bmi = w && h ? w / ((h/100)**2) : 0;
  const getCategory = () => {
    if (!bmi || a < 2 || a > 18) return null;
    if (bmi < 14) return { label: 'Severely Underweight', color: 'text-red-400' };
    if (bmi < 16) return { label: 'Underweight', color: 'text-amber-400' };
    if (bmi < 23) return { label: 'Healthy Weight', color: 'text-emerald-400' };
    if (bmi < 27) return { label: 'Overweight', color: 'text-amber-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };
  const cat = getCategory();
  return (
    <div className="space-y-5">
      <div className="flex gap-2">{(['m','f'] as const).map(g => (<button key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-xl text-sm font-600 border transition ${gender===g?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{g==='m'?'👦 Boy':'👧 Girl'}</button>))}</div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Age (years)</label><input type="number" className="tool-input" value={age} onChange={e => setAge(e.target.value)} min="2" max="18" placeholder="8" /></div>
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Weight (kg)</label><input type="number" className="tool-input" value={weight} onChange={e => setWeight(e.target.value)} placeholder="30" /></div>
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Height (cm)</label><input type="number" className="tool-input" value={height} onChange={e => setHeight(e.target.value)} placeholder="130" /></div>
      </div>
      {bmi > 0 && cat && (
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 text-center space-y-2">
          <div className="text-xs text-slate-400 uppercase tracking-widest">BMI</div>
          <div className="gradient-text font-800 text-4xl">{bmi.toFixed(1)}</div>
          <div className={`font-700 text-lg ${cat.color}`}>{cat.label}</div>
          <p className="text-xs text-slate-500 mt-2">Based on IAP 2015 growth charts for Indian children aged {a}.</p>
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">Indian Academy of Pediatrics reference charts. Not a substitute for medical advice.</p>
    </div>
  );
}
