'use client';
import { useState, useMemo } from 'react';

export default function AgeCalculator() {
  const today = new Date().toISOString().split('T')[0];
  const [dob, setDob] = useState('');
  const [refDate, setRefDate] = useState(today);

  const result = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const ref = new Date(refDate || today);
    if (birth > ref) return null;

    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prev = new Date(ref.getFullYear(), ref.getMonth(), 0);
      days += prev.getDate();
    }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((ref.getTime() - birth.getTime()) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);

    const nextBirthday = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= ref) nextBirthday.setFullYear(ref.getFullYear() + 1);
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - ref.getTime()) / 86400000);

    return { years, months, days, totalDays, totalWeeks, daysUntilBirthday };
  }, [dob, refDate]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Date of Birth</label>
          <input type="date" className="tool-input" value={dob} onChange={e => setDob(e.target.value)} max={today} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Age At Date</label>
          <input type="date" className="tool-input" value={refDate} onChange={e => setRefDate(e.target.value)} />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-brand-500/10 border border-brand-400/30 rounded-2xl p-6 text-center">
            <div className="font-sans text-5xl font-black gradient-text mb-1">
              {result.years} <span className="text-2xl">yrs</span> {result.months} <span className="text-2xl">mo</span> {result.days} <span className="text-2xl">days</span>
            </div>
            <p className="text-slate-500 text-sm mt-2">Your exact age</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: result.totalDays.toLocaleString(), l: 'Total Days' },
              { v: result.totalWeeks.toLocaleString(), l: 'Total Weeks' },
              { v: result.daysUntilBirthday.toString(), l: 'Days to Birthday 🎂' },
            ].map(s => (
              <div key={s.l} className="glass rounded-xl p-3 text-center">
                <div className="font-sans font-extrabold text-slate-100 text-lg">{s.v}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
