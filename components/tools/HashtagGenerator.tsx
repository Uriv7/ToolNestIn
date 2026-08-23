'use client';
import { useState, useMemo } from 'react';

const HASHTAG_DB: Record<string, string[]> = {
  food: ['#foodie','#instafood','#foodphotography','#foodblogger','#yummy','#delicious','#homemade','#indianfood','#foodlover','#foodpics','#tasty','#cooking','#recipe','#foodgram','#foodstagram','#chefmode','#foodiesofinstagram','#healthyfood','#streetfood','#mumbaifoods'],
  travel: ['#travel','#travelphotography','#travelgram','#wanderlust','#explore','#instatravel','#incredibleindia','#travelblogger','#goexplore','#adventure','#traveldiaries','#trip','#vacation','#holidays','#backpacking','#traveler','#traveltheworld','#tourism','#travelpics','#indiatravel'],
  business: ['#business','#entrepreneur','#startup','#success','#motivation','#marketing','#smallbusiness','#entrepreneurship','#businessowner','#hustle','#growth','#invest','#finance','#money','#wealth','#india','#startupindia','#madeinIndia','#digital','#innovation'],
  fitness: ['#fitness','#gym','#workout','#fitnessmotivation','#fit','#health','#bodybuilding','#training','#healthylifestyle','#fitfam','#exercise','#yoga','#crossfit','#running','#lifestyle','#motivation','#gymlife','#weightloss','#gains','#fitindia'],
  fashion: ['#fashion','#style','#ootd','#fashionblogger','#outfit','#instafashion','#fashionista','#clothing','#accessories','#trendy','#streetstyle','#look','#outfitoftheday','#stylish','#indianfashion','#ethnicwear','#saree','#kurta','#designerwear','#fashionphotography'],
  tech: ['#technology','#tech','#coding','#programming','#developer','#software','#innovation','#ai','#machinelearning','#webdevelopment','#javascript','#python','#india','#techstartup','#digitaltransformation','#cybersecurity','#cloud','#devops','#reactjs','#techblogger'],
  photography: ['#photography','#photo','#photographer','#photooftheday','#picoftheday','#instaphoto','#naturephotography','#portrait','#landscape','#mobilephotography','#streetphotography','#lightroom','#canon','#nikon','#travel','#india','#photoblog','#photographylover','#instagood','#photolovers'],
  motivation: ['#motivation','#inspiration','#success','#mindset','#positivity','#hustle','#goals','#believe','#growth','#quotes','#motivationalquotes','#lifequotes','#entrepreneur','#dailymotivation','#keepgoing','#nevergiveuп','#focusedon','#workhard','#dream','#achieve'],
};

export default function HashtagGenerator() {
  const [niche, setNiche] = useState('');
  const [custom, setCustom] = useState('');
  const [count, setCount] = useState(20);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const base = HASHTAG_DB[niche] || [];
    const customTags = custom.split(/[\s,]+/).filter(t => t.trim()).map(t => '#' + t.trim().replace(/^#/, '').replace(/\s+/g, ''));
    const combined = [...customTags, ...base];
    const unique = Array.from(new Set(combined));
    return unique.slice(0, count);
  }, [niche, custom, count]);

  const copy = () => {
    navigator.clipboard.writeText(result.join(' '));
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Select Niche</label>
          <select className="tool-input" value={niche} onChange={e => setNiche(e.target.value)}>
            <option value="">-- Select a category --</option>
            {Object.keys(HASHTAG_DB).map(k => (
              <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Count: {count}
          </label>
          <input type="range" min="5" max="30" value={count} onChange={e => setCount(+e.target.value)}
            className="w-full accent-brand-400 mt-2"  aria-label="Add Your Keywords"/>
          <div className="flex justify-between text-xs text-slate-600 mt-1"><span>5</span><span>30</span></div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Add Your Keywords</label>
        <input type="text" className="tool-input" value={custom}
          onChange={e => setCustom(e.target.value)}
          placeholder="e.g. mumbai, restaurant, italianfood (comma or space separated)" />
      </div>

      {result.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{result.length} hashtags generated</span>
            <button onClick={copy} className="btn-primary text-sm">{copied ? '✓ Copied All!' : '📋 Copy All'}</button>
          </div>
          <div className="bg-dark-900/80 border border-white/10 rounded-xl p-4">
            <div className="flex flex-wrap gap-2">
              {result.map(tag => (
                <span key={tag} onClick={() => { navigator.clipboard.writeText(tag); }}
                  className="px-2 py-1 rounded-lg bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs cursor-pointer hover:bg-brand-500/20 transition">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2">Click any hashtag to copy individually. Instagram allows up to 30 hashtags per post.</p>
        </div>
      )}
    </div>
  );
}
