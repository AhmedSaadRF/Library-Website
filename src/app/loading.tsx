export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 overflow-hidden rounded-[2rem] bg-brand/10">
            <div className="h-full w-full shimmer" />
          </div>
        ))}
      </div>
    </main>
  );
}
