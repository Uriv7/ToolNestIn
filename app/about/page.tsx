import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { TOOLS } from '@/app/tools/registry';

export const metadata: Metadata = {
  title: 'About Us — Free Online Tools for India',
  description: `ToolNestIn provides ${TOOLS.length}+ free, fast, and private online tools for India — GST Calculator, EMI Calculator, Income Tax Calculator 2026 and more. No signup, no data collection, instant results.`,
  alternates: { canonical: 'https://toolnestin.co.in/about/' },
};

const STATS = [
  { v: '100%',  l: 'Browser-based' },
  { v: '0',     l: 'Data Collected' },
  { v: '🇮🇳',   l: 'India First' },
];

const WHY_US = [
  {
    icon: '⚡',
    title: 'Instant Results',
    body: 'Every tool on ToolNestIn calculates and converts in real time as you type. There is no "Submit" button to wait for, no server round-trip, no loading spinner. Your GST calculation or EMI result appears the moment you enter a value. This is possible because all our tools run entirely as JavaScript in your browser — the same technology that powers Google Docs and Figma.',
  },
  {
    icon: '🔒',
    title: 'Completely Private',
    body: 'When you enter your salary into our Income Tax Calculator, your CTC into our HRA Calculator, or your loan amount into our EMI Calculator — that data never leaves your device. There are no API calls, no database writes, no logs. Your financial information is yours alone. We built it this way deliberately: a tool that sends your data to a server is a liability, not a utility.',
  },
  {
    icon: '🆓',
    title: 'Free Forever',
    body: 'Every tool on ToolNestIn is free. Not "free with a 3-use limit." Not "free if you sign up." Not "free with a premium tier." Just free. We sustain ToolNestIn through non-intrusive Google AdSense advertising — a single, clearly labelled banner per page. We will never put an ad between you and your result, never show a pop-up, and never auto-play a video. The tool always comes first.',
  },
  {
    icon: '🇮🇳',
    title: 'Built for India',
    body: 'Most free tool sites are built for Western markets and miss India entirely. ToolNestIn was built specifically for Indian users, Indian regulations, and Indian financial products. Our GST Calculator handles all four GST slabs (5%, 12%, 18%, 28%) including the CGST/SGST split for intrastate transactions. Our Income Tax Calculator covers both the Old and New Tax Regime for FY 2025-26. Our IFSC Finder covers every scheduled bank in India. Our HRA Calculator applies the correct metro vs non-metro rules under Section 10(13A). This is not an afterthought — it is the entire point.',
  },
  {
    icon: '📱',
    title: 'Works on Any Device',
    body: 'ToolNestIn is fully responsive and works on every screen size — from a 5-inch Android phone to a 27-inch desktop monitor. Tools are touch-friendly, inputs are appropriately sized for mobile keyboards, and results are readable without zooming. You can also install ToolNestIn as a Progressive Web App (PWA) on your phone\'s home screen for instant access — no app store required.',
  },
  {
    icon: '🧠',
    title: 'Expert-Verified Content',
    body: 'Every calculator and converter on ToolNestIn is accompanied by expert notes, FAQs, and usage context written by people who understand the Indian tax code, financial regulations, and developer needs. The GST Calculator explains intrastate vs interstate rules. The NPS Calculator explains the 80CCD(1B) benefit. The HRA Calculator explains metro vs non-metro classification. We do not generate placeholder content — every word is there because it helps you use the tool correctly.',
  },
];

