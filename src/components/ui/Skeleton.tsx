import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
  lines?: number
  height?: string
}

export default function Skeleton({ className, lines = 1, height = 'h-4' }: SkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse rounded bg-slate-200',
            height
          )}
        />
      ))}
    </div>
  )
}

interface CardSkeletonProps {
  className?: string
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn('rounded-lg border border-slate-200 bg-white p-6 shadow-sm', className)}>
      <Skeleton lines={3} />
      <div className="mt-4 space-y-2">
        <Skeleton height="h-8" />
        <Skeleton height="h-4" />
      </div>
    </div>
  )
}

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4 border border-slate-200 rounded">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height="h-4" />
          ))}
        </div>
      ))}
    </div>
  )
}
