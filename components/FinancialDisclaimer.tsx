// Required by Google AdSense "Unreliable claims" policy
// Must appear on all pages that output financial, tax, or medical figures
interface FinancialDisclaimerProps {
  type?: 'finance' | 'tax' | 'health' | 'legal';
}

const MESSAGES = {
  finance: 'Results are estimates for informational purposes only. Market conditions and interest rates vary. Consult a SEBI-registered financial advisor before making investment decisions.',
  tax:     'Tax calculations are estimates based on current slabs and may not reflect all deductions or surcharges applicable to your situation. Consult a qualified Chartered Accountant (CA) before filing your returns.',
  health:  'Results are general estimates and do not constitute medical advice. Consult a qualified doctor or dietitian for personalised health guidance.',
  legal:   'This tool provides general information only and does not constitute legal advice. Consult a qualified legal professional for advice specific to your situation.',
};

export default function FinancialDisclaimer({ type = 'finance' }: FinancialDisclaimerProps) {
  return (
    <div
      role="note"
      aria-label="Disclaimer"
      className="flex items-start gap-2 px-4 py-3 rounded-xl border border-amber-400/20 bg-amber-500/5 text-xs text-slate-500 leading-relaxed"
    >
      <span className="text-amber-500 shrink-0 mt-0.5" aria-hidden="true">⚠️</span>
      <p>
        <strong className="text-amber-400/80 font-semibold">Disclaimer: </strong>
        {MESSAGES[type]}
      </p>
    </div>
  );
}
