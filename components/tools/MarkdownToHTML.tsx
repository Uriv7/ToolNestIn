'use client';
import { useState } from 'react';
export default function MarkdownToHTML() {
  const [md, setMd] = useState('# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item one\n- Item two\n\n```js\nconsole.log("hello");\n```');
  const toHTML = (text: string) => {
    return text
      .replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/~~(.+?)~~/g,'<del>$1</del>')
      .replace(/`{3}[\w]*\n?([\s\S]*?)`{3}/g,'<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>')
      .replace(/^- (.+)$/gm,'<li>$1</li>').replace(/(<li>.*<\/li>)/s,'<ul>$1</ul>')
      .replace(/\n\n/g,'</p><p>').replace(/^(?!<[hul]|<pre)(.+)$/gm,'$1');
  };
  const html = toHTML(md);
  const [tab, setTab] = useState<'edit'|'preview'|'html'>('edit');
  return (
    <div className="space-y-4">
      <div className="flex gap-2">{(['edit','preview','html'] as const).map(t=>(<button key={t} onClick={()=>setTab(t)} className={`flex-1 py-2 rounded-xl text-sm font-600 border transition ${tab===t?'bg-brand-500/20 border-brand-400/50 text-brand-300':'bg-white/3 border-white/10 text-slate-500'}`}>{t==='edit'?'✏️ Markdown':t==='preview'?'👁 Preview':'<> HTML'}</button>))}</div>
      {tab==='edit' && <textarea className="tool-input h-64 font-mono text-sm" value={md} onChange={e=>setMd(e.target.value)} />}
      {tab==='preview' && <div className="tool-input h-64 overflow-auto prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{__html:html}} />}
      {tab==='html' && <textarea readOnly className="tool-input h-64 font-mono text-xs" value={html} />}
    </div>
  );
}
