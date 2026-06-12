import Link from 'next/link';
import type { Metadata } from 'next';
import { TOOLS, HUB_CONFIG, getToolsByHub } from './tools/registry';
import AdUnit from '@/components/AdUnit';

export const metadata: Metadata = {
  title: 'ToolNestIn — 80+ Free Online Tools for India: GST, EMI, Income Tax Calculator 2026',
  description: 'Free Indian online tools: Income Tax Calculator 2026, GST Calculator, EMI Calculator, SIP Calculator, HRA Calculator, NPS Calculator, IFSC Finder, Gratuity Calculator. No signup. Instant. 100% free.',
  alternates: { canonical: 'https://toolnestin.co.in' },
  keywords: [
    'free online tools india 2026',
    'income tax calculator india 2026',
    'gst calculator india',
    'emi calculator india',
    'sip calculator india',
    'hra calculator india',
    'nps calculator 2026',
    'ifsc finder',
    'gratuity calculator india',
    'sukanya samriddhi calculator 2026',
  ],
};

export default function HomePage() {
  return (
    <div className="hero-bg">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-400 text-xs font-600 mb-6 uppercase tracking-widest">
          ✦ {TOOLS.length}+ Free Tools · Built for India · No Signup
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-900 tracking-tight mb-5">
          <span className="gradient-text">Every tool you need,</span>
          <br /><span className="text-slate-200">instantly free.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Income Tax Calculator, GST Calculator, EMI Calculator, SIP Calculator, IFSC Finder and {TOOLS.length - 5}+ more. No account. No clutter. Results in seconds.
        </p>

        {/* Quick access chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['income-tax-calculator','gst-calculator','sip-calculator','emi-calculator','ifsc-finder','electricity-bill-calculator','bmi-calculator','ctc-calculator'].map(slug => {
            const t = TOOLS.find(x => x.slug === slug);
            if (!t) return null;
            return (
              <Link key={slug} href={`/tools/${slug}`}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs hover:border-brand-400/40 hover:text-brand-300 transition">
                {t.icon} {t.name.split('—')[0].trim().split(' ').slice(0,3).join(' ')}
              </Link>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-5 mb-10">
          {[
            { v: `${TOOLS.length}+`, l: 'Free Tools' },
            { v: '100%', l: 'Private' },
            { v: '0', l: 'Signup Needed' },
            { v: '🇮🇳', l: 'India First' },
          ].map(s => (
            <div key={s.l} className="glass rounded-xl px-6 py-3 flex flex-col items-center">
              <span className="font-display text-2xl font-800 gradient-text">{s.v}</span>
              <span className="text-slate-500 text-xs">{s.l}</span>
            </div>
          ))}
        </div>
        <AdUnit slot="auto-2" center className="mb-2" />
      </section>

      {/* ALL HUBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {HUB_CONFIG.map((hub, hubIdx) => {
          const tools = getToolsByHub(hub.id);
          if (!tools.length) return null;
          return (
            <div key={hub.id} id={hub.id} className="mb-16">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-display text-2xl font-800 text-slate-100">{hub.emoji} {hub.label}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-brand-400/20 to-transparent" />
                <span className="text-slate-600 text-sm">{tools.length} tools</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">{hub.tagline}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tools.map(tool => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`}
                    className="tool-card glass rounded-2xl p-5 block group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-400/15 flex items-center justify-center text-xl shrink-0 group-hover:bg-brand-500/20 transition">
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-700 text-slate-100 text-sm leading-tight mb-1 group-hover:text-brand-300 transition line-clamp-2">
                          {tool.name.split('—')[0].trim()}
                        </h3>
                        <span className="cat-pill">{tool.category}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{tool.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-brand-400 text-xs font-600">
                      Open <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* ad removed — keeping to 2 max per page per AdSense policy */}
              {/* ad removed — keeping to 2 max per page per AdSense policy */}
            </div>
          );
        })}
      </section>

      {/* WHY TOOLNESTIN */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-display text-3xl font-800 text-center text-slate-100 mb-3">Why ToolNestIn?</h2>
          <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">No popups. No forced signups. No 5-step paywalls. Just tools that work.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '⚡', title: 'Instant Results', desc: 'All tools run in your browser. Results appear as you type.' },
              { icon: '🔒', title: '100% Private', desc: 'Your financial data, code, PAN — nothing leaves your device.' },
              { icon: '🆓', title: 'Always Free', desc: 'No freemium trap. No 3-use daily limit. Free means free.' },
              { icon: '🇮🇳', title: 'India-First', desc: 'GST slabs, EMI, Rupees, IFSC, PAN — built for Indian needs.' },
            ].map(f => (
              <div key={f.title} className="glass rounded-2xl p-5 text-center">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-display font-700 text-slate-100 mb-2 text-sm">{f.title}</h3>
                <p className="text-slate-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO TEXT */}
      <section className="border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="font-display text-2xl font-700 text-slate-300 mb-5">Free Online Tools for Indian Businesses, Developers & Students</h2>
          <div className="text-slate-500 text-sm leading-relaxed space-y-3">
            <p>ToolNestIn provides India&apos;s most comprehensive collection of free online tools. Our <Link href="/tools/income-tax-calculator" className="text-brand-400 hover:underline">Income Tax Calculator</Link> supports both Old and New Regime for AY 2026-27, including 87A rebate and surcharge calculations. The <Link href="/tools/gst-calculator" className="text-brand-400 hover:underline">GST Calculator</Link> covers all four slabs with CGST/SGST/IGST breakdown.</p>
            <p>For investment planning, our <Link href="/tools/sip-calculator" className="text-brand-400 hover:underline">SIP Calculator</Link> shows year-by-year wealth growth with visual charts, while the <Link href="/tools/ppf-calculator" className="text-brand-400 hover:underline">PPF Calculator</Link> computes tax-free returns at current 7.1% rate. The <Link href="/tools/ctc-calculator" className="text-brand-400 hover:underline">CTC to In-Hand Salary Calculator</Link> shows your exact take-home after PF, TDS, and professional tax.</p>
            <p>Developers rely on our <Link href="/tools/json-formatter" className="text-brand-400 hover:underline">JSON Formatter</Link>, <Link href="/tools/regex-tester" className="text-brand-400 hover:underline">Regex Tester</Link>, <Link href="/tools/jwt-decoder" className="text-brand-400 hover:underline">JWT Decoder</Link>, and <Link href="/tools/hash-generator" className="text-brand-400 hover:underline">Hash Generator</Link> — all processing happens client-side for complete privacy. Our <Link href="/tools/ifsc-finder" className="text-brand-400 hover:underline">IFSC Code Finder</Link> and <Link href="/tools/pincode-finder" className="text-brand-400 hover:underline">Pincode Finder</Link> use live RBI and postal data.</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <AdUnit slot="auto-relaxed" center />
      </div>

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'ToolNestIn — Free Online Tools India',
        numberOfItems: TOOLS.length,
        itemListElement: TOOLS.map((t, i) => ({
          '@type': 'ListItem', position: i + 1, name: t.name,
          url: `https://toolnestin.co.in/tools/${t.slug}`,
        })),
      })}} />
    </div>
  );
}
