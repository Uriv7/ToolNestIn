'use client';
import { useState, useEffect } from 'react';
const CURRENCIES = ['USD','EUR','GBP','AED','SGD','JPY','CAD','AUD','CHF','CNY','SAR','KWD','QAR','MYR','THB','ZAR','NZD','SEK','NOK','DKK'];
export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string,number>>({});
  const [from, setFrom] = useState('INR');
  const [to, setTo] = useState('USD');
  const [amount, setAmount] = useState('1000');
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState('');
  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/INR').then(r=>r.json()).then(d=>{ setRates(d.rates); setUpdated(new Date().toLocaleTimeString('en-IN')); setLoading(false); }).catch(()=>{ setRates({USD:0.012,EUR:0.011,GBP:0.0095,AED:0.044,SGD:0.016,JPY:1.8}); setLoading(false); });
  },[]);
  const convert = () => {
    const a = parseFloat(amount)||0;
    if (!rates[from] || !rates[to]) return 0;
    const inINR = from==='INR' ? a : a/rates[from];
    return to==='INR' ? inINR : inINR*rates[to];
  };
  const result = convert();
  const all = ['INR', ...CURRENCIES];
  return (
    <div className="space-y-5">
      {loading && <p className="text-slate-400 text-sm text-center">Fetching live rates...</p>}
      <div className="grid grid-cols-3 gap-3 items-end">
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">From</label><select className="tool-input" value={from} onChange={e=>setFrom(e.target.value)}>{all.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Amount</label><input type="number" className="tool-input" value={amount} onChange={e => setAmount(e.target.value)} aria-label="Amount" /></div>
        <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">To</label><select className="tool-input" value={to} onChange={e=>setTo(e.target.value)}>{all.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
      </div>
      {result > 0 && (<div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 text-center space-y-2">
        <div className="text-slate-400 text-sm">{parseFloat(amount).toLocaleString('en-IN')} {from} =</div>
        <div className="gradient-text font-extrabold text-4xl">{result.toLocaleString('en-IN',{maximumFractionDigits:4})} {to}</div>
        <div className="text-slate-500 text-xs">1 {from} = {(result/parseFloat(amount)).toFixed(6)} {to} · Rate updated {updated||'recently'}</div>
      </div>)}
      <div className="grid grid-cols-4 gap-2">{['USD','EUR','GBP','AED'].map(c=>rates[c]&&(<div key={c} className="bg-white/3 border border-white/10 rounded-xl p-3 text-center"><div className="text-xs text-slate-400">{c}</div><div className="text-slate-200 font-bold text-sm">{(rates[c]).toFixed(4)}</div></div>))}</div>
    </div>
  );
}
