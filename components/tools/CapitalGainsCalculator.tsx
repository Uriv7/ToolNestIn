'use client';
import { useState } from 'react';
const ASSET_TYPES = [
  { id: 'equity', label: 'Equity / Equity MF', stcg: 20, ltcg: 12.5, ltcgExemption: 125000, holding: 12, holdingLabel: '1 year' },
  { id: 'debt', label: 'Debt Funds (post Apr 2023)', stcg: null, ltcg: null, note: 'Taxed at slab rate regardless of holding period' },
  { id: 'property', label: 'Property', stcg: null, ltcg: 12.5, ltcgExemption: 0, holding: 24, holdingLabel: '2 years' },
  { id: 'gold', label: 'Gold / Gold ETF', stcg: null, ltcg: 12.5, ltcgExemption: 0, holding: 24, holdingLabel: '2 years' },
];
export default function CapitalGainsCalculator() {
  const [assetId, setAssetId] = useState('equity');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [heldMonths, setHeldMonths] = useState('');
  const [slab, setSlab] = useState(30);
  const asset = ASSET_TYPES.find(a => a.id === assetId)!;
  const buy = parseFloat(buyPrice) || 0;
  const sell = parseFloat(sellPrice) || 0;
  const months = parseInt(heldMonths) || 0;
  const profit = Math.max(0, sell - buy);
  const isLT = months >= (asset.holding || 12);
  const fmt = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
  let tax = 0, taxNote = '';
  if (profit > 0 && asset.id !== 'debt') {
    if (!isLT) { tax = profit * (asset.stcg || slab) / 100; taxNote = `STCG @ ${asset.stcg || slab}%`; }
    else { const exempted = Math.min(profit, asset.ltcgExemption || 0); tax = (profit - exempted) * (asset.ltcg || 0) / 100; taxNote = `LTCG @ ${asset.ltcg}% (₹${((asset.ltcgExemption||0)/100000).toFixed(2)}L exempt)`; }
  } else if (asset.id === 'debt' && profit > 0) { tax = profit * slab / 100; taxNote = `Slab rate @ ${slab}%`; }
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ASSET_TYPES.map(a => (<button key={a.id} onClick={() => setAssetId(a.id)} className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${assetId===a.id?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>{a.label}</button>))}
      </div>
      {asset.note && <p className="text-amber-400 text-sm text-center">{asset.note}</p>}
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Buy Price (₹)</label><input type="number" className="tool-input" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} placeholder="100000" /></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Sell Price (₹)</label><input type="number" className="tool-input" value={sellPrice} onChange={e => setSellPrice(e.target.value)} placeholder="150000" /></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Holding Period (months)</label><input type="number" className="tool-input" value={heldMonths} onChange={e => setHeldMonths(e.target.value)} placeholder="13" /></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Your Tax Slab</label>
          <select className="tool-input" value={slab} onChange={e => setSlab(parseInt(e.target.value))}>
            {[0,5,10,15,20,25,30].map(s => <option key={s} value={s}>{s}%</option>)}
          </select>
        </div>
      </div>
      {profit > 0 && (
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 space-y-3">
          <div className="flex justify-between text-sm"><span className="text-slate-400">Type</span><span className={`font-bold ${isLT?'text-emerald-400':'text-amber-400'}`}>{isLT ? `Long-Term (>${asset.holdingLabel||'1 year'})` : `Short-Term (<${asset.holdingLabel||'1 year'})`}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-400">Profit</span><span className="text-slate-200 font-bold">{fmt(profit)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-400">Tax Rule</span><span className="text-slate-300 text-xs">{taxNote}</span></div>
          <div className="flex justify-between border-t border-white/5 pt-3">
            <span className="text-slate-300 font-bold">Tax Payable</span>
            <span className="gradient-text font-extrabold text-2xl">{fmt(tax)}</span>
          </div>
          <div className="flex justify-between text-sm"><span className="text-slate-400">Net Post-Tax Gain</span><span className="text-emerald-400 font-bold">{fmt(profit - tax)}</span></div>
        </div>
      )}
      <p className="text-xs text-slate-600 text-center">As per Budget 2024. For exact tax, consult a CA. No surcharge/cess included.</p>
    </div>
  );
}
