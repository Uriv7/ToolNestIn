'use client';
import { useState, useMemo } from 'react';

export default function CalorieCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState('1.375');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');

  const result = useMemo(() => {
    const w = parseFloat(weight), h = parseFloat(height), a = parseInt(age);
    if (!w || !h || !a) return null;

    // Mifflin-St Jeor Equation
    const bmr = gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = bmr * parseFloat(activity);

    const calories = goal === 'lose' ? tdee - 500 : goal === 'gain' ? tdee + 300 : tdee;

    // Macros (balanced split)
    const protein = w * 1.8; // 1.8g per kg bodyweight
    const fat = (calories * 0.25) / 9;
    const carbs = (calories - protein * 4 - fat * 9) / 4;

    return { bmr, tdee, calories, protein, fat, carbs };
  }, [weight, height, age, gender, activity, goal]);

  const ACTIVITIES = [
    { v: '1.2', l: 'Sedentary (desk job, no exercise)' },
    { v: '1.375', l: 'Lightly active (1–3 days/week)' },
    { v: '1.55', l: 'Moderately active (3–5 days/week)' },
    { v: '1.725', l: 'Very active (6–7 days/week)' },
    { v: '1.9', l: 'Extra active (physical job + gym)' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Weight (kg)</label>
          <input type="number" className="tool-input" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" />
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Height (cm)</label>
          <input type="number" className="tool-input" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" />
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Age (years)</label>
          <input type="number" className="tool-input" value={age} onChange={e => setAge(e.target.value)} placeholder="30" />
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Gender</label>
          <select className="tool-input" value={gender} onChange={e => setGender(e.target.value as any)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Activity Level</label>
        <select className="tool-input" value={activity} onChange={e => setActivity(e.target.value)}>
          {ACTIVITIES.map(a => <option key={a.v} value={a.v}>{a.l}</option>)}
        </select>
      </div>

      <div className="flex gap-2">
        {(['lose', 'maintain', 'gain'] as const).map(g => (
          <button key={g} onClick={() => setGoal(g)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-600 border capitalize transition ${goal === g ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {g === 'lose' ? '📉 Lose Weight' : g === 'gain' ? '📈 Gain Muscle' : '⚖️ Maintain'}
          </button>
        ))}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-brand-500/10 border border-brand-400/30 rounded-2xl p-5 text-center">
            <div className="text-sm text-slate-500 mb-1">Daily Calorie Target</div>
            <div className="font-display text-5xl font-900 gradient-text">{Math.round(result.calories)}</div>
            <div className="text-sm text-slate-500 mt-1">calories/day</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { l: '🥩 Protein', v: `${Math.round(result.protein)}g`, sub: `${Math.round(result.protein * 4)} kcal` },
              { l: '🌾 Carbs', v: `${Math.round(result.carbs)}g`, sub: `${Math.round(result.carbs * 4)} kcal` },
              { l: '🥑 Fats', v: `${Math.round(result.fat)}g`, sub: `${Math.round(result.fat * 9)} kcal` },
            ].map(r => (
              <div key={r.l} className="glass rounded-xl p-3 text-center">
                <div className="text-sm text-slate-400 mb-1">{r.l}</div>
                <div className="font-800 text-slate-100 text-lg">{r.v}</div>
                <div className="text-xs text-slate-600">{r.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass rounded-xl p-3 text-center">
              <div className="text-xs text-slate-500">BMR (Base Metabolic Rate)</div>
              <div className="font-700 text-slate-200">{Math.round(result.bmr)} kcal</div>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <div className="text-xs text-slate-500">TDEE (Total Daily Expenditure)</div>
              <div className="font-700 text-slate-200">{Math.round(result.tdee)} kcal</div>
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">Based on Mifflin-St Jeor equation. Consult a nutritionist for personalized diet plans.</p>
    </div>
  );
}
