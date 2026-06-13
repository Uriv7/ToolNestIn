import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl mb-6">🪺</div>
        <h1 className="font-display text-5xl font-900 gradient-text mb-4">404</h1>
        <p className="text-slate-400 text-lg mb-8">This tool or page doesn&apos;t exist yet.</p>
        <Link href="/" className="btn-primary inline-block">← Back to All Tools</Link>
      </div>
    </div>
  );
}
