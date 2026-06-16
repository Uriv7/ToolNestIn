interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export default function Logo({ size = 32, showWordmark = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Hexagon TN mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Outer hexagon */}
        <polygon
          points="28,4 50,16 50,40 28,52 6,40 6,16"
          fill="#080c14"
          stroke="#0c93f0"
          strokeWidth="2"
        />
        {/* Inner hexagon fill */}
        <polygon
          points="28,11 43,19.5 43,36.5 28,45 13,36.5 13,19.5"
          fill="rgba(12,147,240,0.1)"
          stroke="#36b0fb"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
        {/* TN lettermark */}
        {/* T */}
        <line x1="14" y1="23" x2="24" y2="23" stroke="#36b0fb" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="19" y1="23" x2="19" y2="33" stroke="#36b0fb" strokeWidth="2.2" strokeLinecap="round"/>
        {/* N */}
        <line x1="27" y1="33" x2="27" y2="23" stroke="#7accff" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="27" y1="23" x2="36" y2="33" stroke="#7accff" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="36" y1="23" x2="36" y2="33" stroke="#7accff" strokeWidth="2.2" strokeLinecap="round"/>
        {/* Bottom accent line */}
        <line x1="14" y1="37" x2="42" y2="37" stroke="#0c93f0" strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round"/>
      </svg>

      {showWordmark && (
        <span
          className="font-bold tracking-tight select-none"
          style={{
            fontSize: size * 0.56,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ToolNestIn
        </span>
      )}
    </div>
  );
}
