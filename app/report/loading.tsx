export default function ReportLoading() {
  return (
    <main className="min-h-screen bg-background pt-20 text-on-background">
      <section className="relative flex min-h-[400px] items-center overflow-hidden bg-primary-container">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-primary/85 via-primary-container/60 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <div className="h-14 w-80 rounded-full bg-white/25" />
          <div className="mt-6 h-6 w-full max-w-xl rounded-full bg-white/20" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-2xl border border-outline-variant bg-surface-container-lowest" />
          ))}
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="h-[620px] animate-pulse rounded-3xl bg-surface-container-lowest lg:col-span-2" />
          <div className="h-56 animate-pulse rounded-3xl bg-secondary-fixed/30" />
        </div>
      </section>
    </main>
  );
}
