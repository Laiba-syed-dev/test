export function PageLoading({ dashboard = false }: { dashboard?: boolean }) {
  return (
    <section aria-label="Loading page content" aria-busy="true" className="animate-pulse">
      {dashboard && <div className="mb-7 space-y-2"><div className="h-3 w-36 rounded bg-[#E4ECEC]" /><div className="h-8 w-56 rounded bg-[#E4ECEC]" /><div className="h-4 w-64 max-w-[70vw] rounded bg-[#E4ECEC]" /></div>}
      <div className="mb-5 grid gap-4 sm:grid-cols-3"><div className="h-32 rounded-2xl bg-white ring-1 ring-line" /><div className="h-32 rounded-2xl bg-white ring-1 ring-line" /><div className="h-32 rounded-2xl bg-white ring-1 ring-line" /></div>
      <div className="h-[360px] rounded-2xl bg-white ring-1 ring-line" />
    </section>
  );
}
