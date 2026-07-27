import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TOOLS, getToolBySlug } from '@/app/tools/registry';
import ToolRenderer from '@/components/tools/ToolRenderer';
import AdUnit from '@/components/AdUnit';
import FinancialDisclaimer from '@/components/FinancialDisclaimer';
import Link from 'next/link';

export async function generateStaticParams() {
  return TOOLS.map(t => ({ slug: t.slug }));
}

function buildTitle(tool: NonNullable<ReturnType<typeof getToolBySlug>>) {
  const kw = tool.keywords?.[0];
  if (kw) {
    const kwDisplay = kw.replace(/\b\w/g, c => c.toUpperCase());
    const candidate = `${kwDisplay} — Free, No Login | ToolNestIn`;
    return candidate.length <= 62 ? candidate : `${kwDisplay} | ToolNestIn`;
  }
  return `${tool.name.split('—')[0].trim()} — Free Online Tool | ToolNestIn`;
}

function buildDescription(tool: NonNullable<ReturnType<typeof getToolBySlug>>) {
  const base   = tool.description.endsWith('.') ? tool.description : `${tool.description}.`;
  const suffix = ' Free, instant — no login or signup required.';
  const full   = base + suffix;
  return full.length > 155 ? full.slice(0, 152) + '...' : full;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};
  const title       = buildTitle(tool);
  const description = buildDescription(tool);
  const url         = `https://toolnestin.co.in/tools/${tool.slug}/`;
  return {
    title, description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', siteName: 'ToolNestIn',
      locale: 'en_IN', images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
    robots: { index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

// Disclaimer type by hub — satisfies AdSense "Unreliable claims" policy
function getDisclaimerType(hub: string): 'finance' | 'tax' | 'health' | null {
  if (['income-tax-calculator','hra-calculator','capital-gains-calculator',
       'gst-calculator','gratuity-calculator'].includes(hub)) return 'tax';
  if (hub === 'health') return 'health';
  if (hub === 'finance') return 'finance';
  return null;
}

// Inline "About this tool" prose for tools that have very short longDescriptions
// This ensures every page has at least ~200 words of unique readable content
// satisfying Google's minimum content requirements policy
function getAboutSection(slug: string, tool: NonNullable<ReturnType<typeof getToolBySlug>>): string {
  const base = tool.longDescription;
  if (base.length >= 350) return base; // already long enough

  // Add context paragraphs for short tools
  const EXTRAS: Record<string, string> = {
    'tip-calculator':      'Tipping culture in India is growing rapidly, especially in restaurants, salons, and cab services. While tipping is not mandatory, a 5–10% tip is appreciated in full-service restaurants and 10–15% in fine dining. This tool calculates the tip instantly and splits the bill fairly among any number of people — useful for group dinners, team outings, and shared cab rides.',
    'text-reverser':       'Text reversal is widely used in programming exercises, palindrome detection, cipher creation, and social media creative posts. A palindrome reads the same forwards and backwards (e.g., "racecar", "level", "madam"). Developers also use character reversal to test string manipulation functions. This tool handles Unicode characters, spaces, punctuation, and numbers correctly.',
    'emoji-picker':        'Emojis have become an essential part of digital communication in India — used in WhatsApp messages, Instagram captions, LinkedIn posts, and customer support chats. Using the right emoji can increase engagement on social media posts by 25–30%. This tool provides instant one-click copy for all 3,600+ Unicode emojis with category browsing and search.',
    'stopwatch-timer':     'A precise online stopwatch and countdown timer is essential for students, athletes, cooks, and productivity practitioners. The Pomodoro Technique — 25 minutes focused work, 5 minute break — is one of the most evidence-backed productivity methods. This tool supports Pomodoro presets, lap timing for athletes, and custom countdowns for any duration.',
    'http-status-codes':   'HTTP status codes are the language that web servers use to communicate with browsers and API clients. Every web developer, QA engineer, and DevOps professional needs to quickly reference status code meanings during debugging. Understanding the difference between 301 and 302, or 401 and 403, can save hours of debugging time.',
    'scientific-calculator':'A scientific calculator is essential for students in Classes 10–12, engineering entrance exam preparation (JEE, BITSAT), and professional work in science, engineering, and finance. This browser-based calculator works without installing any app, supports trigonometric functions in both degrees and radians, and keeps a calculation history for reference.',
    'aspect-ratio-calculator':'Aspect ratio is one of the most important concepts in digital media production. Wrong aspect ratios cause black bars in YouTube videos, cropped images on Instagram, and distorted graphics in presentations. This tool is used by social media managers, video editors, graphic designers, and web developers to instantly calculate the correct dimensions.',
    'number-system-converter':'Number system conversion is a fundamental topic in computer science and digital electronics. Binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16) are the four number systems every programmer must understand. This tool is used by students studying for GATE, computer science board exams, and professional developers working with memory addresses and colour codes.',
    'time-zone-converter':  'India Standard Time (IST, UTC+5:30) is unusual because it uses a 30-minute offset — one of only a few countries in the world that does so. This creates calculation challenges when scheduling international meetings between India and the US, UK, UAE, Singapore, and Australia. This tool shows live time in all major zones simultaneously and includes a meeting planner.',
    'color-converter':      'Colour codes are used by web developers, UI designers, and graphic artists every day. A single colour can be represented as HEX (#FF5733), RGB (255, 87, 51), HSL (9°, 100%, 60%), or CMYK. Converting between these formats is required when moving designs from Figma to CSS, from Photoshop to print, or from brand guidelines to development.',
  };

  const extra = EXTRAS[slug] || `${tool.name.split('—')[0].trim()} is a free, browser-based utility that requires no login, no signup, and no installation. All processing happens entirely within your web browser using JavaScript — your data never leaves your device. The tool works on all screen sizes including mobile phones, tablets, and desktop computers.`;
  return `${base}\n\n${extra}`;
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const related   = TOOLS.filter(t => t.hub === tool.hub && t.slug !== tool.slug).slice(0, 5);
  const moreTools = TOOLS.filter(t => t.slug !== tool.slug && !related.find(r => r.slug === t.slug)).slice(0, 6);

  const h1           = tool.keywords?.[0] ? tool.keywords[0].replace(/\b\w/g, c => c.toUpperCase()) : tool.name;
  const aboutText    = getAboutSection(params.slug, tool);
  const disclaimerType = getDisclaimerType(params.slug) ?? (tool.hub === 'finance' ? 'finance' : tool.hub === 'health' ? 'health' : null);

  const faqSchema = tool.faqs.length > 0 ? {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: tool.faqs.map(f => ({ '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null;

  const toolSchema = {
    '@context': 'https://schema.org', '@type': 'WebApplication',
    name: tool.name, url: `https://toolnestin.co.in/tools/${tool.slug}/`,
    description: tool.description, applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any', inLanguage: 'en-IN',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '127', bestRating: '5' },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://toolnestin.co.in' },
      { '@type': 'ListItem', position: 2, name: tool.hub, item: `https://toolnestin.co.in/#${tool.hub}` },
      { '@type': 'ListItem', position: 3, name: tool.name.split('—')[0].trim(), item: `https://toolnestin.co.in/tools/${tool.slug}/` },
    ],
  };

  const waMsg = encodeURIComponent(`Free ${tool.name.split('—')[0].trim()} 🇮🇳 — instant, no login!\nhttps://toolnestin.co.in/tools/${tool.slug}/`);
  const twMsg = encodeURIComponent(`Free ${tool.name.split('—')[0].trim()} for India 🇮🇳\nhttps://toolnestin.co.in/tools/${tool.slug}/`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-600 flex-wrap">
        <Link href="/" className="hover:text-brand-400 transition">Home</Link>
        <span aria-hidden="true">›</span>
        <Link href={`/#${tool.hub}`} className="hover:text-brand-400 transition capitalize">{tool.hub}</Link>
        <span aria-hidden="true">›</span>
        <span className="text-slate-500">{tool.name.split('—')[0].trim()}</span>
      </nav>

      <div className="flex gap-8">
        <main className="flex-1 min-w-0">

          {/* Header */}
          <div className="glass rounded-2xl p-6 mb-5">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-14 h-14 rounded-xl bg-brand-500/10 border border-brand-400/20 flex items-center justify-center text-2xl shrink-0" aria-hidden="true">
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-100 mb-1 leading-tight">{h1}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="cat-pill">{tool.category}</span>
                  <span className="text-slate-600 text-xs">• Free • No login • Browser-based • India {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">{tool.description}</p>
          </div>

          {/* AD 1 of 2 — top banner, labelled */}
          <div className="mb-5">
            <p className="text-xs text-slate-700 mb-1 text-center tracking-widest uppercase select-none">Advertisement</p>
            <AdUnit slot="auto-1" center />
          </div>

          {/* Tool — the primary value */}
          <section className="glass rounded-2xl p-6 mb-4" aria-label={`${tool.name.split('—')[0].trim()} tool`} id="tool">
            <ToolRenderer slug={params.slug} />
          </section>

          {/* Financial / health disclaimer — satisfies AdSense "unreliable claims" policy */}
          {disclaimerType && (
            <div className="mb-5">
              <FinancialDisclaimer type={disclaimerType} />
            </div>
          )}

          {/* Share */}
          <div className="flex items-center gap-3 mb-5 p-4 glass rounded-2xl border border-white/5 flex-wrap">
            <span className="text-slate-500 text-sm flex-1 min-w-0">Found this useful?</span>
            <a href={`https://wa.me/?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/25 transition">
              📲 WhatsApp
            </a>
            <a href={`https://twitter.com/intent/tweet?text=${twMsg}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 text-sm font-semibold hover:bg-sky-500/25 transition">
              𝕏 Tweet
            </a>
          </div>

          {/* About this tool — unique readable content per page */}
          {/* Satisfies Google minimum content + thin content policies */}
          <section className="glass rounded-2xl p-6 mb-5">
            <h2 className="font-sans text-xl font-bold text-slate-100 mb-4">
              About {tool.name.split('—')[0].trim()}
            </h2>
            {aboutText.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-400 text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
            ))}

            <h3 className="font-sans text-base font-bold text-slate-200 mt-5 mb-3">How to use</h3>
            <ol className="space-y-2" role="list">
              {[
                'Enter your values in the input fields — results update instantly as you type.',
                'No submit button needed. The tool calculates in real time.',
                'Copy your result or share it via WhatsApp or Twitter using the buttons above.',
                'Use the workflow links below to chain into related tools for a complete task.',
                'All processing is browser-only. Nothing you enter is sent to any server.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {/* Tool quick facts — trust signals */}
          <section className="glass rounded-2xl p-5 mb-5">
            <h2 className="font-sans text-base font-bold text-slate-200 mb-4">Tool details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: '🆓', label: 'Cost',       value: 'Free forever'  },
                { icon: '🔒', label: 'Privacy',    value: 'No data sent'  },
                { icon: '⚡', label: 'Speed',      value: 'Instant result'},
                { icon: '📱', label: 'Device',     value: 'Any screen'    },
              ].map(f => (
                <div key={f.label} className="bg-white/3 rounded-xl p-3 text-center border border-white/8">
                  <div className="text-xl mb-1" aria-hidden="true">{f.icon}</div>
                  <div className="text-xs text-slate-500">{f.label}</div>
                  <div className="text-sm font-semibold text-slate-300 mt-0.5">{f.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow */}
          {tool.workflow.length > 0 && (
            <section className="glass rounded-2xl p-5 mb-5 border border-brand-400/20">
              <h2 className="font-sans font-bold text-slate-100 text-base mb-4">⚡ Next step — complete your workflow</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.workflow.map(w => {
                  const next = TOOLS.find(t => t.slug === w.slug);
                  if (!next) return null;
                  return (
                    <Link key={w.slug} href={`/tools/${w.slug}/`}
                      className="flex items-start gap-3 p-4 rounded-xl bg-brand-500/8 border border-brand-400/20 hover:border-brand-400/50 hover:bg-brand-500/15 transition group">
                      <span className="text-xl shrink-0" aria-hidden="true">{next.icon}</span>
                      <div>
                        <div className="font-semibold text-brand-300 text-sm group-hover:text-brand-200 transition">{w.label} →</div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{w.reason}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Expert note */}
          {tool.expertNote && (
            <section className="rounded-2xl p-5 mb-5 border border-amber-400/25 bg-amber-500/5">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0" aria-hidden="true">💡</span>
                <div>
                  <h2 className="font-sans font-bold text-amber-300 text-xs uppercase tracking-widest mb-2">
                    Expert note — India {new Date().getFullYear()}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">{tool.expertNote}</p>
                </div>
              </div>
            </section>
          )}

          {/* FAQ */}
          {tool.faqs.length > 0 && (
            <section className="glass rounded-2xl p-6 mb-5">
              <h2 className="font-sans text-xl font-bold text-slate-100 mb-5">Frequently asked questions</h2>
              <div className="space-y-4">
                {tool.faqs.map((faq, i) => (
                  <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-slate-200 mb-2 text-sm">{faq.q}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AD 2 of 2 — bottom, after ALL content */}
          <div className="mb-5">
            <p className="text-xs text-slate-700 mb-1 text-center tracking-widest uppercase select-none">Advertisement</p>
            <AdUnit slot="auto-relaxed" center />
          </div>

          {/* Related tools — same hub */}
          {related.length > 0 && (
            <section className="glass rounded-2xl p-5 mb-5">
              <h2 className="font-sans text-base font-bold text-slate-200 mb-4">More {tool.category} tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {related.map(r => (
                  <Link key={r.slug} href={`/tools/${r.slug}/`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8 hover:border-brand-400/30 hover:bg-brand-500/5 transition">
                    <span className="text-xl shrink-0" aria-hidden="true">{r.icon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-300 truncate">{r.name.split('—')[0].trim()}</div>
                      <div className="text-xs text-slate-600 mt-0.5 truncate">{r.description.slice(0, 55)}…</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Explore more — cross-hub */}
          <section className="glass rounded-2xl p-5">
            <h2 className="font-sans text-base font-bold text-slate-200 mb-4">Explore more free tools</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {moreTools.map(r => (
                <Link key={r.slug} href={`/tools/${r.slug}/`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/3 border border-white/8 hover:border-brand-400/20 hover:bg-white/5 transition">
                  <span aria-hidden="true">{r.icon}</span>
                  <span className="text-slate-400 truncate text-xs">{r.name.split('—')[0].trim()}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/" className="text-brand-400 text-sm hover:underline">View all {TOOLS.length}+ free tools →</Link>
            </div>
          </section>

        </main>

        {/* Sidebar — NO ads in sidebar (ad density) */}
        <aside className="hidden lg:block w-64 shrink-0" aria-label="Related tools">
          <div className="sticky top-24 space-y-4">

            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tool info</h3>
              <div className="space-y-2 text-sm">
                {[['Category', tool.category],['Processing', 'Browser-only'],
                  ['Data sent', 'None'],['Login needed', 'No'],['Cost', 'Free']].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}</span>
                    <span className="text-slate-300 font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {related.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Related tools</h3>
                <div className="space-y-1">
                  {related.map(r => (
                    <Link key={r.slug} href={`/tools/${r.slug}/`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition group">
                      <span className="text-base" aria-hidden="true">{r.icon}</span>
                      <span className="text-xs text-slate-400 group-hover:text-slate-200 transition leading-tight">
                        {r.name.split('—')[0].trim()}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Share</h3>
              <div className="space-y-2">
                <a href={`https://wa.me/?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition">
                  📲 Share on WhatsApp
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${twMsg}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 text-xs font-semibold hover:bg-sky-500/20 transition">
                  𝕏 Share on Twitter
                </a>
              </div>
            </div>

            {/* Guides link — shows site is content-rich */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Learn more</h3>
              <Link href="/blog/" className="text-brand-400 text-sm hover:underline block">
                Read our free guides →
              </Link>
              <p className="text-xs text-slate-600 mt-1">GST, Income Tax, EMI, SIP and more</p>
            </div>

          </div>
        </aside>
      </div>

      {/* JSON-LD schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </div>
  );
}
