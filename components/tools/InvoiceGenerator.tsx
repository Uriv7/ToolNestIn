'use client';
import { useState } from 'react';
const GST_RATES = [0,5,12,18,28];
type LineItem = { desc: string; qty: string; rate: string; gst: number };
export default function InvoiceGenerator() {
  const [biz, setBiz] = useState({ name:'Your Business Name', gstin:'', address:'', phone:'' });
  const [client, setClient] = useState({ name:'', gstin:'', address:'' });
  const [invNo, setInvNo] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<LineItem[]>([{ desc:'', qty:'1', rate:'', gst:18 }]);
  const addItem = () => setItems(i=>[...i,{desc:'',qty:'1',rate:'',gst:18}]);
  const upd = (i: number, k: keyof LineItem, v: any) => { const n=[...items]; (n[i] as any)[k]=v; setItems(n); };
  const calc = (it: LineItem) => { const q=parseFloat(it.qty)||0; const r=parseFloat(it.rate)||0; const base=q*r; const gst=base*it.gst/100; return { base, gst, total:base+gst }; };
  const totals = items.reduce((a,it)=>{ const c=calc(it); return {base:a.base+c.base,gst:a.gst+c.gst,total:a.total+c.total}; },{base:0,gst:0,total:0});
  const fmt = (n: number) => `₹${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',')}`;
  const print = () => window.print();
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><div className="text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Your Business</div>
          {(['name','gstin','address','phone'] as const).map(k=>(<input key={k} className="tool-input text-sm" value={biz[k]} onChange={e=>setBiz(b=>({...b,[k]:e.target.value}))} placeholder={k==='name'?'Business Name':k==='gstin'?'GSTIN (optional)':k==='address'?'Address':'Phone'} />))}
        </div>
        <div className="space-y-2"><div className="text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Bill To</div>
          {(['name','gstin','address'] as const).map(k=>(<input key={k} className="tool-input text-sm" value={client[k]} onChange={e=>setClient(c=>({...c,[k]:e.target.value}))} placeholder={k==='name'?'Client Name':k==='gstin'?'Client GSTIN (B2B)':'Client Address'} />))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Invoice No</label><input className="tool-input" value={invNo} onChange={e=>setInvNo(e.target.value)} /></div>
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Date</label><input type="date" className="tool-input" value={date} onChange={e=>setDate(e.target.value)} /></div>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-1 text-xs font-600 text-slate-400 uppercase tracking-widest px-1"><span className="col-span-5">Description</span><span className="col-span-2">Qty</span><span className="col-span-2">Rate (₹)</span><span className="col-span-2">GST%</span><span className="col-span-1">Del</span></div>
        {items.map((it,i)=>(<div key={i} className="grid grid-cols-12 gap-1 items-center">
          <input className="tool-input text-sm col-span-5" value={it.desc} onChange={e=>upd(i,'desc',e.target.value)} placeholder="Item / Service" />
          <input type="number" className="tool-input text-sm col-span-2" value={it.qty} onChange={e=>upd(i,'qty',e.target.value)} />
          <input type="number" className="tool-input text-sm col-span-2" value={it.rate} onChange={e=>upd(i,'rate',e.target.value)} placeholder="0" />
          <select className="tool-input text-sm col-span-2" value={it.gst} onChange={e=>upd(i,'gst',parseInt(e.target.value))}>{GST_RATES.map(r=><option key={r} value={r}>{r}%</option>)}</select>
          <button onClick={()=>setItems(it=>it.filter((_,j)=>j!==i))} className="text-red-400 hover:text-red-300 col-span-1 text-center">✕</button>
        </div>))}
        <button onClick={addItem} className="text-sm text-brand-400 hover:text-brand-300">+ Add line item</button>
      </div>
      <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-4 space-y-2 text-sm">
        <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>{fmt(totals.base)}</span></div>
        <div className="flex justify-between text-slate-400"><span>Total GST</span><span>{fmt(totals.gst)}</span></div>
        <div className="flex justify-between font-800 text-slate-200 border-t border-white/10 pt-2"><span>Total Amount</span><span className="gradient-text text-xl">{fmt(totals.total)}</span></div>
      </div>
      <button onClick={print} className="w-full py-2.5 rounded-xl bg-brand-500/20 border border-brand-400/40 text-brand-300 font-700 hover:bg-brand-500/30 transition">🖨️ Print / Save as PDF</button>
      <p className="text-xs text-slate-600 text-center">Use browser Print → Save as PDF to download. All data stays in your browser.</p>
    </div>
  );
}
