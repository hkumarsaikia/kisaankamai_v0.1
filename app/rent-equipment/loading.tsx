export default function Loading() {
  return (
    <div className="min-h-screen bg-background px-6 py-28 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 space-y-3">
          <div className="h-4 w-32 animate-[pulse_2.4s_ease-in-out_infinite] rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-10 w-64 animate-[pulse_2.4s_ease-in-out_infinite] rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="h-4 w-full max-w-xl animate-[pulse_2.4s_ease-in-out_infinite] rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-white/80 p-5 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/40"
            >
              <div className="mb-4 h-56 animate-[pulse_2.4s_ease-in-out_infinite] rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
              <div className="mb-3 h-4 w-24 animate-[pulse_2.4s_ease-in-out_infinite] rounded-full bg-slate-200/70 dark:bg-slate-800/70" />
              <div className="mb-3 h-7 w-2/3 animate-[pulse_2.4s_ease-in-out_infinite] rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
              <div className="mb-5 h-4 w-full animate-[pulse_2.4s_ease-in-out_infinite] rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
              <div className="h-10 w-full animate-[pulse_2.4s_ease-in-out_infinite] rounded-2xl bg-slate-200/75 dark:bg-slate-800/75" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

