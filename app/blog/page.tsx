import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guides & Resources — ToolNestIn',
  description: 'Free guides on Indian tax, finance, and productivity. Income tax tips, GST calculation guides, EMI planning resources for India 2026.',
  alternates: { canonical: 'https://toolnestin.co.in/blog' },
};

export const ARTICLES = [
  {
    slug: 'how-to-calculate-gst-india',
    title: 'How to Calculate GST in India — Complete Guide 2026',
    excerpt: 'Step-by-step guide to calculating GST for products and services in India. Covers all four GST slabs (5%, 12%, 18%, 28%), CGST vs SGST split, reverse calculation, and common mistakes.',
    date: '2026-06-01',
    readTime: '6 min',
    tag: 'Finance',
  },
  {
    slug: 'old-vs-new-tax-regime-2026',
    title: 'Old vs New Tax Regime India 2026 — Which is Better for You?',
    excerpt: 'A detailed comparison of the Old Tax Regime and New Tax Regime for FY 2025-26. Includes worked examples for salaried employees at different income levels with HRA, 80C, and home loan deductions.',
    date: '2026-05-28',
    readTime: '8 min',
    tag: 'Tax',
  },
  {
    slug: 'emi-calculation-guide-india',
    title: 'How EMI is Calculated — Home Loan, Car Loan, Personal Loan',
    excerpt: 'Understand the reducing balance EMI formula used by all Indian banks. Includes worked examples, amortisation table explanation, prepayment impact, and how to reduce total interest paid.',
    date: '2026-05-20',
    readTime: '7 min',
    tag: 'Finance',
  },
  {
    slug: 'sip-vs-lumpsum-india',
    title: 'SIP vs Lump Sum Investment — Which Gives Better Returns in India?',
    excerpt: 'A data-driven comparison of SIP and lump sum investment strategies for Indian mutual funds. Covers rupee cost averaging, market timing risk, and which approach suits different investor profiles.',
    date: '2026-05-15',
    readTime: '9 min',
    tag: 'Investment',
  },
  {
    slug: 'hra-exemption-guide',
    title: 'HRA Exemption Explained — How to Maximise Tax Savings on House Rent',
    excerpt: 'Complete guide to HRA exemption under Section 10(13A). How to calculate the exempt amount, metro vs non-metro rules, what documents you need, and common mistakes that cost employees money.',
    date: '2026-05-10',
    readTime: '6 min',
    tag: 'Tax',
  },
  {
    slug: 'nps-vs-ppf-india',
    title: 'NPS vs PPF — Which is Better for Retirement Planning in India?',
    excerpt: 'A comprehensive comparison of the National Pension System (NPS) and Public Provident Fund (PPF) for Indian investors. Covers returns, liquidity, tax treatment, and which suits different retirement goals.',
    date: '2026-05-05',
    readTime: '10 min',
    tag: 'Retirement',
  },
];

const TAG_COLORS: Record<string, string> = {
  Finance: 'bg-blue-500/15 text-blue-300',
  Tax: 'bg-emerald-500/15 text-emerald-300',
  Investment: 'bg-purple-500/15 text-purple-300',
  Retirement: 'bg-amber-500/15 text-amber-300',
};

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-900 gradient-text mb-3">Guides & Resources</h1>
        <p className="text-slate-400 leading-relaxed">
          In-depth guides on Indian tax, finance, and productivity — written to help you get the most out of our free tools.
        </p>
      </div>

      <div className="space-y-5">
        {ARTICLES.map(article => (
          <Link key={article.slug} href={`/blog/${article.slug}`}
            className="glass rounded-2xl p-6 block hover:border-brand-400/30 border border-white/5 transition group">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className={`text-xs font-600 px-2.5 py-1 rounded-full ${TAG_COLORS[article.tag] || 'bg-white/10 text-slate-300'}`}>
                {article.tag}
              </span>
              <span className="text-slate-600 text-xs">{article.date} · {article.readTime} read</span>
            </div>
            <h2 className="font-display text-lg font-700 text-slate-100 mb-2 group-hover:text-brand-300 transition leading-snug">
              {article.title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">{article.excerpt}</p>
            <span className="text-brand-400 text-sm mt-3 inline-block group-hover:underline">Read guide →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
