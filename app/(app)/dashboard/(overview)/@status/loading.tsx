export default function Loading() {
  const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent';
  return (
    <div className={`${shimmer} relative w-full overflow-hidden rounded-xl bg-secondary/20 p-6`}>
      <div className="h-7 w-40 rounded-md bg-secondary/40 mb-4"></div>
      <div className="h-48 w-48 mx-auto rounded-full bg-secondary/40"></div>
    </div>
  );
}
