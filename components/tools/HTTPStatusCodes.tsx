'use client';
import { useState } from 'react';
const CODES = [
  {c:200,l:'OK',d:'Request succeeded.',cat:'2xx'},{c:201,l:'Created',d:'Resource created (POST/PUT).',cat:'2xx'},{c:204,l:'No Content',d:'Success, no body returned.',cat:'2xx'},
  {c:301,l:'Moved Permanently',d:'URL permanently changed. Google updates index.',cat:'3xx'},{c:302,l:'Found',d:'Temporary redirect. SEO juice stays at original.',cat:'3xx'},{c:304,l:'Not Modified',d:'Cache is still valid.',cat:'3xx'},
  {c:400,l:'Bad Request',d:'Malformed request syntax or invalid parameters.',cat:'4xx'},{c:401,l:'Unauthorized',d:'Authentication required.',cat:'4xx'},{c:403,l:'Forbidden',d:'Authenticated but not allowed.',cat:'4xx'},
  {c:404,l:'Not Found',d:'Resource does not exist.',cat:'4xx'},{c:405,l:'Method Not Allowed',d:'HTTP method not supported for this route.',cat:'4xx'},{c:408,l:'Request Timeout',d:'Server gave up waiting.',cat:'4xx'},
  {c:409,l:'Conflict',d:'Resource conflict — duplicate or version mismatch.',cat:'4xx'},{c:410,l:'Gone',d:'Resource permanently deleted. Better than 404 for SEO.',cat:'4xx'},{c:422,l:'Unprocessable Entity',d:'Validation failed.',cat:'4xx'},
  {c:429,l:'Too Many Requests',d:'Rate limit exceeded.',cat:'4xx'},{c:500,l:'Internal Server Error',d:'Unexpected server crash.',cat:'5xx'},{c:502,l:'Bad Gateway',d:'Upstream server sent invalid response.',cat:'5xx'},
  {c:503,l:'Service Unavailable',d:'Server down or overloaded.',cat:'5xx'},{c:504,l:'Gateway Timeout',d:'Upstream server timed out.',cat:'5xx'},
];
const CAT_COLORS: Record<string,string> = {'2xx':'text-emerald-400','3xx':'text-blue-400','4xx':'text-amber-400','5xx':'text-red-400'};
export default function HTTPStatusCodes() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const filtered = CODES.filter(c=>(filter==='all'||c.cat===filter)&&(q===''||String(c.c).includes(q)||c.l.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['all','2xx','3xx','4xx','5xx'].map(f=>(<button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-700 border transition ${filter===f?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{f}</button>))}
        <input className="tool-input flex-1 py-1.5 text-sm" placeholder="Search code or name..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filtered.map(c=>(<div key={c.c} className="flex gap-3 bg-white/3 border border-white/10 rounded-xl p-3 hover:border-white/20 transition">
          <span className={`font-800 text-lg font-mono w-12 flex-shrink-0 ${CAT_COLORS[c.cat]}`}>{c.c}</span>
          <div><div className="text-slate-200 font-600 text-sm">{c.l}</div><div className="text-slate-400 text-xs mt-0.5">{c.d}</div></div>
        </div>))}
      </div>
    </div>
  );
}
