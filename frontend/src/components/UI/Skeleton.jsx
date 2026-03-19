export function SkeletonLine({ className = '' }) {
  return (
    <div className={`bg-white/5 rounded animate-pulse ${className}`} />
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card p-5 space-y-3 ${className}`}>
      <SkeletonLine className="h-4 w-1/3" />
      <SkeletonLine className="h-3 w-full" />
      <SkeletonLine className="h-3 w-4/5" />
    </div>
  )
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default function Skeleton({ count = 3 }) {
  return <SkeletonList count={count} />
}
