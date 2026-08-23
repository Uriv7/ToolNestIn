'use client';
import { useState, useRef } from 'react';
export default function ImageColorPicker() {
  const [picked, setPicked] = useState<string|null>(null);
  const [rgb, setRgb] = useState<[number,number,number]|null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Extract the image's dominant colours by quantizing every sampled pixel into
  // coarse RGB buckets, counting frequency, and returning the most common buckets.
  const extractPalette = (c: HTMLCanvasElement) => {
    const ctx = c.getContext('2d')!;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
    const step = Math.max(1, Math.floor((c.width * c.height) / 20000)) * 4; // sample ~5000 pixels max
    for (let i = 0; i < data.length; i += step) {
      const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
      if (a < 128) continue; // skip transparent pixels
      const key = `${Math.round(r/32)}-${Math.round(g/32)}-${Math.round(b/32)}`;
      const existing = buckets.get(key);
      if (existing) { existing.count++; existing.r += r; existing.g += g; existing.b += b; }
      else buckets.set(key, { count: 1, r, g, b });
    }
    const top = [...buckets.values()].sort((a, b) => b.count - a.count).slice(0, 6);
    return top.map(({ count, r, g, b }) => {
      const avgR = Math.round(r / count), avgG = Math.round(g / count), avgB = Math.round(b / count);
      return `#${avgR.toString(16).padStart(2,'0')}${avgG.toString(16).padStart(2,'0')}${avgB.toString(16).padStart(2,'0')}`;
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const img = new Image(); img.onload = () => {
      const c = canvasRef.current!; c.width = img.width; c.height = img.height;
      c.getContext('2d')!.drawImage(img, 0, 0); setImgLoaded(true);
      setPalette(extractPalette(c));
    };
    img.src = URL.createObjectURL(f);
  };
  const pick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!; const rect = c.getBoundingClientRect();
    const x = Math.floor((e.clientX-rect.left)*(c.width/rect.width));
    const y = Math.floor((e.clientY-rect.top)*(c.height/rect.height));
    const data = c.getContext('2d')!.getImageData(x,y,1,1).data; const r=data[0],g=data[1],b=data[2];
    setRgb([r,g,b]); setPicked(`#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`);
  };
  return (
    <div className="space-y-4">
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Upload Image</label><input type="file" accept="image/*" onChange={handleFile} className="tool-input text-sm" aria-label="Upload Image" /></div>
      {imgLoaded && <p className="text-xs text-slate-400 text-center">Click anywhere on the image to pick a colour</p>}
      <canvas ref={canvasRef} onClick={pick} className={`rounded-xl border border-white/10 w-full cursor-crosshair ${imgLoaded?'':'hidden'}`} style={{maxHeight:'300px',objectFit:'contain'}} />
      {palette.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Dominant colours</label>
          <div className="flex gap-2 flex-wrap">
            {palette.map(hex => (
              <button key={hex} onClick={() => { navigator.clipboard.writeText(hex.toUpperCase()); setPicked(hex); const n=parseInt(hex.slice(1),16); setRgb([(n>>16)&255,(n>>8)&255,n&255]); }}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/3 border border-white/10 hover:border-white/25 transition">
                <span className="w-6 h-6 rounded-full border border-white/20 shrink-0" style={{ background: hex }} />
                <span className="font-mono text-xs text-slate-400">{hex.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {picked && rgb && (
        <div className="bg-gradient-to-br from-brand-950/60 to-dark-800 rounded-2xl border border-brand-400/20 p-5 flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl border border-white/20 flex-shrink-0" style={{background:picked}} />
          <div className="space-y-1">
            <div className="flex gap-2 items-center"><span className="font-mono font-extrabold text-xl text-slate-200">{picked.toUpperCase()}</span><button onClick={()=>navigator.clipboard.writeText(picked.toUpperCase())} className="text-xs text-slate-500 hover:text-brand-400">📋</button></div>
            <div className="text-slate-400 text-sm">rgb({rgb[0]}, {rgb[1]}, {rgb[2]})</div>
          </div>
        </div>
      )}
    </div>
  );
}
