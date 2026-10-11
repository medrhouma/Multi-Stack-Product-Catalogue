'use client';

export default function ProductsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
      <p className="mb-3">Could not load products. Please try again later.</p>
      <button onClick={reset} className="rounded bg-red-600 px-3 py-1.5 text-white">
        Retry
      </button>
    </div>
  );
}