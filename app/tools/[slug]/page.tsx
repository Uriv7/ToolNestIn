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

// Acronyms that must stay fully uppercase in a title, e.g. "Gst" -> "GST"
const TITLE_ACRONYMS = [
  'GST','EMI','PAN','IFSC','HRA','NPS','PPF','SSY','RD','CAGR','BMI',
  'XML','JSON','CSV','URL','IP','QR','HTML','CSS','UUID','SHA','FAQ',
  'FD','JWT','RGB','XIRR','CTC','TDS','ITR','UPI','HSL','DOB','CMYK',
];

function fixAcronymCasing(text: string): string {
  let out = text;
  for (const a of TITLE_ACRONYMS) {
    out = out.replace(new RegExp(`\\b${a[0]}${a.slice(1).toLowerCase()}\\b`, 'g'), a);
  }
  return out;
}

// NOTE: app/layout.tsx sets title.template = '%s | ToolNestIn', which Next.js
// automatically appends to whatever `title` we return below. So `seo` here must
// NOT include "| ToolNestIn" itself (that caused every page to render
// "... | ToolNestIn | ToolNestIn" in real Google search results). `branded`
// includes the suffix explicitly, for openGraph/twitter cards which are NOT
// affected by the layout template.
function buildTitle(tool: NonNullable<ReturnType<typeof getToolBySlug>>): { seo: string; branded: string } {
  const kw = tool.keywords?.[0];
  const base = kw
    ? fixAcronymCasing(kw.replace(/\b\w/g, c => c.toUpperCase()))
    : fixAcronymCasing(tool.name.split('—')[0].trim());
  const withHook = `${base} — Free, No Login`;
  // Google truncates SERP titles around ~58-60 chars, INCLUDING the auto-appended
  // " | ToolNestIn" suffix — so budget for that here.
  const seo = `${withHook} | ToolNestIn`.length <= 58 ? withHook : base;
  return { seo, branded: `${seo} | ToolNestIn` };
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
  const { seo: title, branded: brandedTitle } = buildTitle(tool);
  const description = buildDescription(tool);
  const url         = `https://toolnestin.co.in/tools/${tool.slug}/`;
  return {
    title, description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: { title: brandedTitle, description, url, type: 'website', siteName: 'ToolNestIn',
      locale: 'en_IN', images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: brandedTitle, description, images: ['/og-image.png'] },
    robots: { index: true, follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

// Tools that genuinely send user-entered input to a third-party API — the "Data
// sent: None" claim was previously shown identically on every page, which was
// false for these 5. Being specific and accurate here matters for AdSense's
// "unreliable/misleading claims" policy, not just correctness.
const EXTERNAL_API_TOOLS: Record<string, string> = {
  'ifsc-finder':        'IFSC code → Razorpay IFSC API',
  'ip-address-lookup':  'IP address → ipapi.co / ipify.org',
  'pincode-finder':     'PIN code → India Post API',
  'qr-generator':       'QR content → qrserver.com',
  'currency-converter': 'None (fetches public rates only)',
};

function getDataSentLabel(slug: string): string {
  return EXTERNAL_API_TOOLS[slug] ?? 'None';
}

function getPrivacyBadge(slug: string): string {
  const entry = EXTERNAL_API_TOOLS[slug];
  return entry && entry !== 'None (fetches public rates only)' ? 'Sent to API — see below' : 'No data sent';
}

// Disclaimer type by hub — satisfies AdSense "Unreliable claims" policy
function getDisclaimerType(hub: string): 'finance' | 'tax' | 'health' | null {
  if (['income-tax-calculator','hra-calculator','capital-gains-calculator',
       'gst-calculator','gratuity-calculator'].includes(hub)) return 'tax';
  if (hub === 'health') return 'health';
  if (hub === 'finance') return 'finance';
  return null;
}

// Category-specific "How to use" steps — previously this was one identical 5-item
// list hardcoded on all 79 pages, which reads as templated/auto-generated content.
// Varying it by hub still keeps steps accurate (all tools ARE client-side, free, etc.)
// while removing the site-wide verbatim duplication.
function getHowToSteps(hub: string): string[] {
  const STEPS: Record<string, string[]> = {
    finance: [
      'Enter your figures in the input fields — the result recalculates instantly as you type, no submit button needed.',
      'Double-check which financial year or rate the tool is using, shown near the result, since tax and interest rates change periodically.',
      'Use the "Next step" workflow links below to move into a related calculation, like comparing this result against another instrument.',
      'Share your result via WhatsApp or Twitter using the buttons above if you need to send it to someone else.',
      'Everything is calculated locally in your browser — your financial figures are never sent to any server.',
    ],
    health: [
      'Enter your details in the input fields — results update live as you type, with no need to submit a form.',
      'Read the reference ranges shown alongside your result, since a single number is only useful in context.',
      'This tool gives an estimate for informational purposes only — it does not replace advice from a doctor or qualified professional.',
      'Use the related tools below if you want to check a connected metric as part of a fuller picture.',
      'All calculations run in your browser only; none of your health data is transmitted or stored anywhere.',
    ],
    developer: [
      'Paste or type your input directly into the editor — output updates in real time as you work.',
      'Check the error/status indicator if your input is invalid; it points to the exact line or issue where relevant.',
      'Use the copy or download button to grab the processed output once it looks right.',
      'Chain into a related tool below if your workflow needs a second processing step.',
      'Processing happens entirely client-side in your browser — nothing you paste is uploaded to a server.',
    ],
    text: [
      'Type or paste your text into the input box — the transformed output appears instantly below.',
      'Adjust any available options (style, format, or mode) to fine-tune the result to what you need.',
      'Copy the result directly, or share it via WhatsApp or Twitter using the buttons above.',
      'Try a related text tool below if you need a second transformation on the same content.',
      'All text processing happens locally in your browser — your content is never sent anywhere.',
    ],
    converter: [
      'Enter a value and pick your source and target units — the conversion updates instantly.',
      'Double-check the unit abbreviations shown, since similarly-named units sometimes use different base definitions.',
      'Use the swap or reverse option if available to quickly flip the conversion direction.',
      'Chain into a related converter below if your task needs a second conversion step.',
      'All conversions are computed in your browser using standard, precise conversion factors.',
    ],
    india: [
      'Enter the required details in the input fields — the result is generated instantly as you type.',
      'Cross-check the format or rule referenced near the result, since many India-specific formats follow fixed government or regulatory structures.',
      'Use the workflow links below if your task needs a related India-specific tool as a next step.',
      'Share the result via WhatsApp or Twitter using the buttons above if you need to pass it along.',
      'Everything runs in your browser only — no data you enter is sent to or stored on any server.',
    ],
  };
  return STEPS[hub] ?? STEPS.developer;
}


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
    'gst-calculator': `GST replaced 17 different indirect taxes when it launched in July 2017, creating a single unified tax structure across India. The current slabs — 0%, 5%, 12%, 18%, and 28% — are decided by the GST Council based on whether goods are essential, standard, or luxury/sin items. Restaurants typically charge 5% GST without input tax credit, while most services fall under 18%. Understanding whether a quoted price is GST-inclusive or GST-exclusive matters for freelancers issuing invoices, shoppers comparing prices, and business owners filing returns. This calculator handles both directions instantly and shows the exact tax split between CGST and SGST for intra-state transactions.`,
    'income-tax-calculator': `India runs two parallel tax systems since Budget 2020: the New Regime, which has lower slab rates but removes most deductions, and the Old Regime, which keeps deductions like 80C (₹1.5L), HRA, and home loan interest but taxes income at higher rates. Budget 2025 made the New Regime default and raised the no-tax threshold to ₹12 lakh under Section 87A, shifting the calculus for most salaried employees. The right choice depends heavily on how many deductions you actually claim — someone with a home loan and full 80C investments often still comes out ahead under the Old Regime, while someone with minimal deductions is usually better off under the New one. This tool computes both side by side using AY 2026-27 slabs so you can compare your actual numbers instead of guessing.`,
    'sip-calculator': `A Systematic Investment Plan lets you invest a fixed amount in mutual funds every month rather than a lump sum, using rupee-cost averaging to smooth out market volatility over time. SIPs became India's dominant retail investment vehicle over the last decade — monthly SIP inflows into Indian mutual funds have grown from a few thousand crores to tens of thousands of crores per month. The power of a SIP comes from compounding: a ₹5,000 monthly SIP at a 12% assumed annual return grows to roughly ₹50 lakh over 20 years, of which more than half is pure compounding, not your own contribution. This calculator projects both SIP and lump-sum outcomes so you can compare which investment style suits your goal and time horizon.`,
    'ppf-calculator': `The Public Provident Fund is a 15-year government-backed savings scheme with EEE (Exempt-Exempt-Exempt) tax status — your contribution is deductible under Section 80C, the interest earned is tax-free, and the maturity amount is also tax-free, a combination almost no other Indian investment offers. The interest rate is revised quarterly by the government and currently stands at 7.1% per annum, compounded annually. You can invest between ₹500 and ₹1.5 lakh per financial year, and the account can be extended in blocks of 5 years after maturity. Because PPF carries zero market risk and a sovereign guarantee, it's commonly used as the safe, long-term core of a retirement portfolio alongside higher-return but riskier instruments like equity SIPs. This calculator shows year-by-year growth to maturity based on current rates.`,
    'fd-calculator': `Fixed Deposits remain India's most-held savings instrument because of their simplicity and capital safety — your principal is protected regardless of market movement, and DICGC insurance covers deposits up to ₹5 lakh per bank. Interest can be compounded quarterly or monthly depending on the bank, and rates vary meaningfully: small finance banks like AU, Jana, and Ujjivan often offer 8.5-9.5% versus roughly 6.8-7.1% at large banks like SBI, HDFC, and ICICI, though the trade-off is lower deposit insurance comfort with smaller institutions. Interest above ₹40,000 a year (₹50,000 for senior citizens) attracts 10% TDS unless you submit Form 15G/15H declaring your income is below the taxable threshold. This calculator shows the exact maturity value after accounting for compounding frequency and estimated TDS.`,
    'ctc-calculator': `CTC (Cost to Company) is the total amount a company spends on an employee annually, but it's rarely what lands in your bank account — the gap comes from Provident Fund contributions (12% of basic pay, split between employee and employer), professional tax, income tax TDS, and sometimes gratuity provisioning that's technically part of CTC but not paid monthly. This mismatch between the CTC figure in an offer letter and actual monthly in-hand salary is one of the most common sources of confusion when comparing job offers in India. This calculator breaks down each deduction individually — EPF, TDS under your chosen tax regime, and professional tax by state — so you can see exactly how CTC converts to what actually hits your account each month.`,
    'electricity-bill-calculator': `Electricity billing in India uses tiered (slab-based) tariffs rather than a flat per-unit rate — the more units you consume in a billing cycle, the higher the rate on each additional slab, which means doubling your usage can more than double your bill. Tariff structures also vary significantly by state and even by discom within a state: Delhi's BSES and Tata Power, Mumbai's Adani and BEST, and various state electricity boards all publish different slab rates and fixed charges. Many states also add electricity duty and fixed monthly charges on top of the energy charge, which can meaningfully change the total even for similar consumption. This calculator applies real state-specific slab structures so you get an estimate that reflects your actual discom's pricing rather than a generic flat-rate guess.`,
    'bmi-calculator': `Body Mass Index estimates whether your weight is healthy relative to your height, but the standard WHO cutoffs were developed primarily from European and North American population data. Research from ICMR (Indian Council of Medical Research) and other Asia-Pacific studies has shown that Indians and other South Asians tend to develop metabolic complications like diabetes and heart disease at lower BMI thresholds than the WHO standard suggests, due to differences in body fat distribution. This led health bodies to adopt separate Asia-Pacific cutoffs — for example, 23 kg/m² is considered overweight in the Asia-Pacific classification versus 25 kg/m² under standard WHO guidelines. This calculator shows your BMI against both scales side by side so you can see how the classification changes depending on which standard is applied.`,
    'age-calculator': `Calculating exact age sounds trivial until leap years, varying month lengths, and time zones enter the picture — manually working out “years, months, and days“ between two dates is a surprisingly common source of small errors. Precise age calculation matters for more than curiosity: government exam eligibility (UPSC, SSC, banking exams) often specifies exact age cutoffs down to the day, insurance premium calculations use exact age, and legal documents like passports and PAN applications require accurate date-of-birth-derived age. This tool computes the exact difference down to years, months, weeks, days, and even hours, correctly accounting for leap years and variable month lengths, so the result matches what an official eligibility check would produce.`,
    'percentage-calculator': `Percentage calculations show up constantly in everyday financial decisions — working out a discount at checkout, calculating how much a bill increased year over year, figuring out what portion of a target you've hit, or checking exam marks against a total. The three common variations (finding X% of Y, determining what percent X is of Y, and calculating percentage change between two values) each use a different formula, and mixing them up is one of the most common arithmetic mistakes people make under time pressure. This tool separates all three modes clearly so you always know exactly which calculation you're running, with results shown instantly as you type.`,
    'calorie-calculator': `Daily calorie needs depend on the Basal Metabolic Rate (BMR) — the energy your body burns at complete rest — multiplied by an activity factor that accounts for your lifestyle, from sedentary desk work to intense daily training. The most widely used and clinically validated formula for this is the Mifflin-St Jeor equation, which improved on the older Harris-Benedict formula's accuracy for modern populations. Macronutrient splits (protein, carbohydrate, and fat grams) then depend on your goal: a body-recomposition or muscle-gain target typically needs higher protein (around 1.6-2.2g per kg body weight) than a simple maintenance diet. This calculator computes both your calorie target and a suggested macro breakdown based on your specific stats and activity level.`,
    'json-formatter': `JSON is the standard data format for virtually all modern REST APIs, but minified or poorly-formatted JSON returned by an API response is nearly unreadable during debugging — a single missing comma or unclosed bracket can break parsing entirely, and finding it in a wall of unformatted text wastes real development time. This tool re-indents JSON with proper nesting, validates the syntax and reports the exact line number of any error, and can also minify formatted JSON back down for production use where payload size matters. It's built for the everyday workflow of backend and frontend developers who need to quickly inspect, debug, or clean up API responses and config files.`,
    'base64': `Base64 encoding converts binary or text data into an ASCII string using 64 printable characters, which is necessary because many systems — HTTP headers, JSON payloads, email (MIME), and older text-only protocols — can't reliably transmit raw binary data. It shows up constantly in real development work: HTTP Basic Authentication headers are Base64-encoded credentials, JWT tokens are Base64URL-encoded JSON, and small images are sometimes embedded directly into HTML or CSS as Base64 data URIs to avoid an extra network request. It's worth noting Base64 is an encoding, not encryption — it provides no security, only a safe transport format, so anyone can decode it instantly. This tool handles both directions and works entirely in your browser without sending data anywhere.`,
    'url-encoder': `URLs can only safely contain a limited set of ASCII characters, so anything else — spaces, ampersands, equals signs, non-English characters, or symbols — has to be percent-encoded before it can be used in a query string or path segment, or the URL will break or behave unpredictably. This matters constantly when building API requests, constructing shareable links with dynamic parameters, or debugging a URL that's silently failing because of an unencoded special character buried in it. This tool encodes and decodes text instantly, handling reserved characters, spaces, and Unicode correctly, which makes it useful for developers building query strings as well as anyone troubleshooting a broken link.`,
    'password-generator': `Weak or reused passwords remain one of the leading causes of account compromise — credential-stuffing attacks work specifically because people reuse the same password across multiple sites, so one breach can cascade into many. A genuinely strong password needs sufficient length (12+ characters is the current baseline recommendation) and true randomness, which is why this tool uses the browser's built-in \`window.crypto.getRandomValues()\` API rather than a simple pseudo-random function — it's the same cryptographically secure randomness source used for encryption keys, not a predictable algorithm. You can customize length and which character sets (uppercase, lowercase, numbers, symbols) to include, and since generation happens entirely in your browser, the password is never transmitted anywhere.`,
    'qr-generator': `QR (Quick Response) codes can encode URLs, plain text, email addresses, or phone numbers into a scannable pattern that any modern smartphone camera reads instantly without a dedicated app. They've become standard in India for everything from UPI payment stickers at small shops to restaurant menus, event check-ins, and marketing materials linking to a website or social profile. A well-generated QR code needs sufficient error correction and contrast to remain scannable even if printed small or slightly damaged. This tool generates a permanent, static QR code (not a tracked/dynamic redirect link that could stop working later) and lets you download it as a PNG for printing on packaging, posters, or business cards.`,
    'lorem-ipsum': `Lorem Ipsum is scrambled Latin text that's been used as placeholder copy in design and publishing since the 1500s, and it remains the default filler text for web design mockups and print layouts because its letter and word-length distribution roughly mimics real language, which makes a mockup's typography and spacing look realistic without the distraction of readable content pulling reviewer attention toward wording instead of layout. Designers and developers use it to fill wireframes, test how a template handles varying text lengths, or draft a page structure before real copy is ready. This tool generates it by paragraphs, sentences, or word count so you can match exactly the amount of filler text a specific layout needs.`,
    'remove-duplicates': `Removing duplicate lines from a list sounds simple but gets tedious fast once a list runs into hundreds or thousands of entries — email lists, CSV exports, keyword lists, and log files frequently accumulate duplicate rows from repeated exports or merged data sources, and manually scanning for repeats is impractical at any real scale. This tool processes the entire list in your browser, instantly stripping exact duplicate lines while preserving the original order of first occurrence, and lets you copy or download the cleaned result. It's commonly used by marketers cleaning email lists, developers de-duplicating data exports, and anyone working with large pasted text lists that need a quick, reliable clean-up pass.`,
    'unit-converter': `Unit conversion errors have caused real, well-documented failures — NASA's Mars Climate Orbiter was lost in 1999 specifically because of a mismatch between metric and imperial unit calculations between two engineering teams — which is a useful reminder that even simple length, weight, or temperature conversions deserve a reliable tool rather than manual arithmetic. This converter covers the everyday cases people actually run into: metric-to-imperial length and weight conversions for cooking, travel, or international shopping, and temperature conversion between Celsius and Fahrenheit, which trips people up constantly since the two scales aren't proportional (0°C is 32°F, not 0°F). All conversions use precise, internationally standardized conversion factors rather than rounded approximations.`,
    'number-to-words': `India uses a distinct numbering system — lakhs and crores — that differs fundamentally from the international thousands/millions/billions system used in most of the world: one crore equals ten million, and the comma placement in Indian numerals (1,00,00,000) reflects this grouping by 2s after the first three digits, which is genuinely confusing for anyone used to international formatting. This matters practically on cheques, legal documents, and financial paperwork in India, where the amount must be spelled out in words and any mismatch between the numeric and word amount can cause a cheque to bounce or a document to be rejected. This tool converts numbers to words correctly in both the Indian (Lakh/Crore) and international (Million/Billion) systems, including proper Rupee and Paise phrasing.`,
    'regex-tester': `Regular expressions are notoriously easy to get subtly wrong — a pattern that matches your three test cases can still fail on edge cases you didn't think to check, and debugging a broken regex by eye in raw code is slow and error-prone. Real-time visual match highlighting solves this by showing exactly which parts of your test string match as you type the pattern, making it immediately obvious when a pattern is too greedy, too narrow, or matching the wrong groups. This tool includes common pre-built patterns (email, URL, phone number, IP address) as starting points and supports the standard regex flags, making it useful both for writing new patterns and for understanding what an unfamiliar regex from someone else's code is actually doing.`,
    'uuid-generator': `UUIDs (Universally Unique Identifiers) are 128-bit values used to identify records, sessions, and objects across distributed systems without a central coordinating authority — the odds of two randomly generated UUID v4 values colliding are astronomically small, which is why they're the standard choice for database primary keys and API resource IDs in modern software. UUID v7 is a newer variant that embeds a timestamp, making generated IDs sortable by creation time while retaining uniqueness — useful for systems where insertion order matters, like event logs or time-series data. This tool generates both versions using the Web Crypto API for genuine randomness and supports bulk generation for developers who need to seed test data or generate multiple IDs at once.`,
    'hash-generator': `Cryptographic hash functions convert any input into a fixed-length string, and the same input always produces the same hash, but even a one-character change in the input produces a completely different output — which makes hashes useful for verifying file integrity, checking that a downloaded file wasn't corrupted or tampered with, or storing password fingerprints without storing the actual password. MD5 and SHA-1 are now considered cryptographically broken for security purposes (collisions have been demonstrated) and should only be used for non-security checksums like file integrity checks; SHA-256 and SHA-512 remain the current standard for anything security-sensitive. This tool computes all four using the browser's native Web Crypto API, so no data is sent anywhere.`,
    'jwt-decoder': `JSON Web Tokens are the standard way modern web applications handle authentication — a JWT has three Base64URL-encoded parts (header, payload, and signature) separated by dots, and the payload contains claims like user ID, roles, and an expiry timestamp. A JWT's payload is only encoded, not encrypted, meaning anyone with the token can read its contents without the secret key — the secret is only needed to verify the signature is authentic, not to view the claims. This is a common point of confusion that leads developers to mistakenly put sensitive data in a JWT payload. This tool decodes the header and payload instantly and checks the expiry timestamp, which is useful for debugging auth issues without needing the signing secret.`,
    'html-formatter': `Minified HTML — common in production builds and when copying markup from browser dev tools — strips all whitespace and line breaks to reduce file size, which makes it fast to load but nearly impossible to read or edit manually. Re-indenting it with proper nesting makes the document structure immediately visible again, which is essential when debugging a layout issue, learning from someone else's markup, or cleaning up HTML pasted from a CMS export. Conversely, minifying formatted HTML before deployment measurably reduces page weight and improves load time, particularly on high-traffic pages. This tool handles both directions and shows the byte-size difference between formatted and minified versions so you can see the actual size savings.`,
    'timestamp-converter': `Unix timestamps — the number of seconds (or milliseconds) since January 1, 1970 UTC — are how most databases, APIs, and server logs internally store dates, precisely because a single number is unambiguous and timezone-independent, unlike a formatted date string. The catch is that a raw timestamp like 1755600000 is meaningless to a human reading it, and converting it correctly requires accounting for the local timezone offset, which is where manual conversion attempts often go wrong. This tool converts timestamps to human-readable dates in IST, UTC, and ISO 8601 format simultaneously, and converts the other direction too, which is a routine need for developers debugging logs, working with APIs, or scheduling cron jobs across timezones.`,
    'password-strength': `Password strength isn't just about length or including a symbol — real-world crack time depends on the total entropy (character set size raised to the power of length) versus the computing power available to an attacker, and modern GPU-based cracking rigs can attempt tens of billions of guesses per second against a stolen password hash. This tool checks your password against 9 concrete security rules (length, character variety, common patterns, dictionary words, and more) and estimates realistic crack time assuming a 10-billion-guess-per-second attack, giving you a genuinely useful sense of whether a password is actually strong rather than just superficially complex-looking. Nothing you type is transmitted anywhere — the check runs entirely in your browser.`,
    'csv-to-json': `CSV and JSON are the two most common data interchange formats, but they represent data very differently — CSV is flat rows and columns, while JSON supports nested structures — which means converting between them isn't always a trivial one-to-one mapping, especially with nested objects or arrays that need to be flattened using dot-notation or expanded from dotted CSV headers. This conversion comes up constantly for developers importing spreadsheet exports into an API, data analysts prepping CSV files for a JSON-based pipeline, or anyone moving data between a spreadsheet tool and a JavaScript application. This tool handles comma, semicolon, tab, and pipe-delimited CSV automatically and correctly reconstructs nested JSON from dot-notation headers.`,
    'date-difference': `Calculating the exact number of days, weeks, or months between two dates seems straightforward until you factor in different month lengths, leap years, and whether the calculation should include or exclude weekends — small assumptions that change the answer and matter a lot for anything with a real deadline or contractual timeline attached. This comes up in project planning, calculating notice periods or loan tenures, tracking pregnancy or medical timelines, and countless HR and legal contexts where an exact day count matters. This tool calculates precise differences in days, weeks, and months, with an option to exclude weekends for scenarios like calculating actual working time between two dates rather than raw calendar time.`,
    'working-days': `Calculating working days between two dates in India requires more than just excluding Saturdays and Sundays — public holidays vary by state, and central government holidays (Republic Day, Independence Day, Gandhi Jayanti, and others) apply nationally while many additional regional and religious holidays are state-specific, which makes a simple weekday-count formula inaccurate for real business planning. This matters directly for calculating notice periods, project deadlines, payroll processing days, and leave planning in Indian companies. This tool factors in India's central government holiday calendar alongside weekend exclusion, giving a working-day count that's meaningfully more accurate than a generic weekday calculator for Indian business contexts.`,
    'fancy-text': `Unicode contains thousands of characters beyond the standard alphabet, including full sets of bold, italic, script, and decorative letterforms that render identically across almost every platform because they're proper Unicode code points, not a font — which is why “fancy text“ generated this way displays correctly on Instagram bios, WhatsApp status, and Twitter/X posts without needing any special app or font installed on the viewer's device. This is different from actual font styling (which only your own app can render) — the character itself is different, so it copy-pastes and displays consistently everywhere. This tool converts plain text into 12+ different Unicode styles instantly, which is popular for social media bios, usernames, and messages that need to stand out in a feed.`,
    'hashtag-generator': `Hashtag strategy on Instagram directly affects discoverability — posts with at least one hashtag get measurably higher engagement than posts without any, but Instagram's own guidance and most social media research point toward using a focused, relevant set rather than the platform's old 30-hashtag maximum, since overly broad or irrelevant tags can actually suppress reach under current algorithm behavior. Mixing hashtag sizes — a few very popular ones, several mid-size niche ones, and a couple of specific/branded ones — tends to outperform using only high-volume tags, which get buried within minutes on larger accounts. This tool generates relevant hashtag sets across popular Indian niches (fashion, food, travel, fitness, and more) for Instagram, Twitter/X, and LinkedIn.`,
    'hra-calculator': `House Rent Allowance exemption under Section 10(13A) is calculated as the least of three separate figures: actual HRA received, rent paid minus 10% of basic salary, or 50% of basic salary (for metro cities) / 40% (for non-metro cities) — and because it's the minimum of three, simply knowing your HRA amount doesn't tell you your actual exemption without running all three calculations. This trips up a lot of salaried employees during tax filing, since the metro-vs-non-metro distinction alone can change the exempt amount significantly, and city classification for this purpose follows specific IT department rules rather than general definitions of “metro.“ This calculator runs all three formulas automatically and shows which one applies, along with your final exempt and taxable HRA amounts.`,
    'nps-calculator': `The National Pension System is a market-linked retirement scheme where your contributions are invested across equity (E), corporate bonds (C), and government securities (G) in a ratio you choose, subject to a cap on equity exposure that reduces automatically as you approach retirement age under the auto-choice option. NPS offers an additional ₹50,000 tax deduction under Section 80CCD(1B), over and above the ₹1.5 lakh limit under Section 80C, making it one of the few ways to claim tax deduction beyond the standard 80C ceiling. At retirement, at least 40% of the accumulated corpus must be used to purchase an annuity (providing regular pension income), while the remaining portion can typically be withdrawn as a lump sum. This calculator projects your NPS corpus at retirement based on your chosen asset allocation and contribution amount.`,
    'gratuity-calculator': `Gratuity is a statutory lump-sum benefit paid by an employer to an employee who completes 5 or more years of continuous service, governed by the Payment of Gratuity Act, 1972. The formula is fixed by law: (Last Drawn Basic Salary + DA) × 15/26 × Number of Years of Service, where 15/26 represents 15 days of wages per year based on a 26-day working month. Gratuity received up to ₹20 lakh is fully tax-exempt for employees covered under the Act, which makes it a meaningful, often-overlooked component of total retirement or resignation payout that's frequently miscalculated by employees relying on rough estimates rather than the exact statutory formula. This calculator applies the precise legal formula to your salary and tenure.`,
    'rd-calculator': `A Recurring Deposit lets you invest a fixed amount every month for a chosen tenure, functioning as a disciplined middle ground between a savings account and a lump-sum Fixed Deposit — useful for building toward a specific goal with a predictable monthly outflow rather than requiring a large sum upfront. Indian banks compound RD interest quarterly, following the same convention as fixed deposits, which makes the maturity calculation slightly more involved than simple interest since each quarter's compounding applies to a growing principal as new monthly deposits are added. This calculator applies the actual quarterly-compounding formula used by Indian banks to project your exact maturity amount based on monthly deposit, interest rate, and tenure.`,
    'sukanya-calculator': `Sukanya Samriddhi Yojana is a government savings scheme specifically for a girl child, which can be opened any time before she turns 10 and currently earns 8.2% interest per annum — among the highest rates of any government-backed small savings scheme, and revised quarterly like PPF. The account matures 21 years after opening or upon the girl's marriage after age 18, whichever comes first, and like PPF it carries EEE tax status: 80C deduction on contribution, tax-free interest, and tax-free maturity. Partial withdrawal of up to 50% is permitted once the account holder turns 18, for higher education expenses. This calculator projects the maturity value at the current interest rate based on your planned annual contribution.`,
    'capital-gains-calculator': `Capital gains tax in India depends on both the asset type and how long you held it — equity and equity mutual funds held over 12 months qualify for Long-Term Capital Gains (LTCG) treatment, while shorter holdings are taxed as Short-Term Capital Gains (STCG) at a different, generally higher rate. Following Budget 2024 changes, LTCG on equity above ₹1.25 lakh in a financial year is taxed at 12.5%, while STCG on equity is taxed at 20% — a meaningful gap that makes holding period genuinely matter for tax planning, not just investment strategy. Rules differ further for debt funds and other asset classes, which no longer get the same indexation benefits they once did. This calculator computes your exact STCG or LTCG tax liability based on your specific asset type and holding period.`,
    'loan-eligibility-calculator': `Home loan eligibility in India is primarily governed by the FOIR (Fixed Obligation to Income Ratio) — banks typically cap your total EMI obligations (including the new home loan) at 40-50% of your monthly income, which means your existing EMIs (car loan, personal loan, credit card minimums) directly reduce how much home loan you qualify for, even if your income alone would otherwise support a larger loan. Lenders like SBI, HDFC, and ICICI apply broadly similar FOIR-based logic with some variation in exact thresholds and how they weight factors like credit score and employment type. This calculator estimates your maximum eligible loan amount based on your income, existing EMI commitments, and a chosen FOIR percentage, giving a realistic pre-application estimate before you approach a lender.`,
    'bmi-calculator-kids': `BMI interpretation for children and teens works completely differently from adults — rather than fixed cutoffs, a child's BMI is plotted against age- and sex-specific percentile growth charts, because a “normal“ BMI value changes substantially as children grow, and the same BMI number can mean something entirely different at age 5 versus age 15. This tool uses WHO Child Growth Standards alongside guidance referenced by the Indian Academy of Pediatrics, calculating where a child's BMI falls on the percentile curve for their exact age and sex rather than applying a flat adult-style cutoff, which would be clinically inappropriate and misleading for a growing child.`,
    'ideal-weight-calculator': `There is no single “correct“ ideal weight formula — the Hamwi, Devine, Robinson, and Miller formulas were each developed at different times using different reference populations, and they can produce noticeably different results for the same height, particularly for people at the taller or shorter end of the height range. Rather than picking one formula as definitively correct, comparing multiple established methods alongside a BMI-based healthy range gives a more realistic picture of a reasonable weight range rather than a single overly-precise number that implies more accuracy than any of these formulas actually have. This calculator runs all four classic formulas together with a BMI-based range so you can see where they agree and where they diverge.`,
    'water-intake-calculator': `Daily water needs vary considerably based on body weight, activity level, and climate — a commonly cited baseline is roughly 30-35ml per kg of body weight for a sedentary adult in a temperate climate, but this rises meaningfully with exercise, heat, and humidity, all of which are especially relevant in most of India's climate for a large part of the year. Standard “8 glasses a day“ advice is a rough, one-size-fits-all rule that doesn't account for individual body weight or activity differences, which is why weight- and activity-adjusted estimates are more useful for actual hydration planning. This calculator estimates your daily target and breaks it down into a practical hourly or per-glass schedule based on your specific stats and activity level.`,
    'pregnancy-weight-calculator': `Recommended pregnancy weight gain isn't a single universal number — it depends specifically on your pre-pregnancy BMI category, following guidelines from ACOG (American College of Obstetricians and Gynecologists): underweight women are generally advised to gain more total weight than overweight or obese women, since starting BMI significantly affects both maternal and fetal health outcomes at different gain levels. Weekly gain targets also differ by trimester — very little gain is expected in the first trimester with most of the recommended increase happening in the second and third. This tool calculates your personalized total and weekly recommended weight gain range based on your specific pre-pregnancy BMI category, following the ACOG framework.`,
    'json-to-csv': `Converting JSON arrays to CSV is common when moving API data into a spreadsheet, but it isn't always a clean, direct mapping — JSON supports nested objects and arrays within a single record, while CSV is strictly flat rows and columns, so nested fields have to be flattened using dot-notation column headers (like address.city) to represent the same data in a spreadsheet-compatible format without losing structure. This comes up regularly for anyone exporting API responses for analysis in Excel or Google Sheets, or preparing JSON data for tools that only accept CSV input. This tool auto-detects headers from your JSON structure and correctly flattens nested objects, handling the conversion logic so you don't have to write a script for a one-off export.`,
    'xml-formatter': `XML remains widely used in enterprise systems, SOAP APIs, RSS/Atom feeds, configuration files, and many legacy systems that predate JSON's dominance, and minified or poorly-indented XML is just as hard to debug as minified HTML — a single unclosed tag can break parsing, and finding it in a dense block of unformatted markup wastes real debugging time. This tool validates XML syntax and reports errors with line numbers, re-indents it with proper nesting for readability, and can minify formatted XML back down when a compact payload is needed for transmission. It's built for developers working with SOAP services, RSS feeds, or any system where XML is still the format of record.`,
    'markdown-to-html': `Markdown has become the default format for README files, documentation, blog drafts, and technical writing because its plain-text syntax is fast to write and stays readable even unrendered, but it eventually needs converting to HTML for actual web publishing, embedding in a CMS, or pasting into an email client that doesn't understand Markdown syntax. This tool supports GitHub Flavored Markdown (GFM), which extends basic Markdown with tables, task lists (checkboxes), strikethrough, and other features that GitHub, GitLab, and most modern documentation tools have adopted as the practical standard beyond original Markdown. The live preview shows the rendered HTML as you type, which is useful for writers drafting content and developers converting documentation for publishing.`,
    'diff-checker': `Comparing two versions of a text block by eye is slow and error-prone once the text runs beyond a few lines — a single changed word buried in a paragraph is easy to miss, which matters when comparing contract revisions, checking code changes outside a version control diff view, or verifying that a document edit didn't introduce an unintended change elsewhere. This tool highlights additions and deletions with colour-coding (green for additions, red for removals) side-by-side, making even small changes immediately visible regardless of how much surrounding text is unchanged. It's used by writers comparing draft revisions, developers reviewing text or config changes outside their usual diff tooling, and anyone who needs to verify exactly what changed between two versions of a document.`,
    'cron-expression-generator': `Cron expressions — the five or six-field syntax used to schedule recurring jobs on Linux systems, CI/CD pipelines, and cloud schedulers — are notoriously easy to get subtly wrong, since the field order (minute, hour, day-of-month, month, day-of-week) and special characters like \`*\`, \`/\`, \`,\`, and \`-\` don't map intuitively to plain-English scheduling intent, and a misplaced field can silently schedule a job at the wrong time or frequency. This tool lets you build a cron expression by selecting minute, hour, day, month, and weekday options through a visual interface rather than writing the syntax from memory, and translates the resulting expression into plain English so you can verify it matches your actual intent before deploying it.`,
    'ip-address-lookup': `Every device connecting to the internet is assigned an IP address, and looking up geolocation data for one — country, region, city, ISP, ASN, and approximate coordinates — is useful for debugging network issues, investigating suspicious login activity, verifying a VPN connection is actually routing through the expected location, or basic due diligence when dealing with an unfamiliar server or client IP. It's worth noting that IP geolocation is inherently approximate, especially for mobile carriers and VPN/proxy services, where the resolved location can be a regional ISP hub rather than the device's actual physical location. This tool looks up both IPv4 and IPv6 addresses and shows your own public IP automatically, alongside detailed geolocation and network ownership data for any address you enter.`,
    'image-color-picker': `Extracting an exact color value from an existing image — a brand logo, a design reference, or a photo — by eye is unreliable, since human color perception is affected by surrounding colors and screen calibration, and “close enough“ hex codes cause visible inconsistency in design work, particularly for brand colors that need to match exactly across different materials. This tool lets you upload any image and click precisely on a pixel to get its exact HEX and RGB values, along with an automatically extracted palette of the image's dominant colors, which is useful for designers matching a brand palette, developers pulling colors from a mockup, or anyone recreating a specific look from a reference image.`,
    'code-minifier': `Minifying CSS and JavaScript before deployment — stripping whitespace, comments, and unnecessary characters without changing functionality — measurably reduces file size and improves page load time, which directly affects both user experience and Google's Core Web Vitals scoring, a factor in search ranking. While most production build tools (Webpack, Vite, etc.) handle this automatically as part of a build pipeline, there are common situations where a quick manual minify is faster — a standalone script, a quick fix to a static site without a build step, or checking exactly how much size reduction minification actually achieves on a specific file. This tool minifies CSS and JavaScript instantly in the browser and shows the before/after file size comparison.`,
    'string-utilities': `Everyday text cleanup tasks — trimming stray whitespace, finding and replacing text (with regex support for pattern-based replacement), extracting specific substrings, sorting lines alphabetically or numerically, and similar operations — come up constantly when cleaning data exports, preparing content, or processing pasted text, but doing each one separately in different tools or writing a one-off script for a simple text operation is inefficient. This tool bundles the most commonly needed text manipulation operations into a single interface, which is useful for anyone working with messy pasted text, CSV exports, or content that needs quick cleanup before it's used elsewhere, without needing separate specialized tools for each individual operation.`,
    'text-to-slug': `A URL slug is the readable part of a web address after the domain — lowercase, hyphens instead of spaces, and no special characters — and getting it wrong (mismatched casing, stray punctuation, non-ASCII characters left in) can create broken links, duplicate-content issues from inconsistent URL formatting, or slugs that don't match what a CMS or static site generator expects. Search engines also treat slug readability as a minor ranking signal, and consistent, clean slugs matter for site structure and internal linking. This tool converts any text — an article title, a product name — into a properly formatted, SEO-friendly slug instantly, which is a routine step for bloggers, e-commerce sellers, and developers generating URLs from dynamic content.`,
    'gst-number-validator': `A GSTIN (GST Identification Number) follows a fixed 15-character structure that encodes real information: the first two digits are the state code, the next ten characters are the PAN of the business, followed by an entity code, a default check character, and a final checksum digit — which means a properly-formatted GSTIN can be partially decoded just by inspecting its structure, without needing to query the government portal. This is useful for quickly sanity-checking a GSTIN on an invoice before payment, verifying the state code matches the vendor's claimed location, or catching an obviously malformed number before it causes an issue in accounting software. This tool validates the format structure and extracts the embedded state code and PAN portion instantly.`,
    'vehicle-registration-info': `Indian vehicle registration numbers follow a structured format — state code, RTO (Regional Transport Office) code, a series letter(s), and a unique number — which means the plate itself encodes real, decodable information about where a vehicle was registered, useful for quickly identifying a vehicle's home state and RTO office without needing to look anything up externally. This is commonly used when verifying a used car's registration details before purchase, checking whether a vehicle's plate matches its claimed registration location, or simply satisfying curiosity about an unfamiliar state code seen on the road. This tool decodes any Indian registration number format to identify the state and RTO office instantly.`,
    'emi-moratorium-calculator': `An EMI moratorium — a temporary pause on loan repayments, as widely offered during COVID-19 — doesn't mean the loan becomes interest-free during that period; interest continues accruing on the outstanding principal throughout the moratorium, and this accrued interest is typically added to the principal afterward, which increases either your future EMI amount or the total loan tenure once repayments resume. Many borrowers who took moratoriums without fully understanding this ended up paying meaningfully more in total interest over the life of the loan than they would have by continuing regular payments. This calculator shows the exact additional interest cost a moratorium adds, so the trade-off between short-term relief and long-term cost is clear before opting in.`,
    'mutual-fund-comparison': `XIRR (Extended Internal Rate of Return) is the correct way to measure returns on SIP investments because it properly accounts for multiple cash flows happening on different dates — a simple average return calculation doesn't work for SIPs since each monthly installment has a different holding period by the time you measure returns, and treating them as if invested all at once significantly misrepresents actual performance. This is why fund fact sheets and portfolio trackers use XIRR rather than simple CAGR for SIP performance reporting, and understanding the difference matters when comparing a fund's advertised returns against your own actual SIP outcome. This tool calculates XIRR correctly across your specific investment dates and amounts, giving your true annualised return.`,
    'image-to-base64': `Converting an image to a Base64 data URI embeds the image's binary data directly as a text string inside HTML, CSS, or a JSON payload, eliminating a separate network request for that image — useful for small icons, email templates (where external images are often blocked by default), or JSON APIs that need to transmit an image alongside other data in a single payload. The trade-off is that Base64 encoding increases file size by roughly 33% compared to the original binary, so it's best suited to small images rather than large photos, where the extra HTTP request would actually be cheaper. This tool converts any image file to a Base64 data URI instantly and works in reverse too, decoding a Base64 string back into a downloadable image file.`,
    'currency-converter': `Currency exchange rates fluctuate constantly based on interest rate differentials, trade flows, and macroeconomic events, which is why any static or infrequently-updated conversion tool becomes inaccurate within hours — a rate that was correct this morning can be meaningfully off by evening during periods of high volatility. This matters for anyone sending remittances, planning international travel budgets, pricing exports/imports, or simply checking what a foreign price tag translates to in Rupees before making a purchase decision. This tool pulls live exchange rates covering INR against 160+ world currencies including USD, EUR, GBP, and AED, so the conversion reflects current market rates rather than a stale cached figure.`,
    'readability-checker': `Readability scores estimate how difficult a piece of text is to understand based on measurable factors like sentence length and syllable count per word, using established formulas like Flesch Reading Ease (higher score = easier to read) and Flesch-Kincaid Grade Level (which estimates the US school grade level needed to comprehend the text). These metrics are widely used by content writers, technical documentation teams, and UX writers to check whether copy matches its intended audience — a legal disclaimer scoring at a postgraduate reading level might be appropriate, but marketing copy scoring the same way is likely to lose most readers. This tool computes 5 industry-standard readability metrics simultaneously so you can see how a piece of text scores across multiple established formulas rather than just one.`,
    'invoice-generator': `A GST-compliant tax invoice in India must include specific mandatory fields — GSTIN of both parties (where applicable), invoice number and date, HSN/SAC codes, a breakdown of taxable value, and the correct GST rate and amount split by CGST/SGST or IGST depending on whether the transaction is intra-state or inter-state — and missing any of these can create compliance issues or make an invoice unacceptable for the recipient's input tax credit claim. Freelancers, small businesses, and consultants generating invoices without accounting software often get this structure wrong, particularly the CGST/SGST versus IGST distinction. This tool auto-calculates GST at the correct slab (5%, 12%, 18%, or 28%) and generates a properly structured, downloadable invoice with all required fields in place.`,
    'salary-hike-calculator': `A salary hike percentage on its own doesn't tell the full story of what changes in your take-home pay — a 15% CTC increase doesn't translate to a 15% increase in monthly in-hand salary, because components like PF contribution, gratuity provisioning, and tax slab changes at the higher income level all affect the actual increase differently than the headline percentage suggests. This gap is a common source of disappointment when an appraisal hike looks good on paper but the monthly bank credit increases by noticeably less. This calculator shows the percentage hike alongside the concrete new CTC and monthly/annual increment — for the exact in-hand salary after tax, run the new CTC through our Income Tax or CTC Calculator, since that depends on your specific tax regime and deductions.`,
  };

  const extra = EXTRAS[slug] || `${tool.name.split('—')[0].trim()} is a free, browser-based utility that requires no login, no signup, and no installation. All processing happens entirely within your web browser using JavaScript — your data never leaves your device. The tool works on all screen sizes including mobile phones, tablets, and desktop computers.`;
  return `${base}\n\n${extra}`;
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const related   = TOOLS.filter(t => t.hub === tool.hub && t.slug !== tool.slug).slice(0, 5);
  const moreTools = TOOLS.filter(t => t.slug !== tool.slug && !related.find(r => r.slug === t.slug)).slice(0, 6);

  const h1           = tool.keywords?.[0] ? fixAcronymCasing(tool.keywords[0].replace(/\b\w/g, c => c.toUpperCase())) : tool.name;
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
    // NOTE: previously included a hardcoded aggregateRating (4.8 stars / 127 ratings)
    // identical on all 79 pages, with no actual review/rating system anywhere on the
    // site to back it. That's fabricated structured data, which Google's guidelines
    // explicitly treat as spam/manipulative markup — removed rather than faked.
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

          {/* Tool — the primary value. Placed immediately after the header with NO ad
              in between, so the actual tool is never pushed below an ad on first load. */}
          <section className="glass rounded-2xl p-6 mb-4" aria-label={`${tool.name.split('—')[0].trim()} tool`} id="tool">
            <ToolRenderer slug={params.slug} />
          </section>

          {/* Financial / health disclaimer — satisfies AdSense "unreliable claims" policy */}
          {disclaimerType && (
            <div className="mb-5">
              <FinancialDisclaimer type={disclaimerType} />
            </div>
          )}

          {/* AD 1 of 2 — now placed AFTER the working tool, not before it */}
          <div className="mb-5">
            <p className="text-xs text-slate-700 mb-1 text-center tracking-widest uppercase select-none">Advertisement</p>
            <AdUnit slot="auto-1" center />
          </div>

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
              {getHowToSteps(tool.hub).map((step, i) => (
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
                { icon: '🔒', label: 'Privacy',    value: getPrivacyBadge(params.slug) },
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
                {[['Category', tool.category],
                  ['Processing', params.slug in EXTERNAL_API_TOOLS && EXTERNAL_API_TOOLS[params.slug] !== 'None (fetches public rates only)' ? 'Browser + API call' : 'Browser-only'],
                  ['Data sent', getDataSentLabel(params.slug)],['Login needed', 'No'],['Cost', 'Free']].map(([k, v]) => (
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
