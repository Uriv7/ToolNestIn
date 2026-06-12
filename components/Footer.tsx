import Link from 'next/link';
import { TOOLS } from '@/app/tools/registry';

export default function Footer() {
  const financeTools = ['gst-calculator','emi-calculator','income-tax-calculator','hra-calculator','sip-calculator','nps-calculator'];
  const devTools     = ['json-formatter','base64','url-encoder','password-generator','diff-checker','regex-tester'];
  const textTools    = ['word-counter','case-converter','lorem-ipsum','remove-duplicates','readability-checker'];
  const indiaTools   = ['ifsc-finder','pan-validator','pincode-finder','gst-number-validator','vehicle-registration-info','invoice-generator'];

  return (
    <footer className="border-t border-white/5 mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl" aria-hidden="true">🪺</span>
              <span className="font-display text-xl font-800 gradient-text">ToolNestIn</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              80+ free online tools for India. GST Calculator, EMI Calculator, Income Tax Calculator 2026 and more. No signup. No clutter. Built for India.
            </p>
            <a href="https://twitter.com/toolnestin"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 inline-flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-400/40 transition text-xs font-bold"
              aria-label="ToolNestIn on Twitter">𝕏</a>
          </div>

          {/* Finance Hub */}
          <div>
            <h3 className="text-xs font-700 text-slate-300 uppercase tracking-widest mb-4">🏦 Finance</h3>
            <ul className="space-y-2">
              {financeTools.map(slug => {
                const t = TOOLS.find(x => x.slug === slug);
                return t ? (
                  <li key={slug}>
                    <Link href={`/tools/${slug}`} className="text-sm text-slate-500 hover:text-brand-400 transition">
                      {t.name.split('—')[0].trim()}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>

          {/* Developer Hub */}
          <div>
            <h3 className="text-xs font-700 text-slate-300 uppercase tracking-widest mb-4">⚙️ Developer</h3>
            <ul className="space-y-2">
              {devTools.map(slug => {
                const t = TOOLS.find(x => x.slug === slug);
                return t ? (
                  <li key={slug}>
                    <Link href={`/tools/${slug}`} className="text-sm text-slate-500 hover:text-brand-400 transition">
                      {t.name.split('—')[0].trim()}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>

          {/* India Hub */}
          <div>
            <h3 className="text-xs font-700 text-slate-300 uppercase tracking-widest mb-4">🇮🇳 India</h3>
            <ul className="space-y-2">
              {indiaTools.map(slug => {
                const t = TOOLS.find(x => x.slug === slug);
                return t ? (
                  <li key={slug}>
                    <Link href={`/tools/${slug}`} className="text-sm text-slate-500 hover:text-brand-400 transition">
                      {t.name.split('—')[0].trim()}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>

          {/* Info + Text Hub */}
          <div>
            <h3 className="text-xs font-700 text-slate-300 uppercase tracking-widest mb-4">📝 Text</h3>
            <ul className="space-y-2 mb-6">
              {textTools.map(slug => {
                const t = TOOLS.find(x => x.slug === slug);
                return t ? (
                  <li key={slug}>
                    <Link href={`/tools/${slug}`} className="text-sm text-slate-500 hover:text-brand-400 transition">
                      {t.name.split('—')[0].trim()}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>

            <h3 className="text-xs font-700 text-slate-300 uppercase tracking-widest mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-slate-500 hover:text-brand-400 transition">Guides &amp; Resources</Link></li>
              <li><Link href="/about"   className="text-sm text-slate-500 hover:text-brand-400 transition">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 hover:text-brand-400 transition">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-brand-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms"   className="text-sm text-slate-500 hover:text-brand-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">
              © {new Date().getFullYear()} ToolNestIn (toolnestin.co.in). All rights reserved.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <p className="text-slate-600 text-xs">Made in India 🇮🇳 · Free forever · No data collected</p>
              <Link href="/privacy" className="text-slate-700 text-xs hover:text-slate-500 transition">Privacy</Link>
              <Link href="/terms"   className="text-slate-700 text-xs hover:text-slate-500 transition">Terms</Link>
              <Link href="/contact" className="text-slate-700 text-xs hover:text-slate-500 transition">Contact</Link>
            </div>
          </div>
          {/* AdSense disclosure — required by Google Publisher Policies */}
          <p className="text-slate-700 text-xs text-center mt-4">
            This site displays advertisements via{' '}
            <a href="https://www.google.com/adsense" target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-500 transition underline underline-offset-2">
              Google AdSense
            </a>
            .{' '}
            <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-500 transition underline underline-offset-2">
              How Google uses data
            </a>
            {' '}·{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer"
              className="hover:text-slate-500 transition underline underline-offset-2">
              Opt out of personalised ads
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
