'use client';
import { useState, useRef, useEffect } from 'react';

export default function QRGenerator() {
  const [input, setInput] = useState('');
  const [type, setType] = useState<'url' | 'text' | 'email' | 'phone'>('url');
  const [size, setSize] = useState(200);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const TYPES = [
    { id: 'url' as const, label: '🌐 URL' },
    { id: 'text' as const, label: '📝 Text' },
    { id: 'email' as const, label: '📧 Email' },
    { id: 'phone' as const, label: '📞 Phone' },
  ];

  const getContent = () => {
    if (type === 'email' && !input.startsWith('mailto:')) return `mailto:${input}`;
    if (type === 'phone' && !input.startsWith('tel:')) return `tel:${input}`;
    return input;
  };

  const generateQR = async () => {
    if (!input.trim()) return;
    setLoading(true);

    // Use a free QR API (no-key needed)
    const content = encodeURIComponent(getContent());
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${content}&bgcolor=060d16&color=1eb3f0&format=png`;
    
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const dataUrl = URL.createObjectURL(blob);
      setQrDataUrl(dataUrl);
    } catch {
      // Fallback: draw basic QR placeholder on canvas
      setQrDataUrl('');
    }
    setLoading(false);
  };

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qrcode-toolnestin.png';
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {TYPES.map(t => (
          <button key={t.id} onClick={() => { setType(t.id); setQrDataUrl(''); }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${type === t.id ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
          {type === 'url' ? 'Website URL' : type === 'email' ? 'Email Address' : type === 'phone' ? 'Phone Number' : 'Text Content'}
        </label>
        <input type="text" className="tool-input" value={input} onChange={e => setInput(e.target.value)}
          placeholder={type === 'url' ? 'https://toolnestin.co.in' : type === 'email' ? 'hello@example.com' : type === 'phone' ? '+91 98765 43210' : 'Enter any text...'} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Size: {size}×{size}px</label>
        <input type="range" min="100" max="500" step="50" value={size} onChange={e => setSize(+e.target.value)} className="w-full accent-brand-400" />
      </div>

      <button onClick={generateQR} disabled={!input.trim() || loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? '⏳ Generating...' : '▣ Generate QR Code'}
      </button>

      {qrDataUrl && (
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-dark-900 rounded-2xl border border-brand-400/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="Generated QR Code" className="rounded-lg" style={{ width: size, height: size, maxWidth: '100%' }} />
          </div>
          <div className="flex gap-3">
            <button onClick={download} className="btn-primary">⬇ Download PNG</button>
            <button onClick={() => { setQrDataUrl(''); setInput(''); }} className="btn-secondary">🗑 Clear</button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
      <p className="text-xs text-slate-600 text-center">QR codes are generated via a public API. For sensitive data, use an offline tool.</p>
    </div>
  );
}
