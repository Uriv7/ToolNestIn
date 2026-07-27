import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact — ToolNestIn',
  description: 'Get in touch with the ToolNestIn team. Suggest a tool, report a bug, or ask about partnerships.',
  alternates: { canonical: 'https://toolnestin.co.in/contact/' },
};

const CONTACTS = [
  {
    icon: '🐛',
    title: 'Bug Reports',
    email: 'bugs@toolnestin.co.in',
    desc: 'Found something broken or a calculation that seems off? Tell us the tool name and what result you expected.',
    response: '24 hrs',
  },
  {
    icon: '💡',
    title: 'Tool Suggestions',
    email: 'suggest@toolnestin.co.in',
    desc: 'Have an idea for a tool we should build? We read every suggestion — most of our tools come from user requests.',
    response: '48 hrs',
  },
  {
    icon: '💼',
    title: 'Business & Partnerships',
    email: 'hello@toolnestin.co.in',
    desc: 'Advertising, API access, embedding tools on your platform, or co-marketing opportunities.',
    response: '2 business days',
  },
  {
    icon: '🔒',
    title: 'Privacy & Legal',
    email: 'privacy@toolnestin.co.in',
    desc: 'Questions about our privacy policy, data handling, or legal matters including takedown requests.',
    response: '48 hrs',
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-4">Get in touch</h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
          We are a small team and we read every message. Whether it is a bug, a suggestion, or a partnership enquiry — reach out.
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {CONTACTS.map(c => (
          <a
            key={c.title}
            href={`mailto:${c.email}`}
            className="glass rounded-2xl p-6 block transition-all duration-200 group"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            onMouseEnter={undefined}
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'rgba(12,147,240,0.08)', border: '1px solid rgba(12,147,240,0.15)' }}
                aria-hidden="true"
              >
                {c.icon}
              </div>
              <div>
                <h2 className="font-bold text-slate-200 text-base mb-0.5">{c.title}</h2>
                <div className="text-xs text-slate-600">Response: ~{c.response}</div>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">{c.desc}</p>
            <div
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition"
            >
              {c.email}
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* Additional info */}
      <div className="rounded-2xl p-7" style={{ background: 'rgba(12,147,240,0.04)', border: '1px solid rgba(12,147,240,0.15)' }}>
        <h3 className="font-bold text-slate-200 mb-4 text-lg">Before you write</h3>
        <div className="space-y-3">
          {[
            { q: 'My tool result seems wrong', a: 'Check our FAQ section on the tool page — most "wrong" results are due to different input formats (e.g. annual vs monthly salary). If still wrong, email bugs@toolnestin.co.in with your inputs.' },
            { q: 'Can I embed a tool on my website?', a: 'Not currently — but we are building an embed feature. Email hello@toolnestin.co.in to join the waitlist.' },
            { q: 'Is the source code open?', a: 'Not yet. We are planning to open-source some tools in Q3 2026. Follow @toolnestin on Twitter for updates.' },
          ].map(item => (
            <div key={item.q} className="border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="font-semibold text-sm text-slate-300 mb-1">{item.q}</div>
              <div className="text-sm text-slate-500 leading-relaxed">{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/" className="btn-secondary text-sm">← Browse Tools</Link>
        <Link href="/about/" className="btn-secondary text-sm">About ToolNestIn</Link>
      </div>
    </div>
  );
}
