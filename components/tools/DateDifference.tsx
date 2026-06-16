'use client';
import { useState, useMemo } from 'react';

export default function DateDifference() {
  const today = new Date().toISOString().split('T')[0];
  const [date1, setDate1] = useState('2024-01-01');
  const [date2, setDate2] = useState(today);
  const [excludeWeekends, setExcludeWeekends] = useState(false);

  const result = useMemo(() => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;
    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / 86400000);
    const weeks = Math.floor(totalDays / 7);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    const remDays = Math.floor((diffMs - (months * 30.44 * 86400000)) / 86400000);

    let workingDays = 0;
    if (excludeWeekends) {
      const cur = new Date(start);
      while (cur <= end) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) workingDays++;
        cur.setDate(cur.getDate() + 1);
      }
    }

    return { totalDays, weeks, months, years, remMonths, remDays: Math.abs(remDays), workingDays, isNegative: d1 > d2 };
  }, [date1, date2, excludeWeekends]);

  const PRESETS = [
    { label: 'Last 30 days', d1: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0], d2: today },
    { label: 'Last 90 days', d1: new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0], d2: today },
    { label: 'This year', d1: `${new Date().getFullYear()}-01-01`, d2: today },
    { label: 'Last year', d1: `${new Date().getFullYear() - 1}-01-01`, d2: `${new Date().getFullYear() - 1}-12-31` },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Start Date</label>
          <input type="date" className="tool-input" value={date1} onChange={e => setDate1(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">End Date</label>
          <input type="date" className="tool-input" value={date2} onChange={e => setDate2(e.target.value)} />
        </div>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => { setDate1(p.d1); setDate2(p.d2); }}
            className="px-3 py-1.5 rounded-lg text-xs border bg-white/3 border-white/10 text-slate-400 hover:border-brand-400/40 hover:text-brand-300 transition">
            {p.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <div onClick={() => setExcludeWeekends(!excludeWeekends)}
          className={`w-10 h-5 rounded-full transition relative ${excludeWeekends ? 'bg-brand-500' : 'bg-white/10'}`}>
          <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${excludeWeekends ? 'left-5' : 'left-0.5'}`} />
        </div>
        <span className="text-sm text-slate-400">Calculate working days (exclude weekends)</span>
      </label>

      {result && (
        <div className="space-y-3">
          <div className="bg-brand-500/10 border border-brand-400/30 rounded-2xl p-5 text-center">
            <div className="font-sans text-5xl font-black gradient-text">{result.totalDays.toLocaleString('en-IN')}</div>
            <div className="text-slate-400 text-sm mt-1">Total days{result.isNegative ? ' (end date is before start)' : ''}</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { l: 'Years', v: result.years },
              { l: 'Months', v: result.months },
              { l: 'Weeks', v: result.weeks.toLocaleString('en-IN') },
              { l: 'Working Days', v: excludeWeekends ? result.workingDays.toLocaleString('en-IN') : '—' },
            ].map(s => (
              <div key={s.l} className="glass rounded-xl p-3 text-center">
                <div className="font-sans font-extrabold text-slate-100 text-xl">{s.v}</div>
                <div className="text-xs text-slate-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-xl p-4 text-sm text-slate-400">
            Duration: <strong className="text-slate-200">
              {result.years > 0 ? `${result.years} year${result.years > 1 ? 's' : ''}, ` : ''}
              {result.remMonths > 0 ? `${result.remMonths} month${result.remMonths > 1 ? 's' : ''}, ` : ''}
              {result.remDays} day{result.remDays !== 1 ? 's' : ''}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}
