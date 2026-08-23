'use client';
import { useState } from 'react';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est'.split(' ');

function makeSentence() {
  const len = 8 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: len }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function makeParagraph() {
  return Array.from({ length: 4 + Math.floor(Math.random() * 4) }, makeSentence).join(' ');
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let text = '';
    if (type === 'paragraphs') text = Array.from({ length: count }, makeParagraph).join('\n\n');
    else if (type === 'sentences') text = Array.from({ length: count }, makeSentence).join(' ');
    else text = Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join(' ');
    setOutput(text);
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Count</label>
          <input type="number" className="tool-input" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value) || 1))} min="1" max="50" aria-label="Count" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Type</label>
          <div className="flex gap-2">
            {(['paragraphs', 'sentences', 'words'] as const).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition capitalize ${type === t ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={generate} className="btn-primary w-full">Generate Lorem Ipsum</button>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Generated Text</label>
            <button onClick={copy} className="btn-secondary text-xs py-1.5 px-3">{copied ? '✓ Copied!' : '📋 Copy'}</button>
          </div>
          <div className="bg-dark-900/80 border border-white/10 rounded-xl p-4 text-sm text-slate-400 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
