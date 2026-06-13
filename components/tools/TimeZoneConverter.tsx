'use client';
import { useState, useEffect } from 'react';
const ZONES = [
  {id:'Asia/Kolkata',l:'IST — India'},{id:'America/New_York',l:'EST — New York'},{id:'America/Los_Angeles',l:'PST — Los Angeles'},
  {id:'Europe/London',l:'GMT — London'},{id:'Asia/Dubai',l:'UAE — Dubai'},{id:'Asia/Singapore',l:'SGT — Singapore'},
  {id:'Australia/Sydney',l:'AEST — Sydney'},{id:'Asia/Tokyo',l:'JST — Tokyo'},{id:'Europe/Berlin',l:'CET — Berlin'},
  {id:'America/Chicago',l:'CST — Chicago'},
];
export default function TimeZoneConverter() {
  const [from, setFrom] = useState('Asia/Kolkata');
  const [to, setTo] = useState('America/New_York');
  const [dateTime, setDateTime] = useState('');
  const [now, setNow] = useState(new Date());
  useEffect(() => { setInterval(()=>setNow(new Date()),1000); setDateTime(new Date().toISOString().slice(0,16)); },[]);
  const convert = () => {
    if (!dateTime) return '';
    try { const d = new Date(dateTime); return d.toLocaleString('en-IN',{timeZone:to,hour12:true,dateStyle:'medium',timeStyle:'short'}); } catch { return ''; }
  };
  const converted = convert();
  return (
    <div className="space-y-5">
      <div className="bg-brand-500/10 border border-brand-400/20 rounded-xl p-3 text-center text-sm text-slate-300">
        🕐 Current IST: <strong className="text-brand-300">{now.toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata',hour12:true})}</strong>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">From</label><select className="tool-input" value={from} onChange={e=>setFrom(e.target.value)}>{ZONES.map(z=>(<option key={z.id} value={z.id}>{z.l}</option>))}</select></div>
        <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">To</label><select className="tool-input" value={to} onChange={e=>setTo(e.target.value)}>{ZONES.map(z=>(<option key={z.id} value={z.id}>{z.l}</option>))}</select></div>
      </div>
      <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Date & Time</label><input type="datetime-local" className="tool-input" value={dateTime} onChange={e=>setDateTime(e.target.value)} /></div>
      {converted && (<div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 text-center space-y-2">
        <div className="text-slate-400 text-sm">{from.split('/')[1].replace('_',' ')}</div>
        <div className="gradient-text font-800 text-3xl">{converted}</div>
        <div className="text-slate-400 text-sm">{to.split('/')[1].replace('_',' ')}</div>
      </div>)}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {ZONES.slice(0,6).map(z=>(<div key={z.id} className="bg-white/3 border border-white/10 rounded-xl px-3 py-2 flex justify-between"><span className="text-slate-400">{z.l.split('—')[0]}</span><span className="text-slate-200 font-600">{now.toLocaleTimeString('en-IN',{timeZone:z.id,hour:'2-digit',minute:'2-digit',hour12:true})}</span></div>))}
      </div>
    </div>
  );
}
