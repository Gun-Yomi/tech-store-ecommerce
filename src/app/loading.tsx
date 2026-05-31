export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f5f9ff]">
      <div className="border-b border-[#cfe0f2] bg-[#f7fbff]">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-[#cfe0f2]" />
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-[#cfe0f2]" />
            <div className="h-3 w-28 animate-pulse rounded bg-[#d6ecff]" />
          </div>
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="h-8 w-48 animate-pulse rounded bg-[#cfe0f2]" />
            <div className="h-12 max-w-2xl animate-pulse rounded bg-[#d6ecff]" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-[#cfe0f2] bg-white p-4 shadow-sm"
                >
                  <div className="aspect-[4/3] animate-pulse rounded-lg bg-[#edf6ff]" />
                  <div className="mt-4 h-4 w-24 animate-pulse rounded bg-[#cfe0f2]" />
                  <div className="mt-3 h-5 w-4/5 animate-pulse rounded bg-[#d6ecff]" />
                  <div className="mt-5 h-10 animate-pulse rounded-lg bg-[#cfe0f2]" />
                </div>
              ))}
            </div>
          </div>
          <aside className="hidden h-72 animate-pulse rounded-lg border border-[#cfe0f2] bg-white lg:block" />
        </div>
      </section>
    </main>
  );
}
