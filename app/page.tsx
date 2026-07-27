import Link from 'next/link';
import type { Metadata } from 'next';
import { TOOLS, HUB_CONFIG, getToolsByHub } from './tools/registry';
import AdUnit from '@/components/AdUnit';

export const metadata: Metadata = {
  title: 'ToolNestIn — Free Online Tools for India: GST, EMI, Income Tax Calculator 2026',
  description: 'Free Indian online tools: GST Calculator, Income Tax Calculator 2026, EMI Calculator, SIP Calculator, HRA Calculator, NPS Calculator, IFSC Finder. No signup. Instant. 100% free.',
  alternates: { canonical: 'https://toolnestin.co.in' },
  keywords: ['free online tools india 2026','income tax calculator india 2026','gst calculator india','emi calculator india','sip calculator india','hra calculator india','nps calculator 2026','ifsc finder','gratuity calculator india'],
};

const FEATURED = ['gst-calculator','income-tax-calculator','emi-calculator','hra-calculator','sip-calculator','ifsc-finder','nps-calculator','ctc-calculator'];

const WHY = [
  { icon: '⚡', title: 'Instant results',    body: 'Every tool calculates as you type. Zero waiting, zero loading spinners.' },
  { icon: '🔒', title: 'Completely private', body: 'All processing runs in your browser. Nothing is ever sent to a server.' },
  { icon: '🆓', title: 'Always free',        body: 'No login, no trial, no paywall. Every tool, every result, completely free.' },
  { icon: '🇮🇳', title: 'Built for India',   body: 'Correct GST slabs, Old vs New Tax Regime, IFSC, PAN — India-first by design.' },
];

