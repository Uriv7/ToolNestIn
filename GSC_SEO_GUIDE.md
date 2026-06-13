# ToolNestIn — Google Search Console & SEO Guide

## Step 1 — GSC Setup (do today)

1. Go to https://search.google.com/search-console
2. Add property: `https://toolnestin.co.in`
3. Verify ownership: your Google verification meta tag is already in layout.tsx
   `google: '8RrMXVuLOlUdgu-g3tHmzrWUufAnxPtYYRVmUkDS5GA'`
4. Submit sitemap: GSC → Sitemaps → `https://toolnestin.co.in/sitemap.xml`
5. Check Security Issues = "No issues detected"
6. Check Manual Actions = "No issues"

## Step 2 — First week checks

- URL Inspection → inspect `/tools/gst-calculator` → Request Indexing
- Repeat for top 10 tools:
  gst-calculator, income-tax-calculator, emi-calculator, hra-calculator,
  sip-calculator, nps-calculator, ifsc-finder, gratuity-calculator,
  sukanya-calculator, invoice-generator
- Core Web Vitals → aim for all green

## Step 3 — Weekly monitoring (every Monday)

Open GSC → Performance → Search Results → Last 28 days:

### The "position 6–20" filter (biggest SEO lever)
- Click "Queries" tab → Add filter → Position: 6–20
- These pages are ALMOST on page 1
- Fix: stronger H1 with exact keyword, add one more FAQ, get one backlink

### High impressions, low CTR (< 3%)
- Click "Pages" tab → sort by Impressions
- Filter for CTR < 3%
- Fix: rewrite title tag to be more specific and keyword-first

### Sudden position drops
- Compare: Last 28 days vs Previous 28 days
- Any page that dropped >5 positions = investigate immediately

## Title tag formula (already implemented in page.tsx)

```
[Primary Keyword Exact Match] — Free, Instant, No Login | ToolNestIn
```

Example:
- BAD:  "GST Calculator | ToolNestIn" (26 chars, no value prop)
- GOOD: "Gst Calculator India 2026 — Free, Instant, No Login | ToolNestIn" (65 chars)

Aim: 50–60 chars. Primary keyword at position 1. Year signals freshness.

## Meta description formula (already implemented)

```
[What the tool does + specifics]. [Trust signals: free/no login].
```

Aim: 130–155 chars. Include primary keyword naturally.

## H1 formula (already implemented)

H1 = primary keyword (first item in tool's keywords[] array), title-cased.
This ensures exact-match keyword is the first thing Google reads on the page.

## FAQ schema — how to verify it's working

1. Go to: https://search.google.com/test/rich-results
2. Enter: https://toolnestin.co.in/tools/gst-calculator
3. Should show: "FAQPage" and "WebApplication" detected
4. In GSC → Enhancements → FAQ → check for errors

FAQ requirements:
- Minimum 2 Q&As per page ✅ (all tools have 2–3)
- Questions under 300 chars ✅
- Answers factual and helpful ✅

## Important: keywords[] array is NOT rendered to DOM

The keywords array in the registry is ONLY used for:
- generateMetadata() → <meta name="keywords"> in HTML head
- NOT visible as text anywhere on the page

Google ignores meta keywords tag (has since 2009). It does NOT cause keyword stuffing.

## Sitemap priority tiers

High-traffic India tools: priority 1.0 (crawled more frequently)
Other tools: priority 0.9
Static pages: 0.3–1.0

## PWA — "Add to Home Screen"

manifest.json is now included. When a user visits on mobile Chrome:
- Chrome shows "Add to Home Screen" prompt after 2 visits
- App opens like native app (no browser chrome)
- Has shortcuts for GST, EMI, Income Tax, SIP calculators
- This increases return visit rate significantly (DAU boost)

## WhatsApp share — viral loop

Every tool page now has:
1. Per-tool WhatsApp share button (shares the specific tool)
2. Bottom "Share ToolNestIn" button (shares the whole site)
3. Twitter/X share button

Pre-filled message format:
"Free [Tool Name] 🇮🇳 — no login, instant results!
https://toolnestin.co.in/tools/[slug]"

## Organization schema

layout.tsx now includes Organization schema which:
- Builds ToolNestIn as a brand entity in Google Knowledge Graph
- Links to Twitter profile
- Adds contact point information

This helps Google understand ToolNestIn is a legitimate business,
not just a content farm — important for E-E-A-T signals.

## Key metrics to watch in GSC (week by week)

| Week | What to check | Target |
|------|--------------|--------|
| 1 | Pages indexed | All 81 tool pages found |
| 2 | First impressions | 100–500 impressions/day |
| 4 | First clicks | CTR > 1% on any tool |
| 8 | Position trend | Any tool in positions 10–30 |
| 12 | Quick win conversions | 3–5 tools on page 1 |
| 24 | Organic growth | 3,000–8,000 DAU from organic |

## The 10 queries to track from day 1

Add these to your GSC "Saved filters":
1. gst calculator india 2026
2. income tax calculator 2026
3. hra calculator india
4. emi calculator
5. sip calculator india
6. ifsc finder
7. gratuity calculator india
8. sukanya samriddhi calculator 2026
9. free gst invoice generator india
10. vehicle registration number decoder india

Numbers 9 and 10 have near-zero competition — expect page 1 within 30–45 days.
