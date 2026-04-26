export default function SupportLoading() {
  return (
    <main className="min-h-screen bg-background pt-20 text-on-background">
      <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-primary-container">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-primary/80 via-primary-container/65 to-secondary/40" />
        <div className="relative z-10 h-12 w-72 rounded-full bg-white/25" />
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-2xl border border-outline-variant bg-surface-container-lowest" />
          ))}
        </div>
        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          <div className="h-[520px] animate-pulse rounded-3xl border border-outline-variant bg-surface-container-lowest lg:col-span-3" />
          <div className="h-[420px] animate-pulse rounded-3xl bg-primary-container lg:col-span-2" />
        </div>
      </section>
    </main>
  );
}
