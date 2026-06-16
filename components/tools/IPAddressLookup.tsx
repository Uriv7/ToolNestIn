'use client';
import { useState, useEffect } from 'react';
export default function IPAddressLookup() {
  const [ip, setIp] = useState('');
  const [myIP, setMyIP] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { fetch('https://api.ipify.org?format=json').then(r=>r.json()).then(d=>setMyIP(d.ip)).catch(()=>{}); }, []);
  const lookup = async (target: string) => {
    if (!target) return; setLoading(true); setError(''); setResult(null);
    try {
      const r = await fetch(`https://ipapi.co/${target}/json/`);
      const d = await r.json();
      if (d.error) { setError(d.reason || 'Lookup failed'); } else { setResult(d); }
    } catch { setError('Lookup failed — check network'); }
    setLoading(false);
  };
  const fields = result ? [['IP','ip'],['Country','country_name'],['Region','region'],['City','city'],['ISP/Org','org'],['Timezone','timezone'],['Latitude','latitude'],['Longitude','longitude']] : [];
  return (
    <div className="space-y-4">
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Enter IP Address (or leave blank to look up yours)</label>
        <div className="flex gap-2"><input className="tool-input flex-1" value={ip} onChange={e=>setIp(e.target.value)} placeholder="e.g. 8.8.8.8" /><button onClick={()=>lookup(ip||myIP)} className="px-4 py-2 rounded-xl bg-brand-500/20 border border-brand-400/40 text-brand-300 font-bold whitespace-nowrap">Look Up</button></div>
      </div>
      {myIP && <div className="flex gap-2 items-center text-sm text-slate-400">Your IP: <span className="text-slate-200 font-bold">{myIP}</span><button onClick={()=>lookup(myIP)} className="text-brand-400 text-xs hover:underline">Look up mine</button></div>}
      {loading && <div className="text-slate-400 text-center py-4">Looking up...</div>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {result && (<div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 space-y-2">
        {fields.map(([l,k])=>result[k]&&(<div key={k} className="flex justify-between text-sm border-b border-white/5 py-2"><span className="text-slate-400">{l}</span><span className="text-slate-200 font-bold">{result[k]}</span></div>))}
      </div>)}
    </div>
  );
}
