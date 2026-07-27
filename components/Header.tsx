'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { TOOLS } from '@/app/tools/registry';

const NAV_LINKS = [
  { href: '/#finance',   label: 'Finance'   },
  { href: '/#developer', label: 'Developer' },
  { href: '/#health',    label: 'Health'    },
  { href: '/#text',      label: 'Text'      },
  { href: '/blog/',      label: 'Guides'    },
];

export default function Header() {
  const [query, setQuery]           = useState('');
  const [open, setOpen]             = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const results = query.length > 1
    ? TOOLS.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.keywords.some(k => k.includes(query.toLowerCase()))
      ).slice(0, 7)
    : [];

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-200"
        style={{
          background: scrolled ? 'rgba(8,12,20,0.97)' : 'rgba(8,12,20,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center gap-5" style={{ height: '60px' }}>

          {/* Logo */}
          <Link href="/" className="shrink-0" aria-label="ToolNestIn home">
            <Logo size={32} showWordmark={false} className="sm:hidden" />
            <Logo size={32} showWordmark={true} className="hidden sm:flex" />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                placeholder="Search 79 tools…"
                value={query}
                onChange={e => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border transition-all outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: open ? '1px solid rgba(12,147,240,0.5)' : '1px solid rgba(255,255,255,0.09)',
                  color: '#f1f5f9',
                  boxShadow: open ? '0 0 0 3px rgba(12,147,240,0.1)' : 'none',
                }}
                aria-label="Search tools"
                aria-autocomplete="list"
                aria-expanded={open && results.length > 0}
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label="Clear search"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown */}
            {open && results.length > 0 && (
              <div
                role="listbox"
                className="absolute top-full mt-2 w-full rounded-xl overflow-hidden z-50"
                style={{ background: '#0d1421', border: '1px solid rgba(12,147,240,0.2)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}
              >
                {results.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}/`}
                    role="option"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition border-b last:border-0"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                  >
                    <span className="text-lg w-7 text-center shrink-0" aria-hidden="true">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-200 truncate">{tool.name.split('—')[0].trim()}</div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">{tool.description.slice(0, 60)}…</div>
                    </div>
                    <span className="cat-pill shrink-0">{tool.category}</span>
                  </Link>
                ))}
              </div>
            )}
            {open && query.length > 1 && results.length === 0 && (
              <div className="absolute top-full mt-2 w-full rounded-xl px-4 py-5 text-center text-sm text-slate-500 z-50"
                style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.07)' }}>
                No tools found for "<span className="text-slate-300">{query}</span>"
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href}
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5 transition font-medium">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden ml-auto p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition"
            onClick={() => setMobileOpen(m => !m)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ background: 'rgba(8,12,20,0.98)', borderColor: 'rgba(255,255,255,0.07)' }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5 transition font-medium">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
