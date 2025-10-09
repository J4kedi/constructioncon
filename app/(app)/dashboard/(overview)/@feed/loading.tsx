export default function Loading() {
  const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent';
  return (
    <div className={`${shimmer} relative w-full overflow-hidden rounded-xl bg-secondary/20 p-6`}>
      <div className="h-7 w-48 rounded-md bg-secondary/40 mb-4"></div>
      <div className="space-y-4">
        <div className="h-5 w-full rounded-md bg-secondary/40"></div>
        <div className="h-5 w-5/6 rounded-md bg-secondary/40"></div>
        <div className="h-5 w-full rounded-md bg-secondary/40"></div>
        <div className="h-5 w-4/6 rounded-md bg-secondary/40"></div>
        <div className="h-5 w-3/4 rounded-md bg-secondary/40"></div>
      </div>
    </div>
  );
}