const TOOLS_HIGHLIGHT = [
  { slug: 'gst-calculator',        label: 'GST Calculator',         desc: 'All 4 GST slabs, CGST/SGST split, reverse calculation' },
  { slug: 'income-tax-calculator', label: 'Income Tax Calculator',  desc: 'Old & New Regime, FY 2025-26, all deductions' },
  { slug: 'emi-calculator',        label: 'EMI Calculator',         desc: 'Home loan, car loan, personal loan with amortisation table' },
  { slug: 'hra-calculator',        label: 'HRA Calculator',         desc: 'Section 10(13A), metro/non-metro, annual exemption' },
  { slug: 'sip-calculator',        label: 'SIP Calculator',         desc: 'Projected corpus with compound growth over 1–40 years' },
  { slug: 'nps-calculator',        label: 'NPS Calculator',         desc: 'Corpus at 60, annuity split, 80CCD(1B) benefit' },
  { slug: 'invoice-generator',     label: 'GST Invoice Generator',  desc: 'Print-ready PDF invoices with GSTIN and HSN support' },
  { slug: 'ifsc-finder',           label: 'IFSC Finder',            desc: 'All Indian banks, instant branch and MICR lookup' },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="font-sans text-4xl sm:text-5xl font-black gradient-text mb-5">About ToolNestIn</h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          ToolNestIn is a free online tool platform built specifically for India. We provide instant,
          private, and accurate calculators, converters, and developer utilities — with no account
          required, no data collection, and no paywalls. Ever.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {/* Dynamic tool count — always accurate */}
        <div className="glass rounded-2xl p-5 text-center">
          <div className="font-sans text-3xl font-extrabold gradient-text">{TOOLS.length}+</div>
          <div className="text-slate-500 text-sm mt-1">Free Tools</div>
        </div>
        {STATS.map(s => (
          <div key={s.l} className="glass rounded-2xl p-5 text-center">
            <div className="font-sans text-3xl font-extrabold gradient-text">{s.v}</div>
            <div className="text-slate-500 text-sm mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Origin story */}
      <section className="glass rounded-2xl p-8 mb-8">
        <h2 className="font-sans text-2xl font-bold text-slate-100 mb-4">Why We Built ToolNestIn</h2>
        <div className="space-y-4 text-slate-400 leading-relaxed">
          <p>
            Every time we needed a quick GST calculation or wanted to check our EMI for a home loan,
            we ended up on a site that made us sign up, showed five pop-ups, or paywalled the result
            after one free use. Indian tax calculators were especially bad — most were outdated, had
            wrong slab rates, or simply did not account for the New Tax Regime introduced in FY 2023-24.
          </p>
          <p>
            So we built ToolNestIn. The goal was simple: every tool should work instantly, privately,
            and correctly — with no friction between you and your answer. No account. No timer.
            No "upgrade to see the full result." Just the tool, and the answer.
          </p>
          <p>
            We launched with 41 tools in May 2026 and have since grown to over {TOOLS.length} tools
            covering finance, health, developer utilities, text processing, and India-specific lookups.
            Every tool is built by people who use it themselves.
          </p>
        </div>
      </section>

      {/* Why us — detailed */}
      <div className="space-y-6 mb-14">
        <h2 className="font-sans text-2xl font-bold text-slate-100">What Makes ToolNestIn Different</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {WHY_US.map(item => (
            <section key={item.title} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                <h3 className="font-sans font-bold text-slate-100 text-lg">{item.title}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
            </section>
          ))}
        </div>
      </div>

      {/* Featured tools */}
      <section className="glass rounded-2xl p-8 mb-10">
        <h2 className="font-sans text-2xl font-bold text-slate-100 mb-6">Our Most-Used India Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOOLS_HIGHLIGHT.map(t => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}/`}
              className="flex gap-3 p-4 rounded-xl bg-white/3 border border-white/10 hover:border-brand-400/30 hover:bg-brand-500/5 transition"
            >
              <div>
                <div className="font-semibold text-brand-300 text-sm">{t.label}</div>
                <div className="text-slate-500 text-xs mt-0.5">{t.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How we sustain */}
      <section className="glass rounded-2xl p-8 mb-10">
        <h2 className="font-sans text-2xl font-bold text-slate-100 mb-4">How We Keep the Lights On</h2>
        <div className="space-y-3 text-slate-400 leading-relaxed text-sm">
          <p>
            ToolNestIn is free because of non-intrusive advertising through Google AdSense. We display
            a single, clearly labelled banner advertisement on each page. We follow Google's publisher
            policies strictly — no pop-ups, no interstitials, no auto-play ads, and no ads placed
            between a user and a tool result.
          </p>
          <p>
            We deliberately keep our ad density low. A site plastered with ads is unpleasant to use,
            loads slowly, and ultimately hurts everyone. Our ads load after the tool is interactive,
            never before. If you are using an ad blocker, the tools continue to work perfectly —
            we do not block users who choose not to see ads.
          </p>
          <p>
            In the future we may introduce optional premium features (API access, bulk processing,
            team workspaces). The core tools will always remain free.
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <div className="text-center">
        <h2 className="font-sans text-xl font-bold text-slate-200 mb-3">Have a suggestion or found a bug?</h2>
        <p className="text-slate-400 text-sm mb-6">We read every message and typically respond within 24 hours on business days.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contact/" className="btn-primary">Contact Us</Link>
          <Link href="/" className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 transition text-sm font-semibold">Browse All Tools →</Link>
        </div>
      </div>

    </div>
  );
}
