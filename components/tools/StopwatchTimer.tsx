'use client';
import { useState, useRef, useEffect } from 'react';
export default function StopwatchTimer() {
  const [mode, setMode] = useState<'stopwatch'|'countdown'>('stopwatch');
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const [cdMin, setCdMin] = useState('25');
  const [cdSec, setCdSec] = useState('0');
  const [cdMs, setCdMs] = useState((parseInt('25')||0)*60000);
  const ref = useRef<NodeJS.Timeout|null>(null);
  const lastRef = useRef(0);
  const start = () => { lastRef.current = Date.now()-ms; setRunning(true); };
  const stop = () => { setRunning(false); if (ref.current) clearInterval(ref.current); };
  const reset = () => { stop(); setMs(0); setLaps([]); if (mode==='countdown') setCdMs((parseInt(cdMin)||0)*60000+(parseInt(cdSec)||0)*1000); };
  useEffect(() => {
    if (running) { ref.current = setInterval(()=>{ if (mode==='stopwatch') setMs(Date.now()-lastRef.current); else setCdMs(p=>{ if (p<=100){stop();return 0;} return p-100; }); },100); }
    return ()=>{ if (ref.current) clearInterval(ref.current); };
  },[running,mode]);
  const fmt = (t: number) => { const m=Math.floor(t/60000); const s=Math.floor((t%60000)/1000); const cs=Math.floor((t%1000)/10); return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`; };
  const PRESETS = [{l:'Pomodoro 25m',m:'25',s:'0'},{l:'Break 5m',m:'5',s:'0'},{l:'Egg timer 3m',m:'3',s:'0'}];
  return (
    <div className="space-y-5">
      <div className="flex gap-2">{(['stopwatch','countdown'] as const).map(m=>(<button key={m} onClick={()=>{reset();setMode(m);}} className={`flex-1 py-2.5 rounded-xl text-sm font-600 border transition ${mode===m?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{m==='stopwatch'?'⏱ Stopwatch':'⏳ Countdown'}</button>))}</div>
      {mode==='countdown' && !running && (<div className="space-y-3"><div className="flex gap-2 flex-wrap">{PRESETS.map(p=>(<button key={p.l} onClick={()=>{setCdMin(p.m);setCdSec(p.s);setCdMs((parseInt(p.m)||0)*60000+(parseInt(p.s)||0)*1000);}} className="px-3 py-1.5 rounded-lg text-xs font-600 bg-white/3 border border-white/10 text-slate-400 hover:text-slate-200 transition">{p.l}</button>))}</div><div className="grid grid-cols-2 gap-3"><div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Minutes</label><input type="number" className="tool-input" value={cdMin} onChange={e=>{setCdMin(e.target.value);setCdMs((parseInt(e.target.value)||0)*60000+(parseInt(cdSec)||0)*1000);}} /></div><div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Seconds</label><input type="number" className="tool-input" value={cdSec} onChange={e=>{setCdSec(e.target.value);setCdMs((parseInt(cdMin)||0)*60000+(parseInt(e.target.value)||0)*1000);}} /></div></div></div>)}
      <div className="text-center"><div className={`font-mono font-800 text-6xl tracking-wider ${mode==='countdown'&&cdMs<10000?'text-red-400 animate-pulse':'gradient-text'}`}>{mode==='stopwatch'?fmt(ms):fmt(cdMs)}</div></div>
      <div className="flex gap-2 justify-center">
        {!running?<button onClick={start} className="px-8 py-3 rounded-xl bg-brand-500/20 border border-brand-400/40 text-brand-300 font-700">▶ Start</button>:<button onClick={stop} className="px-8 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 font-700">⏸ Pause</button>}
        <button onClick={reset} className="px-6 py-3 rounded-xl bg-white/3 border border-white/10 text-slate-400 font-700">↺ Reset</button>
        {mode==='stopwatch'&&running&&<button onClick={()=>setLaps(l=>[...l,ms])} className="px-6 py-3 rounded-xl bg-white/3 border border-white/10 text-slate-400 font-700">🏁 Lap</button>}
      </div>
      {laps.length>0&&(<div className="space-y-1 max-h-40 overflow-y-auto">{laps.map((l,i)=>(<div key={i} className="flex justify-between text-sm px-3 py-1.5 bg-white/3 rounded-lg"><span className="text-slate-400">Lap {i+1}</span><span className="text-slate-200 font-mono">{fmt(l)}{i>0&&<span className="text-slate-500 ml-2">(+{fmt(l-laps[i-1])})</span>}</span></div>))}</div>)}
    </div>
  );
}
