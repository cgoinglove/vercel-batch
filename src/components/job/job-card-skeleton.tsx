export default function JobCardSkeleton() {
  return (
    <div className="w-full h-[600px] flex flex-col px-6 md:px-12 py-10 animate-pulse">
      <div className="mb-10">
        <div className="bg-white/40 w-2/3 mb-4 h-6 rounded-full" />
        <div className="bg-white/20 h-4 mb-3 rounded-full" />
        <div className="bg-white/20 w-3/4 h-4 rounded-full" />
      </div>
      <div className="bg-white/10 h-full rounded-xl" />
    </div>
  );
}