export default function HomePage() {
  return (
    <div className="hero-bg">

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8 uppercase tracking-wider"
          style={{ background: 'rgba(12,147,240,0.08)', border: '1px solid rgba(12,147,240,0.2)', color: '#36b0fb' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block animate-pulse" aria-hidden="true" />
          {TOOLS.length}+ Free Tools · Built for India · No Signup Required
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
          <span className="gradient-text">Free tools</span>
          <br />
          <span style={{ color: '#f1f5f9' }}>built for India</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          GST Calculator, Income Tax 2026, EMI Calculator, HRA, SIP, IFSC Finder and {TOOLS.length - 5}+ more.
          No account. No ads between you and the result. Just tools that work.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <a href="#finance" className="btn-primary text-sm">Browse Finance Tools</a>
          <a href="#developer" className="btn-secondary text-sm">Developer Tools</a>
        </div>

        {/* Featured quick-access */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {FEATURED.map(slug => {
            const t = TOOLS.find(x => x.slug === slug);
            if (!t) return null;
            return (
              <Link key={slug} href={`/tools/${slug}/`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:text-blue-400"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
              >
                <span aria-hidden="true">{t.icon}</span>
                {t.name.split('—')[0].trim().split(' ').slice(0, 3).join(' ')}
              </Link>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { v: `${TOOLS.length}+`, l: 'Free Tools' },
            { v: '100%',             l: 'Browser-based' },
            { v: '0',                l: 'Signup Needed' },
            { v: 'Free',             l: 'Forever' },
          ].map(s => (
            <div key={s.l} className="px-6 py-3 rounded-xl flex flex-col items-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-2xl font-black gradient-text">{s.v}</span>
              <span className="text-xs text-slate-500 mt-0.5">{s.l}</span>
            </div>
          ))}
        </div>

        {/* Top Ad */}
        <div className="mt-10">
          <p className="ad-label">Advertisement</p>
          <AdUnit slot="auto-2" center />
        </div>
      </section>


      {/* Trending searches — helps Google understand popular pages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 mb-4">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">🔥 Most searched this week</h2>
        <div className="flex flex-wrap gap-2">
          {[
            {slug:'gst-calculator',         label:'GST Calculator India 2026'},
            {slug:'income-tax-calculator',   label:'Income Tax Calculator'},
            {slug:'emi-calculator',          label:'Home Loan EMI Calculator'},
            {slug:'hra-calculator',          label:'HRA Exemption Calculator'},
            {slug:'nps-calculator',          label:'NPS Calculator India'},
            {slug:'ifsc-finder',             label:'IFSC Code Finder'},
            {slug:'sip-calculator',          label:'SIP Return Calculator'},
            {slug:'gratuity-calculator',     label:'Gratuity Calculator'},
            {slug:'capital-gains-calculator',label:'Capital Gains Tax Calculator'},
            {slug:'invoice-generator',       label:'Free GST Invoice Generator'},
            {slug:'sukanya-calculator',      label:'Sukanya Samriddhi Calculator'},
            {slug:'salary-hike-calculator',  label:'Salary Hike Calculator'},
            {slug:'vehicle-registration-info',label:'Vehicle Number Decoder'},
            {slug:'json-formatter',          label:'JSON Formatter'},
            {slug:'diff-checker',            label:'Text Diff Checker'},
          ].map(t => (
            <a key={t.slug} href={`/tools/${t.slug}/`}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:text-blue-300"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
              {t.label}
            </a>
          ))}
        </div>
      </section>
      {/* ── TOOL HUBS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {HUB_CONFIG.map((hub) => {
          const tools = getToolsByHub(hub.id);
          if (!tools.length) return null;
          return (
            <div key={hub.id} id={hub.id} className="mb-20">

              {/* Hub header */}
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: 'rgba(12,147,240,0.1)', border: '1px solid rgba(12,147,240,0.2)' }}
                    aria-hidden="true"
                  >
                    {hub.emoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">{hub.label}</h2>
                    <p className="text-xs text-slate-500">{tools.length} tools available</p>
                  </div>
                </div>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(12,147,240,0.2), transparent)' }} aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-500 mb-7 ml-0">{hub.tagline}</p>

              {/* Tool grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {tools.map(tool => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}/`}
                    className="tool-card rounded-xl p-4 block group"
                    aria-label={`${tool.name.split('—')[0].trim()} — ${tool.description.slice(0, 60)}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 transition"
                        style={{ background: 'rgba(12,147,240,0.08)', border: '1px solid rgba(12,147,240,0.15)' }}
                        aria-hidden="true"
                      >
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className="text-sm font-semibold text-slate-200 leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-300 transition">
                          {tool.name.split('—')[0].trim()}
                        </h3>
                        <span className="cat-pill">{tool.category}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#0c93f0' }}>
                      Open tool
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── WHY TOOLNESTIN ── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-100 mb-3">Why ToolNestIn?</h2>
            <p className="text-slate-500 max-w-lg mx-auto">No popups. No forced signups. No 5-step paywalls. Tools that just work.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY.map(w => (
              <div key={w.title} className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-3xl mb-4" aria-hidden="true">{w.icon}</div>
                <h3 className="font-bold text-slate-200 mb-2">{w.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUIDES STRIP ── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-1">Free guides & resources</h2>
              <p className="text-sm text-slate-500">Expert explanations for Indian tax, finance, and productivity</p>
            </div>
            <Link href="/blog/" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition hidden sm:block">
              View all guides →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/blog/how-to-calculate-gst-india',   title: 'How to Calculate GST in India 2026',        tag: 'Finance',    time: '6 min' },
              { href: '/blog/old-vs-new-tax-regime-2026',   title: 'Old vs New Tax Regime — Which is Better?',  tag: 'Tax',        time: '8 min' },
              { href: '/blog/emi-calculation-guide-india',  title: 'How EMI is Calculated — Complete Guide',    tag: 'Finance',    time: '7 min' },
            ].map(a => (
              <Link key={a.href} href={a.href}
                className="rounded-xl p-5 block hover:border-blue-500/30 transition"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(12,147,240,0.1)', color: '#36b0fb' }}>{a.tag}</span>
                  <span className="text-xs text-slate-600">{a.time} read</span>
                </div>
                <div className="text-sm font-semibold text-slate-300 leading-snug mb-2">{a.title}</div>
                <div className="text-xs" style={{ color: '#0c93f0' }}>Read guide →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <p className="ad-label">Advertisement</p>
        <AdUnit slot="auto-relaxed" center />
      </div>

    </div>
  );
}
