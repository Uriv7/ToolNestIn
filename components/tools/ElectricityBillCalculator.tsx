'use client';
import { useState, useMemo } from 'react';

export default function ElectricityBillCalculator() {
  const [units, setUnits] = useState('');
  const [state, setState] = useState('delhi');
  const [category, setCategory] = useState<'domestic' | 'commercial'>('domestic');

  // Approximate 2026 tariff slabs for major states (₹/unit)
  const TARIFFS: Record<string, { slabs: { max: number; rate: number }[]; fixed: number; name: string }> = {
    delhi: {
      name: 'Delhi (BSES/Tata)',
      fixed: 125,
      slabs: [
        { max: 200, rate: 3.00 },
        { max: 400, rate: 4.50 },
        { max: 800, rate: 6.50 },
        { max: 1200, rate: 7.00 },
        { max: Infinity, rate: 8.00 },
      ],
    },
    maharashtra: {
      name: 'Maharashtra (MSEDCL)',
      fixed: 180,
      slabs: [
        { max: 100, rate: 2.43 },
        { max: 300, rate: 4.70 },
        { max: 500, rate: 7.05 },
        { max: Infinity, rate: 9.03 },
      ],
    },
    karnataka: {
      name: 'Karnataka (BESCOM)',
      fixed: 50,
      slabs: [
        { max: 30, rate: 3.15 },
        { max: 100, rate: 5.75 },
        { max: 200, rate: 6.50 },
        { max: Infinity, rate: 7.95 },
      ],
    },
    tamilnadu: {
      name: 'Tamil Nadu (TNEB)',
      fixed: 0,
      slabs: [
        { max: 100, rate: 0 }, // Free up to 100 units
        { max: 200, rate: 1.50 },
        { max: 500, rate: 3.00 },
        { max: Infinity, rate: 5.75 },
      ],
    },
    gujarat: {
      name: 'Gujarat (DGVCL/UGVCL)',
      fixed: 100,
      slabs: [
        { max: 50, rate: 2.45 },
        { max: 250, rate: 3.90 },
        { max: 500, rate: 5.25 },
        { max: Infinity, rate: 6.00 },
      ],
    },
    up: {
      name: 'Uttar Pradesh (UPPCL)',
      fixed: 110,
      slabs: [
        { max: 150, rate: 4.50 },
        { max: 300, rate: 5.50 },
        { max: 500, rate: 6.00 },
        { max: Infinity, rate: 6.50 },
      ],
    },
  };

  const result = useMemo(() => {
    const u = parseInt(units) || 0;
    if (!u) return null;
    const tariff = TARIFFS[state];
    let energyCharge = 0;
    let prev = 0;
    for (const slab of tariff.slabs) {
      if (u <= prev) break;
      const inSlab = Math.min(u, slab.max) - prev;
      energyCharge += inSlab * slab.rate;
      prev = slab.max;
    }
    const fixed = tariff.fixed;
    const subtotal = energyCharge + fixed;
    const tax = subtotal * 0.08; // ~8% electricity duty
    const total = subtotal + tax;
    return { energyCharge, fixed, tax, total, tariff };
  }, [units, state]);

  const fmt = (n: number) => `₹${n.toFixed(2)}`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Units Consumed (kWh)</label>
          <input type="number" className="tool-input text-lg font-700" value={units} onChange={e => setUnits(e.target.value)} placeholder="e.g. 250" />
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">State / Utility</label>
          <select className="tool-input" value={state} onChange={e => setState(e.target.value)}>
            {Object.entries(TARIFFS).map(([k, v]) => (
              <option key={k} value={k}>{v.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Connection Type</label>
          <select className="tool-input" value={category} onChange={e => setCategory(e.target.value as any)}>
            <option value="domestic">Domestic</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-brand-500/10 border border-brand-400/30 rounded-2xl p-5 text-center">
            <div className="font-display text-5xl font-900 gradient-text mb-1">{fmt(result.total)}</div>
            <p className="text-slate-500 text-sm">Estimated monthly bill for {units} units</p>
          </div>
          <div className="space-y-2">
            {[
              { l: 'Energy Charges', v: fmt(result.energyCharge) },
              { l: 'Fixed / Meter Charge', v: fmt(result.fixed) },
              { l: 'Electricity Duty (~8%)', v: fmt(result.tax) },
              { l: 'Total Bill', v: fmt(result.total) },
            ].map(r => (
              <div key={r.l} className="flex justify-between px-4 py-2.5 bg-white/3 border border-white/8 rounded-xl">
                <span className="text-sm text-slate-400">{r.l}</span>
                <span className="font-600 text-slate-200">{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">Tariff rates are approximate for 2026. Check your state electricity board for exact rates.</p>
    </div>
  );
}
