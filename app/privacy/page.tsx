import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — ToolNestIn',
  description: 'ToolNestIn privacy policy. We collect no personal data. All tools run entirely in your browser. Read our complete data policy.',
  alternates: { canonical: 'https://toolnestin.co.in/privacy/' },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-sans text-4xl font-black gradient-text mb-2">Privacy Policy</h1>
      <p className="text-slate-500 mb-10 text-sm">Last updated: June 2026 · Effective immediately</p>

      <div className="space-y-6 text-slate-400 leading-relaxed">

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Overview</h2>
          <p className="mb-3">
            ToolNestIn (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates toolnestin.co.in. This Privacy Policy explains
            how we handle information when you use our website and tools. The short version:
            we collect almost nothing, and what little we do collect is standard web infrastructure
            data handled by Google (Analytics and AdSense), not us.
          </p>
          <p>
            All tools on ToolNestIn — including every calculator, converter, formatter, and generator —
            run entirely within your web browser using JavaScript. No input data you enter into any tool
            is ever transmitted to our servers, because we do not have servers processing your inputs.
            Your financial figures, passwords, documents, and personal details stay on your device.
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Information We Do Not Collect</h2>
          <p className="mb-3">We explicitly do not collect:</p>
          <ul className="space-y-2 text-sm">
            {[
              'Any inputs you enter into our tools (salary, loan amount, tax figures, passwords, JSON data, etc.)',
              'Your name, email address, phone number, or any personally identifiable information',
              'Your location beyond what is standard in server access logs (IP address, which is anonymised)',
              'Payment information of any kind — all tools are free and we have no payment system',
              'Device fingerprints or cross-site tracking identifiers',
            ].map(item => (
              <li key={item} className="flex gap-2 items-start">
                <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Information That Is Collected Automatically</h2>
          <p className="mb-3">
            When you visit any website, your browser automatically sends certain information to the web server.
            This includes your IP address, browser type, device type, referring URL, and the pages you visit.
            This is standard for all websites on the internet and is not unique to ToolNestIn.
          </p>
          <p>
            We use Google Analytics (GA4) to understand aggregate usage patterns — which tools are most
            popular, which pages load slowly, and how users navigate the site. Google Analytics uses
            cookies and may collect your IP address, which Google anonymises before storage.
            We do not have access to individual user sessions — only aggregate statistics.
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Cookies</h2>
          <p className="mb-3">
            ToolNestIn uses the following types of cookies:
          </p>
          <div className="space-y-3 text-sm">
            <div className="bg-white/3 rounded-xl p-4">
              <div className="font-semibold text-slate-200 mb-1">Google AdSense Cookies</div>
              <div>We display advertisements through Google AdSense. Google uses cookies to serve ads
              relevant to your interests, based on your browsing history across sites that partner with Google.
              These are third-party cookies set by Google, not ToolNestIn. You can opt out via
              Google&apos;s <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">Ad Settings</a>.</div>
            </div>
            <div className="bg-white/3 rounded-xl p-4">
              <div className="font-semibold text-slate-200 mb-1">Google Analytics Cookies</div>
              <div>Google Analytics sets cookies (_ga, _gid) to distinguish users for aggregate reporting.
              These cookies do not contain personally identifiable information. They expire after 2 years (_ga)
              and 24 hours (_gid).</div>
            </div>
            <div className="bg-white/3 rounded-xl p-4">
              <div className="font-semibold text-slate-200 mb-1">No First-Party Cookies</div>
              <div>ToolNestIn itself does not set any first-party cookies. We do not use session cookies,
              authentication cookies, or preference cookies of our own.</div>
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Google AdSense & Advertising</h2>
          <p className="mb-3">
            ToolNestIn participates in the Google AdSense programme to display advertisements.
            Google, as a third-party vendor, uses cookies to serve ads based on your prior visits
            to this website and other websites on the internet.
          </p>
          <p className="mb-3">
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to you
            based on your visit to ToolNestIn and/or other sites on the internet. You may opt out of
            personalised advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">www.aboutads.info</a>.
          </p>
          <p>
            We follow Google&apos;s publisher policies strictly. Ads are clearly labelled as &quot;Advertisement&quot;,
            placed only in designated ad zones, and never placed between a user and a tool result.
            We do not use pop-up ads, auto-play video ads, or interstitial ads.
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Third-Party Services</h2>
          <div className="space-y-3 text-sm">
            {[
              { name: 'Google Analytics', purpose: 'Aggregate usage statistics', policy: 'https://policies.google.com/privacy' },
              { name: 'Google AdSense', purpose: 'Non-intrusive advertising', policy: 'https://policies.google.com/privacy' },
              { name: 'Exchange Rate API (exchangerate-api.com)', purpose: 'Live currency rates for the Currency Converter tool only', policy: 'https://www.exchangerate-api.com/docs/terms' },
              { name: 'IP API (ipapi.co)', purpose: 'IP geolocation for the IP Lookup tool only — only called when you explicitly use that tool', policy: 'https://ipapi.co/privacy/' },
            ].map(s => (
              <div key={s.name} className="bg-white/3 rounded-xl p-4">
                <div className="font-semibold text-slate-200 mb-1">{s.name}</div>
                <div className="text-slate-400 mb-1">{s.purpose}</div>
                <a href={s.policy} target="_blank" rel="noopener noreferrer" className="text-brand-400 text-xs hover:underline">Privacy Policy →</a>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Children&apos;s Privacy</h2>
          <p>
            ToolNestIn does not knowingly collect any information from children under the age of 13.
            Our tools are intended for use by adults and older teenagers. If you believe your child
            has provided personal information through our site, please contact us at
            privacy@toolnestin.co.in and we will take appropriate action.
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Data Security</h2>
          <p>
            Because ToolNestIn does not collect or store personal data, there is no user data at risk
            in the event of a security breach. All tool computations occur client-side. Our website
            is served over HTTPS (TLS) to protect data in transit. We do not maintain user databases,
            user accounts, or stored inputs of any kind.
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Your Rights</h2>
          <p className="mb-3">
            Under India&apos;s Digital Personal Data Protection Act (DPDPA) 2023 and applicable privacy laws,
            you have the right to:
          </p>
          <ul className="space-y-1 text-sm">
            {[
              'Know what personal data we hold about you (we hold none)',
              'Request correction or deletion of your data (there is none to delete)',
              'Opt out of personalised advertising via Google Ad Settings',
              'Withdraw consent for analytics cookies via your browser settings',
            ].map(r => (
              <li key={r} className="flex gap-2"><span className="text-brand-400 shrink-0">→</span>{r}</li>
            ))}
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page
            with an updated &quot;Last updated&quot; date. We encourage you to review this policy periodically.
            Continued use of ToolNestIn after any changes constitutes your acceptance of the updated policy.
          </p>
        </section>


        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">GDPR and International Visitors</h2>
          <p className="text-sm mb-3">
            ToolNestIn is designed primarily for users in India. If you are accessing the site from the
            European Union, United Kingdom, or European Economic Area (EEA), please note that Google
            AdSense requires a consent management platform (CMP) to display personalised advertisements
            to users in these regions under the General Data Protection Regulation (GDPR).
          </p>
          <p className="text-sm mb-3">
            Currently, ToolNestIn receives minimal traffic from the EU/EEA. If you are an EU/EEA visitor,
            you may see non-personalised ads. We are monitoring this and will implement a full GDPR
            consent banner (using Google Funding Choices) if EU/EEA traffic becomes significant.
          </p>
          <p className="text-sm">
            EU/EEA users may contact us at privacy@toolnestin.co.in to exercise their rights under GDPR,
            including the right to access, rectify, or erase personal data (noting that we hold no
            personal data beyond what Google Analytics and AdSense collect as described above).
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Financial and Health Tool Disclaimer</h2>
          <p className="text-sm mb-3">
            ToolNestIn provides calculators for financial topics (income tax, GST, EMI, HRA, SIP, NPS,
            capital gains, gratuity) and health topics (BMI, calorie intake, pregnancy weight gain).
            These tools are provided for <strong>informational and estimation purposes only</strong>.
          </p>
          <p className="text-sm mb-3">
            Results from financial calculators should not be construed as professional financial, tax,
            or legal advice. Indian tax laws, GST rates, and financial regulations change frequently.
            Always verify results with a qualified Chartered Accountant (CA), SEBI-registered financial
            advisor, or tax professional before making financial decisions.
          </p>
          <p className="text-sm">
            Results from health calculators are general estimates based on standard formulas and should
            not replace advice from a qualified medical professional. Consult a doctor or registered
            dietitian for personalised health guidance.
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-sans text-xl font-bold text-slate-100 mb-3">Contact</h2>
          <p className="mb-3">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="text-sm space-y-1">
            <div><span className="text-slate-300 font-semibold">Email:</span> <a href="mailto:privacy@toolnestin.co.in" className="text-brand-400 hover:underline">privacy@toolnestin.co.in</a></div>
            <div><span className="text-slate-300 font-semibold">Website:</span> <Link href="/" className="text-brand-400 hover:underline">toolnestin.co.in</Link></div>
          </div>
        </section>

      </div>
    </div>
  );
}
