import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — ToolNestIn',
  description: 'Get in touch with the ToolNestIn team. Suggest a tool, report a bug, or say hello.',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      <span className="text-4xl block mb-4">✉️</span>
      <h1 className="font-display text-4xl font-900 gradient-text mb-4">Contact Us</h1>
      <p className="text-slate-400 mb-10">Have a tool suggestion, found a bug, or just want to say hi? We&apos;d love to hear from you.</p>

      <div className="glass rounded-2xl p-8 text-left space-y-6">
        {[
          { icon: '🐛', title: 'Bug Reports', email: 'bugs@toolnestin.co.in', desc: 'Found something broken? Let us know.' },
          { icon: '💡', title: 'Tool Suggestions', email: 'suggest@toolnestin.co.in', desc: 'Have an idea for a tool we should build?' },
          { icon: '💼', title: 'Business & Partnerships', email: 'hello@toolnestin.co.in', desc: 'Advertising, API access, or partnerships.' },
          { icon: '🔒', title: 'Privacy Concerns', email: 'privacy@toolnestin.co.in', desc: 'Questions about data and privacy.' },
        ].map(c => (
          <div key={c.title} className="flex items-start gap-4 pb-5 border-b border-white/5 last:border-0 last:pb-0">
            <span className="text-2xl">{c.icon}</span>
            <div>
              <h2 className="font-600 text-slate-200 mb-0.5">{c.title}</h2>
              <p className="text-slate-500 text-sm mb-1">{c.desc}</p>
              <a href={`mailto:${c.email}`} className="text-brand-400 text-sm hover:underline">{c.email}</a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-slate-600 text-sm mt-8">We typically respond within 24–48 hours on business days.</p>
    </div>
  );
}
