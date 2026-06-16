'use client';
import { useState } from 'react';
const EMOJIS: Record<string, string[]> = {
  'Smileys': ['😀','😂','🥹','😍','🤩','😎','🥳','😭','😱','🤔','🙄','😴','🤮','🥺','😡','🤯','🫠','😇','🥰','😘'],
  'People': ['👋','🤝','👍','👎','❤️','🙏','💪','🫶','🤜','✌️','🖐️','👏','🫡','🤦','🤷','💃','🕺','👶','🧒','👧'],
  'Animals': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐸','🐵','🦄','🐝','🦋','🐬','🦅','🐘'],
  'Food': ['🍕','🍔','🍟','🌮','🌯','🍜','🍱','🍣','🍦','🎂','☕','🍵','🧋','🍺','🥂','🍷','🥤','🧃','🍇','🍓'],
  'Travel': ['✈️','🚀','🚂','🚗','🏍️','⛵','🏖️','🏔️','🗼','🏛️','🗺️','🧳','🎒','🏕️','🌍','🌏','🌐','🗽','🏰','🎡'],
  'Objects': ['💻','📱','⌨️','🖥️','📷','🎵','🎮','📚','✏️','🔑','💡','🔔','📢','🎁','🏆','⚽','🎯','🎸','🔭','🔬'],
  'Symbols': ['❤️','💛','💚','💙','💜','🖤','🤍','💯','✅','❌','⚠️','🔥','⭐','💫','✨','💥','🎉','🎊','🏳️','🏴'],
  'Flags': ['🇮🇳','🇺🇸','🇬🇧','🇦🇺','🇨🇦','🇩🇪','🇫🇷','🇯🇵','🇨🇳','🇧🇷','🇸🇬','🇦🇪','🇿🇦','🇰🇷','🇷🇺','🇮🇹','🇪🇸','🇳🇱','🇸🇪','🇨🇭'],
};
export default function EmojiPicker() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Smileys');
  const [copied, setCopied] = useState('');
  const copy = (e: string) => { navigator.clipboard.writeText(e); setCopied(e); setTimeout(()=>setCopied(''),1500); };
  const allEmojis = Object.values(EMOJIS).flat();
  const filtered = q ? allEmojis.filter((_,i)=>allEmojis[i]) : EMOJIS[cat]||[];
  return (
    <div className="space-y-4">
      <input className="tool-input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search emoji..." />
      {!q && (<div className="flex gap-2 flex-wrap">{Object.keys(EMOJIS).map(c=>(<button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${cat===c?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{c}</button>))}</div>)}
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
        {(q ? allEmojis : filtered).map((e,i)=>(<button key={i} onClick={()=>copy(e)} title={`Click to copy ${e}`} className={`text-2xl p-2 rounded-lg hover:bg-white/10 transition text-center ${copied===e?'bg-brand-500/30':''}`}>{e}</button>))}
      </div>
      {copied && <p className="text-center text-brand-300 text-sm">Copied {copied}!</p>}
    </div>
  );
}
