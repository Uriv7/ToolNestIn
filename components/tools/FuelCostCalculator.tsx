'use client';
import { useState, useMemo } from 'react';

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState('');
  const [mileage, setMileage] = useState('15');
  const [fuelPrice, setFuelPrice] = useState('102');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'cng'>('petrol');
  const [trips, setTrips] = useState('22');

  const FUEL_PRICES: Record<string, { price: string; label: string }> = {
    petrol: { price: '102', label: 'Petrol (₹/litre)' },
    diesel: { price: '89', label: 'Diesel (₹/litre)' },
    cng: { price: '76', label: 'CNG (₹/kg)' },
  };

  const result = useMemo(() => {
    const d = parseFloat(distance) || 0;
    const m = parseFloat(mileage) || 1;
    const p = parseFloat(fuelPrice) || 0;
    const t = parseInt(trips) || 0;

    const fuelPerTrip = d / m;
    const costPerTrip = fuelPerTrip * p;
    const monthlyCost = costPerTrip * t;
    const yearlyCost = monthlyCost * 12;
    const fuelPerMonth = fuelPerTrip * t;

    return { fuelPerTrip, costPerTrip, monthlyCost, yearlyCost, fuelPerMonth };
  }, [distance, mileage, fuelPrice, trips]);

  const fmt = (n: number) => `₹${n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  return (
    <div className="space-y-5">
      {/* Fuel type */}
      <div className="flex gap-2">
        {(['petrol', 'diesel', 'cng'] as const).map(f => (
          <button key={f} onClick={() => { setFuelType(f); setFuelPrice(FUEL_PRICES[f].price); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border capitalize transition ${fuelType === f ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {f === 'petrol' ? '⛽ Petrol' : f === 'diesel' ? '🛢️ Diesel' : '🟡 CNG'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Distance (km)</label>
          <input type="number" className="tool-input" value={distance} onChange={e => setDistance(e.target.value)} placeholder="30"  aria-label="Distance (km)"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Mileage (km/l)</label>
          <input type="number" className="tool-input" value={mileage} onChange={e => setMileage(e.target.value)} placeholder="15"  aria-label="Mileage (km/l)"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{FUEL_PRICES[fuelType].label}</label>
          <input type="number" className="tool-input" value={fuelPrice} onChange={e => setFuelPrice(e.target.value)}  aria-label="Trips per Month"/>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Trips per Month</label>
          <input type="number" className="tool-input" value={trips} onChange={e => setTrips(e.target.value)} placeholder="22" />
        </div>
      </div>

      {(parseFloat(distance) || 0) > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: 'Fuel per Trip', v: `${result.fuelPerTrip.toFixed(2)}L` },
            { l: 'Cost per Trip', v: fmt(result.costPerTrip) },
            { l: 'Monthly Cost', v: fmt(result.monthlyCost), h: true },
            { l: 'Yearly Cost', v: fmt(result.yearlyCost) },
          ].map(r => (
            <div key={r.l} className={`rounded-2xl p-4 border text-center ${r.h ? 'bg-brand-500/15 border-brand-400/40' : 'bg-white/3 border-white/10'}`}>
              <div className={`font-sans text-xl font-extrabold ${r.h ? 'gradient-text' : 'text-slate-200'}`}>{r.v}</div>
              <div className="text-xs text-slate-500 mt-1">{r.l}</div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">Fuel prices shown are approximate average prices for major Indian cities in 2026.</p>
    </div>
  );
}
