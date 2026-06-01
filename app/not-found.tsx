import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[#007A42] text-sm font-bold tracking-widest uppercase mb-4">404</p>
        <h1 className="text-5xl font-bold text-white mb-4">Page not found</h1>
        <p className="text-white/50 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0A1628] font-semibold text-sm hover:bg-gray-100 transition-colors"
        >
          Return Home
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
