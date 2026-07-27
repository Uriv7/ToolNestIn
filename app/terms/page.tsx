import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service — ToolNestIn',
  description: 'Terms of Service for ToolNestIn. Free to use, no account required. Read our complete terms.',
  alternates: { canonical: 'https://toolnestin.co.in/terms/' },
};

const SECTIONS = [
  {
    h: 'Acceptance of Terms',
    body: 'By accessing and using ToolNestIn (toolnestin.co.in), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website. These terms apply to all visitors, users, and others who access the website.',
  },
  {
    h: 'Description of Service',
    body: 'ToolNestIn provides free online tools including calculators, converters, formatters, and generators. All tools are provided "as is" for informational and convenience purposes. The service is free to use and does not require registration or account creation.',
  },
  {
    h: 'Accuracy of Information',
    body: 'While we strive to ensure all tools produce accurate results, ToolNestIn\'s tools are provided for general informational purposes only. Results from financial calculators (such as Income Tax Calculator, GST Calculator, EMI Calculator, HRA Calculator) should not be relied upon as professional financial, legal, or tax advice. Tax laws and financial regulations change frequently. Always verify results with a qualified professional (CA, financial advisor, or tax consultant) before making financial decisions. ToolNestIn accepts no liability for decisions made based on tool outputs.',
  },
  {
    h: 'Permitted Use',
    body: 'You may use ToolNestIn\'s tools for personal and commercial purposes. You may share links to ToolNestIn tools. You may embed tool links in your own website or application. You may use tool results in your work, reports, or presentations with appropriate verification.',
  },
  {
    h: 'Prohibited Use',
    body: 'You may not: attempt to scrape, crawl, or automate requests to ToolNestIn at a rate that disrupts the service; attempt to reverse-engineer, copy, or replicate ToolNestIn\'s codebase without permission; use ToolNestIn to distribute malware, spam, or illegal content; misrepresent ToolNestIn as your own product; or circumvent any security measures on the website.',
  },
  {
    h: 'Intellectual Property',
    body: 'The ToolNestIn name, logo, and all content on the website are the property of ToolNestIn. The underlying tool logic, design, and code are protected by copyright. You may not reproduce, distribute, or create derivative works without explicit written permission. Tool outputs (calculation results) belong to you and may be used freely.',
  },
  {
    h: 'Advertising',
    body: 'ToolNestIn displays advertisements through Google AdSense. Ads are clearly labelled and placed in designated zones. We are not responsible for the content of third-party advertisements. Clicking on advertisements may direct you to third-party websites governed by their own terms and privacy policies.',
  },
  {
    h: 'Disclaimer of Warranties',
    body: 'ToolNestIn is provided "as is" and "as available" without any warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or free of viruses. We do not warrant the accuracy, completeness, or usefulness of any information provided by our tools.',
  },
  {
    h: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, ToolNestIn shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. This includes but is not limited to financial decisions made based on tool outputs, data loss, or service interruptions.',
  },
  {
    h: 'Third-Party Links',
    body: 'ToolNestIn may contain links to third-party websites (such as government portals, bank websites, or reference resources). These links are provided for convenience only. We have no control over the content of linked sites and accept no responsibility for them. Visiting third-party links is at your own risk.',
  },
  {
    h: 'Changes to Service',
    body: 'We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice. We may add, remove, or modify tools without prior notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the service.',
  },
  {
    h: 'Governing Law',
    body: 'These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of India.',
  },
  {
    h: 'Changes to Terms',
    body: 'We may update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of ToolNestIn after changes constitutes acceptance of the new terms.',
  },
  {
    h: 'Contact',
    body: 'For questions about these Terms of Service, contact us at: legal@toolnestin.co.in',
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-sans text-4xl font-black gradient-text mb-2">Terms of Service</h1>
      <p className="text-slate-500 mb-10 text-sm">Last updated: June 2026 · Effective immediately</p>

      <div className="space-y-5 text-slate-400 leading-relaxed">
        {SECTIONS.map(s => (
          <section key={s.h} className="glass rounded-2xl p-6">
            <h2 className="font-sans text-lg font-bold text-slate-100 mb-3">{s.h}</h2>
            <p className="text-sm">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 flex gap-3 flex-wrap">
        <Link href="/privacy/" className="text-brand-400 text-sm hover:underline">Privacy Policy →</Link>
        <Link href="/contact/" className="text-brand-400 text-sm hover:underline">Contact Us →</Link>
        <Link href="/" className="text-brand-400 text-sm hover:underline">Browse Tools →</Link>
      </div>
    </div>
  );
}
