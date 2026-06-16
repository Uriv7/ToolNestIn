'use client';
import { useState, useMemo } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const readTime = Math.ceil(words / 200);
    return { words, chars, charsNoSpace, sentences, paragraphs, readTime };
  }, [text]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Paste or type your text</label>
        <textarea
          className="tool-input resize-none"
          rows={10}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { l: 'Words', v: stats.words.toLocaleString() },
          { l: 'Characters', v: stats.chars.toLocaleString() },
          { l: 'Chars (no spaces)', v: stats.charsNoSpace.toLocaleString() },
          { l: 'Sentences', v: stats.sentences.toLocaleString() },
          { l: 'Paragraphs', v: stats.paragraphs.toLocaleString() },
          { l: 'Read Time', v: `~${stats.readTime} min` },
        ].map(s => (
          <div key={s.l} className="glass rounded-xl p-4 text-center">
            <div className="font-sans text-2xl font-extrabold gradient-text">{s.v}</div>
            <div className="text-xs text-slate-500 mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {text && (
        <button onClick={() => setText('')} className="btn-secondary text-sm py-2">Clear Text</button>
      )}
    </div>
  );
}
