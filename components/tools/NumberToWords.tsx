'use client';
import { useState } from 'react';

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function toWords(n: number): string {
  if (n === 0) return 'Zero';
  if (n < 0) return 'Minus ' + toWords(-n);
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + toWords(n % 100) : '');
  if (n < 100000) return toWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
  if (n < 10000000) return toWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + toWords(n % 100000) : '');
  return toWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + toWords(n % 10000000) : '');
}

export default function NumberToWords() {
  const [input, setInput] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'plain'>('INR');
  const [copied, setCopied] = useState(false);

  const num = parseFloat(input);
  const isValid = input !== '' && !isNaN(num) && num >= 0 && num < 100000000000;

  const getResult = () => {
    if (!isValid) return '';
    const n = Math.floor(num);
    const dec = Math.round((num - n) * 100);
    let text = toWords(n);
    if (currency === 'INR') text = 'Rupees ' + text + (dec > 0 ? ' and ' + toWords(dec) + ' Paise' : '') + ' Only';
    else if (currency === 'USD') text = text + (dec > 0 ? ' Dollars and ' + toWords(dec) + ' Cents' : ' Dollars') + ' Only';
    return text;
  };

  const result = getResult();
  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Enter Number</label>
        <input type="number" className="tool-input text-xl font-bold" value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. 125000" min="0" />
      </div>

      <div className="flex gap-2">
        {(['INR', 'USD', 'plain'] as const).map(c => (
          <button key={c} onClick={() => setCurrency(c)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${currency === c ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {c === 'INR' ? '₹ Rupees' : c === 'USD' ? '$ Dollars' : '🔢 Plain'}
          </button>
        ))}
      </div>

      {result && (
        <div className="bg-brand-500/10 border border-brand-400/30 rounded-2xl p-5">
          <div className="font-sans text-xl font-bold text-slate-100 leading-relaxed mb-4">{result}</div>
          <button onClick={copy} className="btn-secondary text-sm">{copied ? '✓ Copied!' : '📋 Copy'}</button>
        </div>
      )}

      {input && !isValid && (
        <p className="text-rose-400 text-sm">Please enter a valid number between 0 and 99,999,999,999</p>
      )}
    </div>
  );
}
