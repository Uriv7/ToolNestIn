'use client';
import { useState } from 'react';
import Link from 'next/link';
import { TOOLS } from '@/app/tools/registry';

export default function Header() {
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filtered = search.length > 1
    ? TOOLS.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.keywords.some(k => k.includes(search.toLowerCase()))
      ).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🪺</span>
          <span className="font-display text-xl font-800 gradient-text tracking-tight">ToolNestIn</span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search tools... (GST, EMI, JSON)"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowResults(true); }}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onFocus={() => setShowResults(true)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-400/50 transition"
            />
          </div>
          {showResults && filtered.length > 0 && (
            <div className="absolute top-full mt-2 w-full glass rounded-xl border border-brand-400/20 overflow-hidden shadow-2xl z-50">
              {filtered.map(tool => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition border-b border-white/5 last:border-0"
                >
                  <span className="text-lg w-8 text-center">{tool.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-600 text-slate-200 truncate">{tool.name}</div>
                    <div className="text-xs text-slate-500 truncate">{tool.description}</div>
                  </div>
                  <span className="cat-pill shrink-0">{tool.category}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Hub nav */}
        <nav className="hidden lg:flex items-center gap-1 shrink-0">
          <a href="/#finance-hub" className="px-3 py-1.5 text-xs text-slate-400 hover:text-brand-400 transition rounded-lg hover:bg-white/5">🏦 Finance</a>
          <a href="/#dev-hub" className="px-3 py-1.5 text-xs text-slate-400 hover:text-brand-400 transition rounded-lg hover:bg-white/5">⚙️ Dev</a>
          <a href="/#text-hub" className="px-3 py-1.5 text-xs text-slate-400 hover:text-brand-400 transition rounded-lg hover:bg-white/5">📝 Text</a>
          <Link href="/blog"  className="px-3 py-1.5 text-xs text-slate-400 hover:text-brand-400 transition rounded-lg hover:bg-white/5">Guides</Link>
          <Link href="/about" className="px-3 py-1.5 text-xs text-slate-400 hover:text-brand-400 transition rounded-lg hover:bg-white/5">About</Link>
        </nav>
      </div>
    </header>
  );
}
