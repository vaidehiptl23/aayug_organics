import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton-pulse rounded bg-gray-200 dark:bg-gray-700",
        className
      )}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <Skeleton className="mb-4 h-52 w-full rounded-xl" />
      <Skeleton className="mb-2 h-3 w-1/3 rounded" />
      <Skeleton className="mb-3 h-5 w-3/4 rounded" />
      <Skeleton className="mb-3 h-4 w-1/2 rounded" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-64 rounded" />
      <Skeleton className="h-4 w-96 rounded" />
    </div>
  );
}
