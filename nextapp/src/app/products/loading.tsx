export default function Loading() {
  return (
    <div className="flex flex-col items-center py-20 text-gray-500" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <p className="mt-3">Loading…</p>
    </div>
  );
}