'use client';
import { useState } from 'react';

const UNITS: Record<string, { label: string; units: { id: string; name: string; factor: number }[] }> = {
  length: {
    label: '📏 Length',
    units: [
      { id: 'km', name: 'Kilometer', factor: 1000 },
      { id: 'm', name: 'Meter', factor: 1 },
      { id: 'cm', name: 'Centimeter', factor: 0.01 },
      { id: 'mm', name: 'Millimeter', factor: 0.001 },
      { id: 'mi', name: 'Mile', factor: 1609.344 },
      { id: 'yd', name: 'Yard', factor: 0.9144 },
      { id: 'ft', name: 'Foot', factor: 0.3048 },
      { id: 'in', name: 'Inch', factor: 0.0254 },
    ],
  },
  weight: {
    label: '⚖️ Weight',
    units: [
      { id: 'kg', name: 'Kilogram', factor: 1 },
      { id: 'g', name: 'Gram', factor: 0.001 },
      { id: 'mg', name: 'Milligram', factor: 0.000001 },
      { id: 'lb', name: 'Pound', factor: 0.453592 },
      { id: 'oz', name: 'Ounce', factor: 0.0283495 },
      { id: 't', name: 'Metric Ton', factor: 1000 },
    ],
  },
  temperature: {
    label: '🌡️ Temperature',
    units: [
      { id: 'c', name: 'Celsius (°C)', factor: 1 },
      { id: 'f', name: 'Fahrenheit (°F)', factor: 1 },
      { id: 'k', name: 'Kelvin (K)', factor: 1 },
    ],
  },
  volume: {
    label: '🧪 Volume',
    units: [
      { id: 'l', name: 'Liter', factor: 1 },
      { id: 'ml', name: 'Milliliter', factor: 0.001 },
      { id: 'gal', name: 'US Gallon', factor: 3.78541 },
      { id: 'qt', name: 'US Quart', factor: 0.946353 },
      { id: 'cup', name: 'Cup', factor: 0.236588 },
      { id: 'tbsp', name: 'Tablespoon', factor: 0.0147868 },
    ],
  },
};

function convertTemp(value: number, from: string, to: string) {
  let celsius = from === 'c' ? value : from === 'f' ? (value - 32) * 5 / 9 : value - 273.15;
  if (to === 'c') return celsius;
  if (to === 'f') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState('m');

  const units = UNITS[category].units;

  const convert = (toId: string) => {
    const v = parseFloat(value);
    if (isNaN(v)) return '';
    if (category === 'temperature') {
      return convertTemp(v, from, toId).toFixed(6).replace(/\.?0+$/, '');
    }
    const fromU = units.find(u => u.id === from)!;
    const toU = units.find(u => u.id === toId)!;
    return ((v * fromU.factor) / toU.factor).toFixed(8).replace(/\.?0+$/, '');
  };

  return (
    <div className="space-y-5">
      {/* Category */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(UNITS).map(([k, v]) => (
          <button key={k} onClick={() => { setCategory(k); setFrom(v.units[0].id); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${category === k ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Value</label>
          <input type="number" className="tool-input text-lg" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">From Unit</label>
          <select className="tool-input" value={from} onChange={e => setFrom(e.target.value)}>
            {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2">
        {units.filter(u => u.id !== from).map(u => (
          <div key={u.id} className="flex items-center justify-between px-4 py-3 bg-white/3 border border-white/8 rounded-xl hover:bg-white/5 transition">
            <span className="text-sm text-slate-400">{u.name} ({u.id})</span>
            <span className="font-mono text-brand-300 font-semibold">{convert(u.id)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
