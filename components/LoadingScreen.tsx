export function LoadingScreen({
  title = "Loading workspace",
  subtitle = "Preparing the latest Kisan Kamai view...",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="min-h-[50vh] animate-pulse rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-8 shadow-sm">
      <div className="h-4 w-32 rounded-full bg-surface-container-high" />
      <div className="mt-6 h-10 w-72 max-w-full rounded-full bg-surface-container-high" />
      <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-surface-container-high" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="h-32 rounded-2xl bg-surface-container" />
        <div className="h-32 rounded-2xl bg-surface-container" />
        <div className="h-32 rounded-2xl bg-surface-container" />
      </div>
      <div className="mt-8">
        <p className="font-headline text-2xl font-bold text-primary">{title}</p>
        <p className="mt-2 text-sm text-on-surface-variant">{subtitle}</p>
      </div>
    </div>
  );
}
