import { MetadataRoute } from 'next';
import { TOOLS } from './tools/registry';

// High-traffic India tools get priority 1.0 — Google crawls these more frequently
const HIGH_PRIORITY_SLUGS = new Set([
  'gst-calculator',
  'income-tax-calculator',
  'emi-calculator',
  'sip-calculator',
  'hra-calculator',
  'ctc-calculator',
  'ifsc-finder',
  'nps-calculator',
  'ppf-calculator',
  'fd-calculator',
  'rd-calculator',
  'gratuity-calculator',
  'sukanya-calculator',
  'capital-gains-calculator',
  'bmi-calculator',
  'invoice-generator',
  'gst-number-validator',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://toolnestin.co.in';
  const now  = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base + '/',                lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/blog/`,     lastModified: now, changeFrequency: 'weekly'  as const, priority: 0.8 },
    { url: `${base}/about/`,     lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/privacy/`,   lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/contact/`,   lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms/`,     lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const toolPages: MetadataRoute.Sitemap = TOOLS.map(tool => ({
    url: `${base}/tools/${tool.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    // High-priority India-specific tools rank higher in the sitemap
    priority: HIGH_PRIORITY_SLUGS.has(tool.slug) ? 1.0 : 0.9,
  }));

  const BLOG_SLUGS = ['how-to-calculate-gst-india','old-vs-new-tax-regime-2026','emi-calculation-guide-india','sip-vs-lumpsum-india','hra-exemption-guide','nps-vs-ppf-india'];
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => ({
    url: `${base}/blog/${slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [...staticPages, ...blogPages, ...toolPages];
}
