'use client';
import { useState } from 'react';

export default function HTMLFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [copied, setCopied] = useState(false);

  const format = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'minify') {
        const minified = input
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/\s+/g, ' ')
          .replace(/>\s+</g, '><')
          .trim();
        setOutput(minified);
        return;
      }

      let depth = 0;
      const indent = '  ';
      const voidElements = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
      const result: string[] = [];
      const tokens = input.match(/<[^>]+>|[^<]+/g) || [];

      tokens.forEach(token => {
        const trimmed = token.trim();
        if (!trimmed) return;
        if (trimmed.startsWith('</')) {
          depth = Math.max(0, depth - 1);
          result.push(indent.repeat(depth) + trimmed);
        } else if (trimmed.startsWith('<') && !trimmed.startsWith('<!') && !trimmed.startsWith('<?')) {
          const tagName = (trimmed.match(/<([a-zA-Z][a-zA-Z0-9-]*)/) || [])[1]?.toLowerCase() || '';
          result.push(indent.repeat(depth) + trimmed);
          if (!voidElements.has(tagName) && !trimmed.endsWith('/>')) depth++;
        } else {
          if (trimmed) result.push(indent.repeat(depth) + trimmed);
        }
      });
      setOutput(result.join('\n'));
    } catch {
      setOutput('Error formatting HTML');
    }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const SAMPLE = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Page</title></head><body><div class="container"><h1>Hello World</h1><p>This is a paragraph with <strong>bold</strong> text.</p><ul><li>Item 1</li><li>Item 2</li></ul></div></body></html>`;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <div className="flex gap-2">
          {(['format', 'minify'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-2.5 rounded-xl text-sm font-600 border capitalize transition ${mode === m ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
              {m === 'format' ? '✨ Beautify' : '⚡ Minify'}
            </button>
          ))}
        </div>
        <button onClick={() => setInput(SAMPLE)} className="text-xs text-brand-400 hover:underline ml-auto">Load sample</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">HTML Input</label>
          <textarea className="tool-input resize-none font-mono text-xs" rows={16}
            value={input} onChange={e => setInput(e.target.value)} placeholder="Paste your HTML here..." />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-600 text-slate-400 uppercase tracking-widest">Output</label>
            {output && <button onClick={copy} className="btn-secondary text-xs py-1.5 px-3">{copied ? '✓ Copied!' : '📋 Copy'}</button>}
          </div>
          <textarea className="tool-input resize-none font-mono text-xs bg-dark-900/80" rows={16} value={output} readOnly />
        </div>
      </div>

      <button onClick={format} disabled={!input.trim()} className="btn-primary w-full disabled:opacity-50">
        {mode === 'format' ? '✨ Beautify HTML' : '⚡ Minify HTML'}
      </button>
    </div>
  );
}
