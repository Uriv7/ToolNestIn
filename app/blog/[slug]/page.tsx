import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '../articles';
import AdUnit from '@/components/AdUnit';

export async function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = ARTICLES.find(a => a.slug === params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `https://toolnestin.co.in/blog/${article.slug}/` },
    openGraph: { title: article.title, description: article.excerpt, type: 'article',
      publishedTime: article.date, siteName: 'ToolNestIn', locale: 'en_IN' },
  };
}

// ── Full article content per slug ───────────────────────────────────────────
const CONTENT: Record<string, React.ReactNode> = {
  'how-to-calculate-gst-india': (
    <div className="prose-content">
      <p>GST (Goods and Services Tax) replaced over a dozen indirect taxes in India on 1 July 2017. Understanding how to calculate GST is essential for business owners, accountants, and consumers alike. This guide covers every scenario you will encounter.</p>
      <h2>The four GST slabs</h2>
      <p>India uses four primary GST rate slabs:</p>
      <ul>
        <li><strong>5%</strong> — Essential goods: packaged food, household necessities, economy hotel rooms (under ₹1,000/night), economy class air travel</li>
        <li><strong>12%</strong> — Processed foods, business class air travel, non-AC restaurants, mobile phones</li>
        <li><strong>18%</strong> — Most services (IT, consulting, telecom), restaurants with AC, most manufactured goods, financial services</li>
        <li><strong>28%</strong> — Luxury goods: cars, motorcycles above 350cc, aerated drinks, cigarettes, 5-star hotels</li>
      </ul>
      <p>There is also a 0% rate for exempted goods (fresh vegetables, milk, eggs, books) and a 3% rate for gold and jewellery.</p>
      <h2>How to calculate GST — the formula</h2>
      <p><strong>Adding GST to a base price:</strong></p>
      <p>GST Amount = Base Price × GST Rate / 100<br/>Final Price = Base Price + GST Amount</p>
      <p>Example: Product costs ₹10,000 before GST. GST rate = 18%.<br/>GST = ₹10,000 × 18/100 = ₹1,800<br/>Final price = ₹10,000 + ₹1,800 = ₹11,800</p>
      <p><strong>Reverse GST calculation (when price includes GST):</strong></p>
      <p>Base Price = Inclusive Price × 100 / (100 + GST Rate)<br/>GST Amount = Inclusive Price − Base Price</p>
      <p>Example: You paid ₹11,800 inclusive of 18% GST.<br/>Base = ₹11,800 × 100/118 = ₹10,000<br/>GST = ₹11,800 − ₹10,000 = ₹1,800</p>
      <h2>CGST, SGST, and IGST — the split</h2>
      <p>When a transaction is <strong>intrastate</strong> (buyer and seller in the same state), GST splits equally between Central GST (CGST) and State GST (SGST). For an 18% GST transaction: CGST = 9%, SGST = 9%.</p>
      <p>When a transaction is <strong>interstate</strong> (buyer and seller in different states), the entire GST is collected as Integrated GST (IGST) by the central government. For 18% GST: IGST = 18%.</p>
      <h2>Common GST calculation mistakes</h2>
      <ul>
        <li>Calculating GST on an already GST-inclusive price (double counting)</li>
        <li>Using the wrong slab — many items changed slabs in the 2023 and 2024 GST Council meetings</li>
        <li>Forgetting the CGST/SGST split when issuing invoices</li>
        <li>Not charging GST on services because "it is just a small consultancy"</li>
      </ul>
      <h2>Use the free GST Calculator</h2>
      <p>Rather than calculating manually every time, use our <Link href="/tools/gst-calculator/" className="text-brand-400 hover:underline">free GST Calculator</Link> which handles all four slabs, intrastate/interstate split, and reverse calculations instantly.</p>
      <h2>Input Tax Credit (ITC) — the concept businesses get wrong</h2>
      <p>ITC lets a registered business deduct the GST it paid on purchases (inputs) from the GST it owes on sales (output). This prevents the same value from being taxed multiple times as goods move through a supply chain. For example, if you buy raw materials for ₹1,00,000 + 18% GST (₹18,000) and sell the finished product for ₹2,00,000 + 18% GST (₹36,000), you don't pay ₹36,000 to the government — you pay ₹36,000 − ₹18,000 = ₹18,000, because you already paid ₹18,000 in GST on your inputs.</p>
      <p>ITC cannot be claimed on every purchase, though — common exclusions include motor vehicles (with some exceptions), food and beverages, and employee-related expenses like life or health insurance unless mandated by law. A mismatch between what a supplier reports and what you claim is one of the most common reasons ITC gets rejected during a GST audit.</p>
      <h2>Composition scheme — an alternative for small businesses</h2>
      <p>Businesses with annual turnover under ₹1.5 crore (₹75 lakh for some special category states) can opt for the GST Composition Scheme instead of regular GST. Under composition, you pay a flat, low rate on turnover (typically 1% for traders, 5% for restaurants) instead of standard slab rates, but you cannot claim ITC and cannot charge GST separately on invoices. This suits small traders and restaurants with simple operations, but it's a poor fit for B2B businesses whose customers need ITC to be passed through.</p>
      <h2>GST on inter-state e-commerce — a common confusion</h2>
      <p>Many small online sellers assume GST rules for e-commerce are simpler because a platform like Amazon or Flipkart "handles it." In reality, sellers on e-commerce platforms must be GST-registered regardless of turnover (the usual ₹40 lakh/₹20 lakh registration threshold doesn't apply to e-commerce sellers), and platforms deduct Tax Collected at Source (TCS) at 1% on the net value of taxable supplies, which the seller can then claim as credit against their GST liability.</p>
      <h2>Frequently asked questions</h2>
      <p><strong>Do I need to register for GST if my turnover is below ₹40 lakh?</strong> Generally no for goods (₹20 lakh for services, lower thresholds in special category states), unless you sell inter-state, sell via e-commerce, or fall under mandatory registration categories regardless of turnover.</p>
      <p><strong>Can GST rates change without notice?</strong> Rate changes are announced by the GST Council (which meets periodically) and typically take effect from a specified future date, not retroactively — but slabs for specific goods do get revised every few Council meetings, so it's worth checking current rates for high-value purchases.</p>
    </div>
  ),
  'old-vs-new-tax-regime-2026': (
    <div className="prose-content">
      <p>The Union Budget 2023 made the New Tax Regime the default for all salaried taxpayers, and Budget 2025 substantially widened the gap between the two regimes by revising the New Regime's slabs and raising its rebate threshold. "Default" still does not mean "better" for everyone — but the calculation has shifted significantly in the New Regime's favour for most people since Budget 2025. Here is how to decide with current figures.</p>
      <h2>The two regimes at a glance</h2>
      <p><strong>Old Tax Regime:</strong> Higher slab rates, but you can claim deductions (80C up to ₹1.5L, HRA, home loan interest under Section 24, 80D medical insurance, LTA, etc.). Standard deduction is ₹50,000. Works best for those with significant investments and deductions.</p>
      <p><strong>New Tax Regime (FY 2025-26 slabs, per Budget 2025):</strong><br/>Up to ₹4 lakh — Nil<br/>₹4L–8L — 5%<br/>₹8L–12L — 10%<br/>₹12L–16L — 15%<br/>₹16L–20L — 20%<br/>₹20L–24L — 25%<br/>Above ₹24L — 30%</p>
      <p>Standard deduction of ₹75,000 is available under the New Regime. No other deductions. Crucially, Budget 2025 also raised the Section 87A rebate so that <strong>taxable income up to ₹12 lakh under the New Regime pays zero tax</strong> — for a salaried employee, that means <strong>gross income up to ₹12.75 lakh (₹12L + ₹75,000 standard deduction) is effectively tax-free under the New Regime</strong>, regardless of any other deductions.</p>
      <h2>Worked example — ₹12 lakh CTC</h2>
      <p><strong>Old Regime:</strong> 80C = ₹1.5L, HRA exemption = ₹1L, 80D = ₹25,000, standard deduction = ₹50,000. Total deductions = ₹3.25L. Taxable income = ₹8.75L. Tax ≈ ₹91,000 (including cess).</p>
      <p><strong>New Regime:</strong> Standard deduction = ₹75,000. Taxable income = ₹11.25L — under the ₹12L rebate threshold. <strong>Tax = ₹0.</strong></p>
      <p>At this income level, the New Regime wins decisively — by the full ₹91,000 — because ₹11.25L taxable income falls entirely within the New Regime's zero-tax rebate zone. This is a complete reversal from pre-Budget-2025 rules, where the New Regime's rebate only covered taxable income up to ₹7 lakh. Use our <Link href="/tools/income-tax-calculator/" className="text-brand-400 hover:underline">Income Tax Calculator</Link> to run the comparison with your exact figures.</p>
      <h2>When the Old Regime still wins</h2>
      <p>The Old Regime remains better mainly at higher incomes with substantial deductions — particularly a home loan (Section 24b interest, up to ₹2L) stacked with HRA and full 80C, since the New Regime allows none of these. Below roughly ₹12.75L gross, the New Regime's zero-tax zone is very hard for the Old Regime to beat even with maximum deductions, since the Old Regime still owes tax on income above its much lower ₹2.5L exemption.</p>
      <h2>Worked example — ₹18 lakh CTC with a home loan</h2>
      <p><strong>Old Regime:</strong> 80C = ₹1.5L, home loan interest (Sec 24b) = ₹2L, HRA exemption = ₹1.5L, 80D = ₹25,000, standard deduction = ₹50,000. Total deductions = ₹5.75L. Taxable income = ₹12.25L. Tax ≈ ₹1,87,200 (including cess).</p>
      <p><strong>New Regime:</strong> Standard deduction = ₹75,000. Taxable income = ₹17.25L — above the ₹12L rebate threshold, so full slab tax applies. Tax ≈ ₹1,50,800 (including cess).</p>
      <p>Even with a home loan, full 80C, and HRA stacked together, the New Regime still comes out ahead here by roughly ₹36,400 — a direct consequence of Budget 2025's slab widening. Under the pre-2025 rules this same scenario favoured the Old Regime; that is no longer reliably true. The gap does close, and can flip to the Old Regime, at higher incomes with even larger deductions (a bigger home loan, for instance) — which is exactly why running your own numbers through the calculator matters more than following a rule of thumb.</p>
      <h2>Can you switch regimes every year?</h2>
      <p>Salaried individuals without business income can switch between the Old and New Regime every financial year when filing their return — you're not locked in. This means you can genuinely calculate both ways each year and pick whichever is lower, rather than committing long-term. Those with business or professional income face more restrictions: they can switch back to the Old Regime only once after opting for the New Regime.</p>
      <h2>What most people get wrong</h2>
      <p>The most common mistake right now is still comparing regimes using pre-Budget-2025 assumptions — a lot of advice and old spreadsheets circulating online still reference the old ₹7L rebate threshold and the old New Regime slabs, which understate how favourable the New Regime became after Budget 2025. If your last regime comparison is more than a year old, it's worth re-running it with current figures rather than trusting last year's conclusion.</p>
    </div>
  ),
  'emi-calculation-guide-india': (
    <div className="prose-content">
      <p>Every bank and NBFC in India uses the same EMI formula, yet most borrowers do not know how their monthly payment is calculated. Understanding this helps you negotiate better terms and plan prepayments strategically.</p>
      <h2>The EMI formula</h2>
      <p>EMI = P × r × (1+r)^n / ((1+r)^n − 1)</p>
      <p>Where: P = Principal loan amount, r = Monthly interest rate (annual rate ÷ 12 ÷ 100), n = Number of monthly instalments</p>
      <p>Example: Home loan of ₹50 lakh at 8.5% for 20 years.<br/>r = 8.5/(12×100) = 0.00708<br/>n = 240 months<br/>EMI = ₹50,00,000 × 0.00708 × (1.00708)^240 / ((1.00708)^240 − 1)<br/>EMI ≈ ₹43,391/month</p>
      <h2>Why the reducing balance method matters</h2>
      <p>Indian banks use the "reducing balance" method — interest is charged only on the outstanding principal, not the original amount. This means your early EMIs are mostly interest, and later EMIs are mostly principal. In the above example, in month 1 you pay ₹29,167 in interest and only ₹14,224 towards principal.</p>
      <h2>How to reduce total interest paid</h2>
      <ul>
        <li><strong>Prepayment:</strong> Even one extra EMI per year reduces tenure significantly. On a ₹50L home loan, one extra payment per year saves approximately ₹4.8L in total interest.</li>
        <li><strong>Shorter tenure:</strong> Moving from 20 to 15 years increases EMI by ~17% but reduces total interest by ~35%.</li>
        <li><strong>Negotiate rate:</strong> Moving from 8.5% to 8.0% on ₹50L saves approximately ₹1.7L over 20 years.</li>
      </ul>
      <p>Use our <Link href="/tools/emi-calculator/" className="text-brand-400 hover:underline">free EMI Calculator</Link> to try different scenarios with your loan details.</p>
      <h2>Fixed vs floating interest rate — how it changes your EMI</h2>
      <p>Most Indian home loans are floating-rate, tied to a bank's external benchmark (usually the RBI repo rate) plus a spread. When the RBI changes the repo rate, your bank typically adjusts your loan rate within a quarter, which changes either your EMI or your tenure, depending on what your bank's policy allows you to choose. Fixed-rate loans keep the same rate for a set period (or the full tenure), giving predictability but usually starting 1-2% higher than floating rates, since the bank is pricing in the risk of rates rising later.</p>
      <h2>The amortisation schedule — why your principal barely moves at first</h2>
      <p>An amortisation schedule breaks down every EMI into its interest and principal components across the loan tenure. On a 20-year loan, it typically takes 8-10 years before the principal component of your EMI exceeds the interest component — meaning for the first third to nearly half of a long-tenure loan, you're mostly paying interest, not reducing what you owe. This is precisely why prepaying early in a loan's life saves dramatically more interest than prepaying the same amount later: early prepayments strike directly at the high-interest, low-principal-reduction phase of the schedule.</p>
      <h2>Balance transfer — when it's actually worth it</h2>
      <p>Transferring your home loan to a new lender for a lower rate involves processing fees (typically 0.5-1% of outstanding principal) and paperwork. As a rule of thumb, a balance transfer is usually worth it if the rate difference is at least 0.5-0.75 percentage points and you have more than 5 years of tenure remaining — below that, the processing costs and effort often outweigh the interest savings. Always calculate the actual rupee savings on your specific outstanding principal and remaining tenure rather than going by the percentage difference alone.</p>
    </div>
  ),
  'sip-vs-lumpsum-india': (
    <div className="prose-content">
      <p>SIP (Systematic Investment Plan) and lump sum are the two primary ways to invest in Indian mutual funds. Both have legitimate use cases, and the "right" answer depends on your financial situation, market conditions, and investing temperament.</p>
      <h2>How SIP works</h2>
      <p>A SIP invests a fixed amount every month regardless of market conditions. When markets fall, your fixed amount buys more units. When markets rise, you buy fewer units. Over time, this averages your purchase cost — known as rupee cost averaging.</p>
      <p>Example: ₹10,000/month in a Nifty 50 index fund for 20 years at 12% CAGR = approximately ₹99.9 lakh corpus. Total invested = ₹24 lakh. Wealth created = ₹75.9 lakh.</p>
      <h2>How lump sum works</h2>
      <p>A lump sum investment puts all your money to work immediately. This is mathematically superior when markets are rising (you benefit from the full corpus growing). But if markets fall after you invest, recovery can take years.</p>
      <p>Example: ₹24 lakh invested as a lump sum at 12% CAGR for 20 years = approximately ₹2.32 crore — significantly more than the SIP example above, but only if the 12% CAGR holds from day 1.</p>
      <h2>The honest answer for most Indian investors</h2>
      <p>If you receive a regular salary: SIP. It aligns with when you receive money, removes timing decisions, and builds financial discipline. If you receive a windfall (bonus, inheritance, property sale): split it — invest 40% as lump sum immediately, deploy the rest in a 6-month STP (Systematic Transfer Plan) from a liquid fund.</p>
      <p>Use our <Link href="/tools/sip-calculator/" className="text-brand-400 hover:underline">SIP Calculator</Link> to estimate your corpus, then compare different scenarios.</p>
      <h2>What "returns" actually means for a SIP — CAGR vs XIRR</h2>
      <p>A single lump-sum investment has one clean return figure (CAGR). A SIP has 240 separate monthly investments (for a 20-year SIP) each with a different holding period by the time you check your returns, so a simple CAGR calculation doesn't accurately represent SIP performance. The correct metric is XIRR (Extended Internal Rate of Return), which properly weights each instalment by its actual investment date. This is why your mutual fund app shows XIRR, not CAGR, for SIP holdings — and why comparing a "12% CAGR" assumption used in projections against your own SIP's XIRR isn't quite apples-to-apples.</p>
      <h2>Step-up SIP — a more realistic long-term strategy</h2>
      <p>A step-up (or "top-up") SIP increases your monthly investment by a fixed percentage each year, typically matching salary growth (commonly 10%). Starting a ₹10,000/month SIP with a 10% annual step-up, instead of a flat ₹10,000/month for 20 years, roughly doubles your final corpus at the same 12% CAGR assumption — because a growing income base naturally allows growing investments, and the compounding benefit of investing more in your later, larger-base years is substantial.</p>
      <h2>Market timing — why it's harder than it looks</h2>
      <p>The core argument for SIP over lump sum is that predicting short-term market direction is genuinely difficult even for professional fund managers, and mistiming a large lump-sum entry (investing right before a downturn) can set your portfolio back years. Data from multiple market cycles shows that missing just the 10 best trading days over a 15-20 year period can cut total returns roughly in half — which is a strong argument against trying to "wait for the dip" indefinitely rather than starting to invest, whether via SIP or a staggered lump-sum deployment.</p>
    </div>
  ),
  'hra-exemption-guide': (
    <div className="prose-content">
      <p>HRA (House Rent Allowance) is one of the most valuable tax-saving components for salaried employees in India — yet many people either overclaim it (risking IT notices) or underclaim it (leaving money on the table). Here is the complete guide.</p>
      <h2>The three-part test for HRA exemption</h2>
      <p>Under Section 10(13A), the HRA exemption is the <strong>minimum</strong> of three amounts:</p>
      <ol>
        <li>Actual HRA received from employer</li>
        <li>50% of (Basic + DA) for metro cities, 40% for non-metro cities</li>
        <li>Rent paid minus 10% of (Basic + DA)</li>
      </ol>
      <p>Metro cities for HRA purposes: Delhi, Mumbai, Kolkata, Chennai. All other cities (including Bangalore, Hyderabad, Pune) are non-metro for HRA calculation.</p>
      <h2>Worked example</h2>
      <p>Salaried employee in Bangalore: Basic = ₹60,000/month, HRA received = ₹24,000/month, Rent paid = ₹22,000/month.</p>
      <p>Criterion 1: ₹24,000 (actual HRA)<br/>Criterion 2: 40% of ₹60,000 = ₹24,000 (non-metro)<br/>Criterion 3: ₹22,000 − 10% of ₹60,000 = ₹22,000 − ₹6,000 = ₹16,000<br/>Exemption = minimum of (₹24,000, ₹24,000, ₹16,000) = <strong>₹16,000/month = ₹1.92 lakh/year</strong></p>
      <h2>PAN requirement for rent above ₹1 lakh</h2>
      <p>If your annual rent payment exceeds ₹1 lakh (₹8,333/month), you must provide your landlord's PAN to your employer to claim HRA. Without it, the IT department may disallow the claim during assessment. This is mandatory even if your landlord is a family member.</p>
      <h2>HRA and home loan together</h2>
      <p>You can claim both HRA exemption and home loan interest deduction under Section 24(b) simultaneously — but only if your rented house and owned house are in different cities. If you live in your own house, you cannot claim HRA regardless of whether you pay a mortgage.</p>
      <p>Calculate your exact HRA exemption with our <Link href="/tools/hra-calculator/" className="text-brand-400 hover:underline">free HRA Calculator</Link>.</p>
      <h2>Paying rent to a family member — is it allowed?</h2>
      <p>Yes, you can claim HRA exemption while paying rent to a parent, provided the arrangement is genuine: you need an actual rent agreement, monthly rent payments through a traceable method (bank transfer, not cash), and rent receipts. Your parent must also declare this rent as income in their own tax return, since the IT department treats this as a genuine landlord-tenant transaction, not a bookkeeping formality. You cannot claim HRA for rent paid to a spouse, since the tax department views a spousal arrangement as inherently non-arm's-length.</p>
      <h2>What happens if you don't submit rent receipts on time</h2>
      <p>Employers typically require rent receipts and the landlord's PAN (if applicable) by January or February to factor HRA exemption into your Form 16 and monthly TDS. If you miss this deadline, your employer will deduct higher TDS through the rest of the year, but you can still claim the HRA exemption directly while filing your Income Tax Return (ITR) — the exemption isn't lost, you simply get the benefit as a refund instead of through reduced monthly TDS.</p>
      <h2>Self-employed and freelancers — no HRA, but not without options</h2>
      <p>HRA exemption under Section 10(13A) is only available to salaried employees who actually receive an HRA component from an employer. Self-employed individuals and freelancers can't claim HRA, but they can claim rent paid under Section 80GG instead, subject to different (generally lower) limits — the lower of ₹5,000/month, 25% of total income, or rent paid minus 10% of income — and only if neither they nor their spouse own a house in the city where they work.</p>
    </div>
  ),
  'nps-vs-ppf-india': (
    <div className="prose-content">
      <p>NPS (National Pension System) and PPF (Public Provident Fund) are India's two most trusted government-backed long-term investment schemes. Both are safe, tax-efficient, and designed for retirement — but they work very differently.</p>
      <h2>Key differences at a glance</h2>
      <p><strong>PPF:</strong> Fixed 7.1% interest rate (reviewed quarterly), fully guaranteed by Government of India, EEE tax status (invest, grow, and withdraw all tax-free), 15-year lock-in, maximum ₹1.5 lakh/year, no market risk.</p>
      <p><strong>NPS:</strong> Market-linked returns (equity fund historically 12–14% p.a.), partially market-dependent, mixed tax status (EEE on 60% lump sum withdrawal, annuity portion taxable), lock-in till age 60, additional ₹50,000 deduction under 80CCD(1B), minimum pension guaranteed through annuity.</p>
      <h2>Tax advantage comparison</h2>
      <p>Both PPF and NPS contributions qualify for 80C deduction up to ₹1.5 lakh/year. But NPS has an exclusive additional benefit: Section 80CCD(1B) allows an extra ₹50,000 deduction per year, completely separate from the ₹1.5L 80C limit.</p>
      <p>At the 30% tax slab, this 80CCD(1B) benefit saves ₹15,600/year in taxes — making NPS effectively one of the highest-returning instruments on an after-tax basis.</p>
      <h2>Returns over 25 years — the math</h2>
      <p>₹1.5 lakh invested annually for 25 years:<br/>PPF at 7.1%: corpus ≈ ₹97 lakh (fully tax-free)<br/>NPS equity at 12%: corpus ≈ ₹2.3 crore (60% = ₹1.38 crore tax-free; 40% buys annuity)</p>
      <p>The NPS equity corpus is dramatically higher, but involves market risk and the mandatory annuity requirement on 40% reduces flexibility.</p>
      <h2>Which should you choose?</h2>
      <p>For most salaried Indians, the optimal strategy is both: max PPF for ₹1.5L guaranteed-safe 80C deduction with full liquidity after 15 years, plus NPS for the extra 80CCD(1B) deduction and higher long-term equity returns for retirement.</p>
      <p>Use our <Link href="/tools/nps-calculator/" className="text-brand-400 hover:underline">NPS Calculator</Link> and <Link href="/tools/ppf-calculator/" className="text-brand-400 hover:underline">PPF Calculator</Link> to model both scenarios with your exact numbers.</p>
      <h2>NPS asset allocation — Active vs Auto choice</h2>
      <p>NPS lets you choose how your contributions are split across Equity (E), Corporate Bonds (C), and Government Securities (G). Under "Active Choice," you set the allocation yourself, with equity exposure capped at 75% and reducing after age 50. Under "Auto Choice" (Lifecycle Fund), the equity allocation starts higher when you're young and automatically glides down as you approach retirement — a "set and forget" option that suits most people who don't want to actively rebalance their retirement portfolio every few years.</p>
      <h2>What happens to your NPS corpus at retirement</h2>
      <p>At age 60, you can withdraw up to 60% of your NPS corpus as a tax-free lump sum. The remaining 40% (minimum) must be used to purchase an annuity from an IRDAI-registered insurer, which then pays you a regular pension — but this pension income is taxable as per your income slab in the years you receive it. This mandatory annuitisation is the single biggest liquidity trade-off NPS has compared to PPF, where 100% of the maturity amount is yours, tax-free, with no strings attached.</p>
      <h2>Partial withdrawal rules — PPF is more flexible than most people realise</h2>
      <p>PPF allows partial withdrawal from the 7th financial year onward, up to 50% of the balance at the end of the 4th preceding year (or immediately preceding year, whichever is lower) — useful for genuine emergencies without breaking the account. NPS allows partial withdrawal of up to 25% of your own contributions (not the full corpus) after 3 years, and only for specific purposes like higher education, marriage, medical treatment, or buying a first home, capped at 3 withdrawals over the account's lifetime.</p>
    </div>
  ),
};

export default function BlogArticle({ params }: { params: { slug: string } }) {
  const article = ARTICLES.find(a => a.slug === params.slug);
  if (!article) notFound();
  const content = CONTENT[params.slug];
  if (!content) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-slate-600">
        <Link href="/" className="hover:text-brand-400 transition">Home</Link>
        <span>›</span>
        <Link href="/blog/" className="hover:text-brand-400 transition">Guides</Link>
        <span>›</span>
        <span className="text-slate-500 truncate">{article.title}</span>
      </nav>

      <div className="mb-8">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 mr-3">{article.tag}</span>
        <span className="text-slate-600 text-xs">{article.date} · {article.readTime} read</span>
        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 mb-4 leading-tight">{article.title}</h1>
        <p className="text-slate-400 text-lg leading-relaxed">{article.excerpt}</p>
      </div>

      {/* Top ad — 1 of 2 max */}
      <div className="mb-8">
        <p className="text-xs text-slate-700 mb-1 text-center tracking-widest uppercase">Advertisement</p>
        <AdUnit slot="auto-1" center />
      </div>

      {/* Article body */}
      <article className="text-slate-400 leading-relaxed space-y-4 [&_h2]:font-sans [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-100 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:text-slate-200 [&_h3]:mt-5 [&_h3]:mb-2 [&_strong]:text-slate-300 [&_a]:text-brand-400 [&_a:hover]:underline [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:list-decimal [&_p]:text-sm [&_li]:text-sm">
        {content}
      </article>

      {/* Bottom ad — 2 of 2 max */}
      <div className="mt-10 mb-8">
        <p className="text-xs text-slate-700 mb-1 text-center tracking-widest uppercase">Advertisement</p>
        <AdUnit slot="auto-relaxed" center />
      </div>

      {/* More articles */}
      <section className="glass rounded-2xl p-6">
        <h2 className="font-sans font-bold text-slate-200 mb-4">More guides</h2>
        <div className="space-y-3">
          {ARTICLES.filter(a => a.slug !== params.slug).slice(0, 3).map(a => (
            <Link key={a.slug} href={`/blog/${a.slug}/`}
              className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/10">
              <div>
                <div className="text-sm font-semibold text-slate-300 hover:text-brand-300">{a.title}</div>
                <div className="text-xs text-slate-600 mt-0.5">{a.readTime} read</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
