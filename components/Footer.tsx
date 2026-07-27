import Link from 'next/link';
import Logo from '@/components/Logo';
import { TOOLS } from '@/app/tools/registry';

const LINK_GROUPS = [
  {
    label: 'Finance Tools',
    links: ['gst-calculator','income-tax-calculator','emi-calculator','hra-calculator','sip-calculator','nps-calculator','gratuity-calculator','rd-calculator'],
  },
  {
    label: 'Developer Tools',
    links: ['json-formatter','base64','url-encoder','diff-checker','regex-tester','jwt-decoder','xml-formatter','cron-expression-generator'],
  },
  {
    label: 'India Tools',
    links: ['ifsc-finder','pan-validator','pincode-finder','gst-number-validator','vehicle-registration-info','invoice-generator'],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#060b12' }} role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo size={32} showWordmark={true} />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              {TOOLS.length}+ free online tools for India. GST, EMI, Income Tax, SIP and more. No signup. No clutter.
            </p>
            <div className="flex gap-2">
              <a href="https://twitter.com/toolnestin" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 hover:text-blue-400 transition"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                aria-label="ToolNestIn on Twitter">𝕏</a>
            </div>
          </div>

          {/* Tool groups */}
          {LINK_GROUPS.map(group => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>{group.label}</h3>
              <ul className="space-y-2.5">
                {group.links.map(slug => {
                  const t = TOOLS.find(x => x.slug === slug);
                  return t ? (
                    <li key={slug}>
                      <Link href={`/tools/${slug}/`} className="text-sm text-slate-500 hover:text-slate-300 transition">
                        {t.name.split('—')[0].trim()}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          ))}

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#64748b' }}>Company</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/about/',   label: 'About Us' },
                { href: '/blog/',    label: 'Guides' },
                { href: '/contact/', label: 'Contact' },
                { href: '/privacy/', label: 'Privacy Policy' },
                { href: '/terms/',   label: 'Terms of Service' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-slate-300 transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="pt-7 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} ToolNestIn · toolnestin.co.in · All rights reserved</p>
            <p className="text-xs text-slate-600">Made with ❤️ in India 🇮🇳 · Free forever · Zero data collected</p>
          </div>
          {/* AdSense disclosure — required by Google Publisher Policies */}
          <p className="text-xs text-slate-700 text-center">
            This site displays ads via{' '}
            <a href="https://www.google.com/adsense" target="_blank" rel="noopener noreferrer" className="hover:text-slate-500 underline underline-offset-2 transition">Google AdSense</a>
            {' · '}
            <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-500 underline underline-offset-2 transition">How Google uses data</a>
            {' · '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-500 underline underline-offset-2 transition">Opt out</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
