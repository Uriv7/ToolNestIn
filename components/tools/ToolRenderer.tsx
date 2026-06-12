'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const TOOL_MAP: Record<string, React.ComponentType<any>> = {
  // Finance Hub
  'gst-calculator':                dynamic(() => import('./GSTCalculator'),                { ssr: false }),
  'emi-calculator':                dynamic(() => import('./EMICalculator'),                { ssr: false }),
  'income-tax-calculator':         dynamic(() => import('./IncomeTaxCalculator'),          { ssr: false }),
  'sip-calculator':                dynamic(() => import('./SIPCalculator'),                { ssr: false }),
  'ppf-calculator':                dynamic(() => import('./PPFCalculator'),                { ssr: false }),
  'fd-calculator':                 dynamic(() => import('./FDCalculator'),                 { ssr: false }),
  'ctc-calculator':                dynamic(() => import('./CTCCalculator'),                { ssr: false }),
  'electricity-bill-calculator':   dynamic(() => import('./ElectricityBillCalculator'),   { ssr: false }),
  'fuel-cost-calculator':          dynamic(() => import('./FuelCostCalculator'),           { ssr: false }),
  'tip-calculator':                dynamic(() => import('./TipCalculator'),                { ssr: false }),
  'percentage-calculator':         dynamic(() => import('./PercentageCalculator'),         { ssr: false }),
  'age-calculator':                dynamic(() => import('./AgeCalculator'),                { ssr: false }),
  // Health Hub
  'bmi-calculator':                dynamic(() => import('./BMICalculator'),                { ssr: false }),
  'calorie-calculator':            dynamic(() => import('./CalorieCalculator'),            { ssr: false }),
  // Developer Hub
  'json-formatter':                dynamic(() => import('./JSONFormatter'),                { ssr: false }),
  'base64':                        dynamic(() => import('./Base64Tool'),                   { ssr: false }),
  'url-encoder':                   dynamic(() => import('./URLEncoder'),                   { ssr: false }),
  'password-generator':            dynamic(() => import('./PasswordGenerator'),            { ssr: false }),
  'qr-generator':                  dynamic(() => import('./QRGenerator'),                  { ssr: false }),
  'color-converter':               dynamic(() => import('./ColorConverter'),               { ssr: false }),
  'regex-tester':                  dynamic(() => import('./RegexTester'),                  { ssr: false }),
  'uuid-generator':                dynamic(() => import('./UUIDGenerator'),                { ssr: false }),
  'hash-generator':                dynamic(() => import('./HashGenerator'),                { ssr: false }),
  'jwt-decoder':                   dynamic(() => import('./JWTDecoder'),                   { ssr: false }),
  'html-formatter':                dynamic(() => import('./HTMLFormatter'),                { ssr: false }),
  'timestamp-converter':           dynamic(() => import('./TimestampConverter'),           { ssr: false }),
  'password-strength':             dynamic(() => import('./PasswordStrengthChecker'),      { ssr: false }),
  // Text Hub
  'word-counter':                  dynamic(() => import('./WordCounter'),                  { ssr: false }),
  'case-converter':                dynamic(() => import('./CaseConverter'),                { ssr: false }),
  'lorem-ipsum':                   dynamic(() => import('./LoremIpsum'),                   { ssr: false }),
  'remove-duplicates':             dynamic(() => import('./RemoveDuplicates'),             { ssr: false }),
  'fancy-text':                    dynamic(() => import('./FancyTextGenerator'),           { ssr: false }),
  'hashtag-generator':             dynamic(() => import('./HashtagGenerator'),             { ssr: false }),
  // Converter Hub
  'unit-converter':                dynamic(() => import('./UnitConverter'),                { ssr: false }),
  'number-to-words':               dynamic(() => import('./NumberToWords'),                { ssr: false }),
  'csv-to-json':                   dynamic(() => import('./CSVToJSON'),                    { ssr: false }),
  'date-difference':               dynamic(() => import('./DateDifference'),               { ssr: false }),
  'working-days':                  dynamic(() => import('./WorkingDaysCalculator'),        { ssr: false }),
  // India Hub
  'ifsc-finder':                   dynamic(() => import('./IFSCFinder'),                  { ssr: false }),
  'pan-validator':                 dynamic(() => import('./PANValidator'),                 { ssr: false }),
  'pincode-finder':                dynamic(() => import('./PincodeFinder'),                { ssr: false }),

  // ── 40 NEW TOOLS ──────────────────────────────────────────────
  // Finance
  'hra-calculator':                dynamic(() => import('./HRACalculator'),                { ssr: false }),
  'nps-calculator':                dynamic(() => import('./NPSCalculator'),                { ssr: false }),
  'gratuity-calculator':           dynamic(() => import('./GratuityCalculator'),           { ssr: false }),
  'rd-calculator':                 dynamic(() => import('./RDCalculator'),                 { ssr: false }),
  'sukanya-calculator':            dynamic(() => import('./SukanyaCalculator'),            { ssr: false }),
  'capital-gains-calculator':      dynamic(() => import('./CapitalGainsCalculator'),       { ssr: false }),
  'loan-eligibility-calculator':   dynamic(() => import('./LoanEligibilityCalculator'),    { ssr: false }),
  'emi-moratorium-calculator':     dynamic(() => import('./EMIMoratoriumCalculator'),      { ssr: false }),
  'mutual-fund-comparison':        dynamic(() => import('./MutualFundXIRR'),               { ssr: false }),
  'salary-hike-calculator':        dynamic(() => import('./SalaryHikeCalculator'),         { ssr: false }),
  'currency-converter':            dynamic(() => import('./CurrencyConverter'),            { ssr: false }),
  // Health
  'bmi-calculator-kids':           dynamic(() => import('./BMICalculatorKids'),            { ssr: false }),
  'ideal-weight-calculator':       dynamic(() => import('./IdealWeightCalculator'),        { ssr: false }),
  'water-intake-calculator':       dynamic(() => import('./WaterIntakeCalculator'),        { ssr: false }),
  'pregnancy-weight-calculator':   dynamic(() => import('./PregnancyWeightCalculator'),    { ssr: false }),
  // Developer
  'json-to-csv':                   dynamic(() => import('./JSONToCSV'),                    { ssr: false }),
  'xml-formatter':                 dynamic(() => import('./XMLFormatter'),                 { ssr: false }),
  'markdown-to-html':              dynamic(() => import('./MarkdownToHTML'),               { ssr: false }),
  'diff-checker':                  dynamic(() => import('./DiffChecker'),                  { ssr: false }),
  'cron-expression-generator':     dynamic(() => import('./CronGenerator'),                { ssr: false }),
  'ip-address-lookup':             dynamic(() => import('./IPAddressLookup'),              { ssr: false }),
  'image-color-picker':            dynamic(() => import('./ImageColorPicker'),             { ssr: false }),
  'code-minifier':                 dynamic(() => import('./CodeMinifier'),                 { ssr: false }),
  'http-status-codes':             dynamic(() => import('./HTTPStatusCodes'),              { ssr: false }),
  'image-to-base64':               dynamic(() => import('./ImageToBase64'),                { ssr: false }),
  'number-system-converter':       dynamic(() => import('./NumberSystemConverter'),        { ssr: false }),
  // Text
  'text-reverser':                 dynamic(() => import('./TextReverser'),                 { ssr: false }),
  'string-utilities':              dynamic(() => import('./StringUtilities'),              { ssr: false }),
  'text-to-slug':                  dynamic(() => import('./TextToSlug'),                   { ssr: false }),
  'emoji-picker':                  dynamic(() => import('./EmojiPicker'),                  { ssr: false }),
  'readability-checker':           dynamic(() => import('./ReadabilityChecker'),           { ssr: false }),
  // India
  'gst-number-validator':          dynamic(() => import('./GSTNumberValidator'),           { ssr: false }),
  'vehicle-registration-info':     dynamic(() => import('./VehicleRegistrationInfo'),      { ssr: false }),
  'invoice-generator':             dynamic(() => import('./InvoiceGenerator'),             { ssr: false }),
  // Converter / Utility
  'time-zone-converter':           dynamic(() => import('./TimeZoneConverter'),            { ssr: false }),
  'aspect-ratio-calculator':       dynamic(() => import('./AspectRatioCalculator'),        { ssr: false }),
  'stopwatch-timer':               dynamic(() => import('./StopwatchTimer'),               { ssr: false }),
  'scientific-calculator':         dynamic(() => import('./ScientificCalculator'),         { ssr: false }),
  'cron-expression-generator':     dynamic(() => import('./CronGenerator'),                { ssr: false }),
};

function ToolSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-white/5 rounded-xl" />
      <div className="h-12 bg-white/5 rounded-xl" />
      <div className="h-32 bg-white/5 rounded-xl" />
      <div className="h-12 bg-white/5 rounded-xl w-1/2" />
    </div>
  );
}

export default function ToolRenderer({ slug }: { slug: string }) {
  const Component = TOOL_MAP[slug];
  if (!Component) return (
    <div className="text-slate-500 text-center py-10">Tool not found.</div>
  );
  return (
    <Suspense fallback={<ToolSkeleton />}>
      <Component />
    </Suspense>
  );
}
