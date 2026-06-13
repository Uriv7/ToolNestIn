'use client';
import { useState } from 'react';
const STATE_MAP: Record<string,string> = {'AP':'Andhra Pradesh','AR':'Arunachal Pradesh','AS':'Assam','BR':'Bihar','CG':'Chhattisgarh','GA':'Goa','GJ':'Gujarat','HR':'Haryana','HP':'Himachal Pradesh','JK':'Jammu & Kashmir','JH':'Jharkhand','KA':'Karnataka','KL':'Kerala','MP':'Madhya Pradesh','MH':'Maharashtra','MN':'Manipur','ML':'Meghalaya','MZ':'Mizoram','NL':'Nagaland','OD':'Odisha','PB':'Punjab','RJ':'Rajasthan','SK':'Sikkim','TN':'Tamil Nadu','TS':'Telangana','TR':'Tripura','UP':'Uttar Pradesh','UK':'Uttarakhand','WB':'West Bengal','AN':'Andaman & Nicobar','CH':'Chandigarh','DL':'Delhi','LD':'Lakshadweep','PY':'Puducherry','DN':'Dadra & NH'};
export default function VehicleRegistrationInfo() {
  const [reg, setReg] = useState('');
  const upper = reg.toUpperCase().replace(/\s/g,'');
  const isBH = upper.startsWith(/^\d{2}BH/.test(upper)?upper.slice(0,2):'XX') && upper.includes('BH');
  const stateCode = upper.slice(0,2);
  const rtoCode = upper.slice(2,4);
  const state = STATE_MAP[stateCode];
  const isValid = state && /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/.test(upper);
  return (
    <div className="space-y-5">
      <div><label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Vehicle Registration Number</label>
        <input className="tool-input font-mono text-xl tracking-widest uppercase" value={reg} onChange={e=>setReg(e.target.value)} placeholder="DL8CAB1234" maxLength={12} />
      </div>
      {upper.length >= 6 && (
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 space-y-3">
          {state ? (<>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/5 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">State</div><div className="text-slate-200 font-700">{state}</div></div>
              <div className="bg-white/5 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">RTO Code</div><div className="text-slate-200 font-700">{stateCode}-{rtoCode}</div></div>
              <div className="bg-white/5 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">Format</div><div className="text-slate-200 font-700">{isBH?'Bharat (BH) Series':'Standard State Plate'}</div></div>
              <div className="bg-white/5 rounded-xl p-3"><div className="text-slate-400 text-xs mb-1">Series</div><div className="text-slate-200 font-700">{upper.slice(4,upper.length-4)||'—'}</div></div>
            </div>
            {isBH && <p className="text-xs text-brand-300 text-center">BH series: Valid pan-India, no re-registration needed when relocating.</p>}
          </>) : <p className="text-slate-400 text-center text-sm">State code "{stateCode}" not recognised. Enter a valid Indian registration number.</p>}
        </div>
      )}
    </div>
  );
}
