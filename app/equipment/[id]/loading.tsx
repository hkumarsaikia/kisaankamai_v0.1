export default function Loading() {
  return (
    <div className="min-h-screen bg-surface px-4 pb-12 pt-24 dark:bg-slate-950 md:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-6 h-6 w-80 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            <div className="aspect-[16/9] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
