export default function Loading() {
  return (
    <div className="min-h-screen bg-background px-6 py-32 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 h-12 w-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/40"
            >
              <div className="mb-5 h-56 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="mb-3 h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mb-3 h-8 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mb-6 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
