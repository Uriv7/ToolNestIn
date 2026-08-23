'use client';
import { useState } from 'react';
const STATE_CODES: Record<string,string> = {'01':'Jammu & Kashmir','02':'Himachal Pradesh','03':'Punjab','04':'Chandigarh','06':'Haryana','07':'Delhi','08':'Rajasthan','09':'Uttar Pradesh','10':'Bihar','11':'Sikkim','12':'Arunachal Pradesh','13':'Nagaland','14':'Manipur','15':'Mizoram','16':'Tripura','17':'Meghalaya','18':'Assam','19':'West Bengal','20':'Jharkhand','21':'Odisha','22':'Chhattisgarh','23':'Madhya Pradesh','24':'Gujarat','26':'Dadra & Nagar Haveli & Daman & Diu','27':'Maharashtra','28':'Andhra Pradesh (Old)','29':'Karnataka','30':'Goa','31':'Lakshadweep','32':'Kerala','33':'Tamil Nadu','34':'Puducherry','35':'Andaman & Nicobar','36':'Telangana','37':'Andhra Pradesh'};
const ENTITY: Record<string,string> = {'1':'Individual/Proprietor (1st)','2':'Individual/Proprietor (2nd)','3':'Individual/Proprietor (3rd)','4':'Individual/Proprietor (4th)','5':'Individual/Proprietor (5th)','A':'AOP/BOI','B':'BOI','C':'Company','F':'Firm/LLP','G':'Government','H':'HUF','J':'AJP','L':'Local Authority','P':'Individual (Personal)','T':'AOP/Trust'};
export default function GSTNumberValidator() {
  const [gstin, setGstin] = useState('');
  const g = gstin.toUpperCase().trim();
  const isValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(g);
  const stateCode = g.slice(0,2);
  const pan = g.slice(2,12);
  const entity = g[12];
  const state = STATE_CODES[stateCode];
  const entityType = ENTITY[entity];
  return (
    <div className="space-y-5">
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Enter GSTIN</label>
        <input className="tool-input font-mono text-lg tracking-widest uppercase" value={gstin} onChange={e => setGstin(e.target.value)} aria-label="Enter GSTIN" placeholder="27AAPFU0939F1ZV" maxLength={15} />
      </div>
      {g.length===15 && (
        <div className={`rounded-2xl border p-5 space-y-3 ${isValid?'bg-gradient-to-br from-brand-950/60 to-dark-800 border-brand-400/20':'bg-red-500/10 border-red-400/30'}`}>
          <div className={`text-center font-extrabold text-lg ${isValid?'text-emerald-400':'text-red-400'}`}>{isValid?'✅ Valid GSTIN Format':'❌ Invalid GSTIN Format'}</div>
          {isValid && (<>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['State Code',stateCode],['State',state||'Unknown'],['Embedded PAN',pan],['Entity Type',entityType||entity]].map(([l,v])=>(<div key={l} className="bg-white/5 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">{l}</div><div className="text-slate-200 font-bold">{v}</div></div>))}
            </div>
            <p className="text-xs text-slate-500 text-center">Format valid. Does not confirm active GST registration — verify on GST portal.</p>
          </>)}
        </div>
      )}
    </div>
  );
}
