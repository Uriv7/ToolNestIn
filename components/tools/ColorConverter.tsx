'use client';
import { useState } from 'react';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const PRESETS = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F','#1eb3f0','#FF8C42'];

export default function ColorConverter() {
  const [hex, setHex] = useState('#1eb3f0');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const isValidHex = (h: string) => /^#[0-9A-Fa-f]{6}$/.test(h);

  const handleHexChange = (val: string) => {
    const v = val.startsWith('#') ? val : '#' + val;
    setHex(v.toUpperCase());
    setError(!isValidHex(v) && v.length > 1 ? 'Invalid HEX. Use format #RRGGBB' : '');
  };

  const rgb = isValidHex(hex) ? hexToRgb(hex) : null;
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(''), 1500); };

  const CopyRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between px-4 py-3 bg-white/3 border border-white/8 rounded-xl">
      <span className="text-xs text-slate-500 uppercase tracking-widest w-12">{label}</span>
      <code className="font-mono text-brand-300 font-600 flex-1 mx-3">{value}</code>
      <button onClick={() => copy(value)} className="text-xs text-slate-600 hover:text-brand-400 transition">{copied === value ? '✓' : '📋'}</button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Color picker + hex */}
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Color Picker</label>
          <div className="relative">
            <input type="color" value={isValidHex(hex) ? hex : '#000000'} onChange={e => setHex(e.target.value.toUpperCase())}
              className="w-16 h-12 rounded-xl border border-white/10 cursor-pointer bg-transparent p-1" />
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">HEX Code</label>
          <input type="text" className="tool-input font-mono uppercase" value={hex} onChange={e => handleHexChange(e.target.value)} placeholder="#1EB3F0" maxLength={7} />
          {error && <p className="text-rose-400 text-xs mt-1">{error}</p>}
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-xs font-600 text-slate-400 uppercase tracking-widest mb-2">Presets</label>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map(p => (
            <button key={p} onClick={() => { setHex(p); setError(''); }}
              className="w-9 h-9 rounded-lg border-2 transition hover:scale-110"
              style={{ background: p, borderColor: hex === p ? 'white' : 'transparent' }} />
          ))}
        </div>
      </div>

      {/* Preview */}
      {rgb && hsl && (
        <>
          <div className="h-20 rounded-2xl border border-white/10 transition-all" style={{ background: hex }} />

          <div className="space-y-2">
            <CopyRow label="HEX" value={hex} />
            <CopyRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
            <CopyRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
            <CopyRow label="CSS" value={`color: ${hex};`} />
          </div>
        </>
      )}
    </div>
  );
}
