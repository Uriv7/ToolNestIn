'use client';
import { useState, useRef } from 'react';
export default function ImageColorPicker() {
  const [picked, setPicked] = useState<string|null>(null);
  const [rgb, setRgb] = useState<[number,number,number]|null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const img = new Image(); img.onload = () => {
      const c = canvasRef.current!; c.width = img.width; c.height = img.height;
      c.getContext('2d')!.drawImage(img, 0, 0); setImgLoaded(true);
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
      <div><label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Upload Image</label><input type="file" accept="image/*" onChange={handleFile} className="tool-input text-sm" /></div>
      {imgLoaded && <p className="text-xs text-slate-400 text-center">Click anywhere on the image to pick a colour</p>}
      <canvas ref={canvasRef} onClick={pick} className={`rounded-xl border border-white/10 w-full cursor-crosshair ${imgLoaded?'':'hidden'}`} style={{maxHeight:'300px',objectFit:'contain'}} />
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
