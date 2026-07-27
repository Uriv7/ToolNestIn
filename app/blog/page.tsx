import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from './articles';

export const metadata: Metadata = {
  title: 'Guides & Resources — ToolNestIn',
  description: 'Free guides on Indian tax, finance, and productivity. Income tax tips, GST calculation guides, EMI planning resources for India 2026.',
  alternates: { canonical: 'https://toolnestin.co.in/blog/' },
};

const TAG_COLORS: Record<string, string> = {
  Finance:    'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Tax:        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Investment: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  Retirement: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-black gradient-text mb-3">Guides &amp; Resources</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          In-depth guides on Indian tax, finance, and productivity — written to help you get the most from our free tools.
        </p>
      </div>
      <div className="space-y-4">
        {ARTICLES.map(article => (
          <Link key={article.slug} href={`/blog/${article.slug}/`}
            className="glass rounded-2xl p-6 block hover:border-blue-500/30 transition group"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TAG_COLORS[article.tag] || ''}`}>
                {article.tag}
              </span>
              <span className="text-slate-600 text-xs">{article.date} · {article.readTime} read</span>
            </div>
            <h2 className="font-bold text-lg text-slate-100 mb-2 group-hover:text-blue-300 transition leading-snug">
              {article.title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">{article.excerpt}</p>
            <span className="text-blue-400 text-sm font-medium">Read guide →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
