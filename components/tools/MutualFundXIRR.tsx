'use client';
import { useState } from 'react';
export default function MutualFundXIRR() {
  const [transactions, setTransactions] = useState([{date:'2021-01-01',amount:-10000},{date:'2022-01-01',amount:-10000},{date:'2024-01-01',amount:25000}]);
  const [result, setResult] = useState<number|null>(null);
  const xirr = () => {
    const flows = transactions.map(t=>({...t,amount:parseFloat(t.amount as any)||0,d:new Date(t.date).getTime()/86400000}));
    if (flows.length < 2) return;
    let rate = 0.1;
    for (let iter = 0; iter < 100; iter++) {
      const base = flows[0].d;
      let npv = 0, dnpv = 0;
      flows.forEach(f => { const t=(f.d-base)/365; const pv=f.amount/Math.pow(1+rate,t); npv+=pv; dnpv+=-t*pv/(1+rate); });
      const delta = npv/dnpv;
      rate -= delta;
      if (Math.abs(delta) < 1e-7) break;
    }
    setResult(Math.round(rate*10000)/100);
  };
  const addRow = () => setTransactions([...transactions,{date:new Date().toISOString().split('T')[0],amount:0}]);
  const update = (i:number,k:string,v:string) => { const t=[...transactions]; (t[i] as any)[k]=k==='amount'?v:v; setTransactions(t); };
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs font-600 text-slate-400 uppercase tracking-widest px-1"><span>Date</span><span>Amount (₹, negative=invest, positive=redeem)</span></div>
        {transactions.map((t,i)=>(<div key={i} className="grid grid-cols-2 gap-2"><input type="date" className="tool-input text-sm" value={t.date} onChange={e=>update(i,'date',e.target.value)} /><input type="number" className="tool-input text-sm" value={t.amount} onChange={e=>update(i,'amount',e.target.value)} placeholder="-10000 or +25000" /></div>))}
      </div>
      <button onClick={addRow} className="text-sm text-brand-400 hover:text-brand-300">+ Add transaction</button>
      <button onClick={xirr} className="w-full py-2.5 rounded-xl bg-brand-500/20 border border-brand-400/40 text-brand-300 font-700 hover:bg-brand-500/30 transition">Calculate XIRR</button>
      {result !== null && (<div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 text-center">
        <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">Your Actual Annualised Return (XIRR)</div>
        <div className={`font-800 text-4xl ${result>0?'gradient-text':'text-red-400'}`}>{result}% p.a.</div>
        <div className="text-xs text-slate-500 mt-2">{result>12?'Excellent returns 🎉':result>8?'Good returns 👍':result>0?'Moderate returns':'Negative returns 📉'}</div>
      </div>)}
      <p className="text-xs text-slate-600 text-center">Use negative amounts for investments/SIP, positive for redemptions/current value.</p>
    </div>
  );
}
