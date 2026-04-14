export default function Loading() {
  return (
    <div className="min-h-screen bg-surface px-4 pb-12 pt-24 dark:bg-slate-950 md:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-6 space-y-3">
          <div className="h-4 w-28 animate-[pulse_2.4s_ease-in-out_infinite] rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-10 w-72 animate-[pulse_2.4s_ease-in-out_infinite] rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div className="aspect-[16/9] animate-[pulse_2.4s_ease-in-out_infinite] rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-square animate-[pulse_2.4s_ease-in-out_infinite] rounded-2xl bg-slate-200/70 dark:bg-slate-800/70" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="h-[520px] animate-[pulse_2.4s_ease-in-out_infinite] rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
          </div>
        </div>
      </div>
    </div>
  );
}

