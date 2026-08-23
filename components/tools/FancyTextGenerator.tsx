'use client';
import { useState } from 'react';

const STYLES: { name: string; fn: (s: string) => string }[] = [
  { name: '𝗕𝗼𝗹𝗱', fn: s => s.replace(/[a-zA-Z]/g, c => String.fromCodePoint((c >= 'a' ? 0x1D41A : 0x1D400) + c.charCodeAt(0) - (c >= 'a' ? 97 : 65))) },
  { name: '𝘐𝘵𝘢𝘭𝘪𝘤', fn: s => s.replace(/[a-zA-Z]/g, c => String.fromCodePoint((c >= 'a' ? 0x1D44E : 0x1D434) + c.charCodeAt(0) - (c >= 'a' ? 97 : 65))) },
  { name: '𝙼𝚘𝚗𝚘', fn: s => s.replace(/[a-zA-Z0-9]/g, c => { const code = c.charCodeAt(0); if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + code - 48); if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + code - 65); return String.fromCodePoint(0x1D68A + code - 97); }) },
  { name: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯', fn: s => s.replace(/[a-zA-Z]/g, c => { const map: Record<string, string> = {'a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧','k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱','u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷','A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'ℌ','I':'ℑ','J':'𝔍','K':'𝔎','L':'𝔏','M':'𝔐','N':'𝔑','O':'𝔒','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'ℨ'}; return map[c] || c; }) },
  { name: '𝒞𝓊𝓇𝓈𝒾𝓋𝑒', fn: s => s.replace(/[a-zA-Z]/g, c => { const map: Record<string, string> = {'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'𝑒','f':'𝒻','g':'𝑔','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝓃','o':'𝑜','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏','A':'𝒜','B':'𝐵','C':'𝒞','D':'𝒟','E':'𝐸','F':'𝐹','G':'𝒢','H':'𝐻','I':'𝐼','J':'𝒥','K':'𝒦','L':'𝐿','M':'𝑀','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'𝑅','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵'}; return map[c] || c; }) },
  { name: 'Ⓒⓘⓡⓒⓛⓔⓓ', fn: s => s.replace(/[a-zA-Z0-9]/g, c => { const code = c.charCodeAt(0); if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97); if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65); if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49); return '⓪'; }) },
  { name: 'S̶t̶r̶i̶k̶e̶', fn: s => s.split('').map(c => c + '\u0336').join('') },
  { name: 'U̲n̲d̲e̲r̲', fn: s => s.split('').map(c => c + '\u0332').join('') },
  { name: 'ＷＩＤＥ', fn: s => s.replace(/[a-zA-Z0-9 ]/g, c => { const code = c.charCodeAt(0); if (code >= 33 && code <= 126) return String.fromCodePoint(code + 0xFF01 - 33); return c; }) },
  { name: 'sMaLl CaPs', fn: s => { const sc: Record<string, string> = {'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','q':'q','r':'ʀ','s':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ'}; return s.toLowerCase().replace(/[a-z]/g, c => sc[c] || c); } },
  { name: '🅱🅻🅾🅲🅺', fn: s => s.replace(/[a-zA-Z0-9]/g, c => { const map: Record<string, string> = {'A':'🅰','B':'🅱','C':'🅲','D':'🅳','E':'🅴','F':'🅵','G':'🅶','H':'🅷','I':'🅸','J':'🅹','K':'🅺','L':'🅻','M':'🅼','N':'🅽','O':'🅾','P':'🅿','Q':'🆀','R':'🆁','S':'🆂','T':'🆃','U':'🆄','V':'🆅','W':'🆆','X':'🆇','Y':'🆈','Z':'🆉'}; return map[c.toUpperCase()] || c; }) },
  { name: '🔠 Box', fn: s => s.replace(/[a-zA-Z]/g, c => { const map: Record<string,string>={'A':'🄰','B':'🄱','C':'🄲','D':'🄳','E':'🄴','F':'🄵','G':'🄶','H':'🄷','I':'🄸','J':'🄹','K':'🄺','L':'🄻','M':'🄼','N':'🄽','O':'🄾','P':'🄿','Q':'🅀','R':'🅁','S':'🅂','T':'🅃','U':'🅄','V':'🅅','W':'🅆','X':'🅇','Y':'🅈','Z':'🅉'}; return map[c.toUpperCase()] || c; }) },
];

export default function FancyTextGenerator() {
  const [input, setInput] = useState('ToolNestIn');
  const [copied, setCopied] = useState('');

  const copy = (name: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(name); setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Your Text</label>
        <input type="text" className="tool-input text-lg font-bold" value={input}
          onChange={e => setInput(e.target.value)} placeholder="Type your text here..." maxLength={100}  aria-label="Your Text"/>
      </div>

      <div className="space-y-2">
        {STYLES.map(style => {
          const converted = input ? style.fn(input) : '';
          return (
            <div key={style.name} className="flex items-center gap-3 px-4 py-3 bg-white/3 border border-white/8 rounded-xl hover:border-brand-400/20 transition group">
              <span className="text-xs text-slate-600 w-24 shrink-0">{style.name}</span>
              <span className="flex-1 text-slate-200 text-lg leading-snug break-all">{converted}</span>
              <button onClick={() => copy(style.name, converted)}
                className="btn-secondary text-xs py-1.5 px-3 shrink-0 opacity-0 group-hover:opacity-100 transition">
                {copied === style.name ? '✓' : '📋'}
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-600 text-center">These Unicode characters work on Instagram, Twitter/X, WhatsApp, LinkedIn and most social platforms.</p>
    </div>
  );
}
