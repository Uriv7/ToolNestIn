'use client';
import { useState, useMemo } from 'react';

// Indian public holidays 2026 (approximate)
const HOLIDAYS_2026 = [
  '2026-01-26', // Republic Day
  '2026-03-17', // Holi
  '2026-04-02', // Ram Navami
  '2026-04-06', // Good Friday
  '2026-04-14', // Dr. Ambedkar Jayanti
  '2026-05-01', // Labour Day
  '2026-06-17', // Eid ul-Adha
  '2026-08-15', // Independence Day
  '2026-08-29', // Janmashtami
  '2026-10-02', // Gandhi Jayanti
  '2026-10-20', // Dussehra
  '2026-11-04', // Diwali
  '2026-11-15', // Guru Nanak Jayanti
  '2026-12-25', // Christmas
];

export default function WorkingDaysCalculator() {
  const today = new Date().toISOString().split('T')[0];
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [excludeHolidays, setExcludeHolidays] = useState(true);
  const [addDays, setAddDays] = useState('');
  const [addMode, setAddMode] = useState(false);

  const result = useMemo(() => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d1 > d2) return null;

    let working = 0, weekends = 0, holidays = 0;
    const cur = new Date(d1);
    while (cur <= d2) {
      const dateStr = cur.toISOString().split('T')[0];
      const day = cur.getDay();
      if (day === 0 || day === 6) weekends++;
      else if (excludeHolidays && HOLIDAYS_2026.includes(dateStr)) holidays++;
      else working++;
      cur.setDate(cur.getDate() + 1);
    }
    const total = Math.floor((d2.getTime() - d1.getTime()) / 86400000) + 1;
    return { working, weekends, holidays, total };
  }, [start, end, excludeHolidays]);

  // Add working days to a date
  const addedDate = useMemo(() => {
    if (!addMode || !addDays || !start) return null;
    const n = parseInt(addDays);
    if (isNaN(n) || n <= 0) return null;
    let count = 0;
    const cur = new Date(start);
    while (count < n) {
      cur.setDate(cur.getDate() + 1);
      const day = cur.getDay();
      const dateStr = cur.toISOString().split('T')[0];
      if (day !== 0 && day !== 6 && !(excludeHolidays && HOLIDAYS_2026.includes(dateStr))) count++;
    }
    return cur.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [addMode, addDays, start, excludeHolidays]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {[false, true].map(m => (
          <button key={String(m)} onClick={() => setAddMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${addMode === m ? 'bg-brand-500/20 border-brand-400/50 text-brand-300' : 'bg-white/3 border-white/10 text-slate-500 hover:text-slate-300'}`}>
            {m ? '➕ Add Working Days to Date' : '📅 Count Working Days'}
          </button>
        ))}
      </div>

      {!addMode ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Start Date</label>
            <input type="date" className="tool-input" value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">End Date</label>
            <input type="date" className="tool-input" value={end} onChange={e => setEnd(e.target.value)} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">From Date</label>
            <input type="date" className="tool-input" value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Add Working Days</label>
            <input type="number" className="tool-input" value={addDays} onChange={e => setAddDays(e.target.value)} placeholder="e.g. 30" min="1" />
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 cursor-pointer">
        <div onClick={() => setExcludeHolidays(!excludeHolidays)}
          className={`w-10 h-5 rounded-full transition relative ${excludeHolidays ? 'bg-brand-500' : 'bg-white/10'}`}>
          <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${excludeHolidays ? 'left-5' : 'left-0.5'}`} />
        </div>
        <span className="text-sm text-slate-400">Exclude Indian public holidays 2026</span>
      </label>

      {!addMode && result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: 'Working Days', v: result.working, h: true },
            { l: 'Total Days', v: result.total },
            { l: 'Weekends', v: result.weekends },
            { l: 'Holidays', v: result.holidays },
          ].map(s => (
            <div key={s.l} className={`rounded-2xl p-4 border text-center ${s.h ? 'bg-brand-500/15 border-brand-400/40' : 'bg-white/3 border-white/10'}`}>
              <div className={`font-sans text-2xl font-extrabold ${s.h ? 'gradient-text' : 'text-slate-200'}`}>{s.v}</div>
              <div className="text-xs text-slate-500 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {addMode && addedDate && (
        <div className="bg-brand-500/10 border border-brand-400/30 rounded-2xl p-5 text-center">
          <div className="text-sm text-slate-500 mb-2">After {addDays} working days from {new Date(start).toLocaleDateString('en-IN')}</div>
          <div className="font-sans text-2xl font-extrabold text-slate-100">{addedDate}</div>
        </div>
      )}

      <div className="glass rounded-xl p-3 text-xs text-slate-500">
        Holidays based on central government gazetted holidays 2026. State-specific holidays may vary.
      </div>
    </div>
  );
}
