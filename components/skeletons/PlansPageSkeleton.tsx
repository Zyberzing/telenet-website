import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal } from "lucide-react";

// Individual plan card skeleton
export function PlanCardSkeleton() {
  return (
    <div>
      {/* Coverage badge skeleton */}
      <div className="flex justify-between items-center mb-1">
        <Skeleton className="h-6 w-20 rounded-[7px]" />
      </div>

      {/* Plan card skeleton */}
      <div className="rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 bg-[#F1F8FE] dark:bg-gray-900 flex flex-col justify-between">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-16" /> {/* Price */}
          <Skeleton className="h-6 w-6 rounded" /> {/* Arrow icon */}
        </div>

        <div className="flex gap-3 mt-6">
          <div className="gap-4">
            <Skeleton className="h-4 w-12 mb-2" /> {/* Validity label */}
            <Skeleton className="h-5 w-16" /> {/* Validity value */}
          </div>
          <div className="gap-4">
            <Skeleton className="h-4 w-8 mb-2" /> {/* Data label */}
            <Skeleton className="h-5 w-12" /> {/* Data value */}
          </div>
        </div>

        <Skeleton className="mt-6 h-10 w-full rounded-full" /> {/* Buy button */}
      </div>
    </div>
  );
}

// Filter sidebar skeleton
export function FilterSidebarSkeleton() {
  return (
    <aside className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
      <h2 className="font-[400] text-lg mb-4 flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5 text-purple-600" />
        Filter
      </h2>

      {/* Country dropdown skeleton */}
      <div className="mt-5">
        <Skeleton className="h-4 w-16 mb-2" /> {/* Label */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Dropdown */}
      </div>

      {/* Region dropdown skeleton */}
      <div className="mt-5">
        <Skeleton className="h-4 w-12 mb-2" /> {/* Label */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Dropdown */}
      </div>

      {/* Data size slider skeleton */}
      <div className="mt-5">
        <Skeleton className="h-4 w-16 mb-2" /> {/* Label */}
        <Skeleton className="h-2 w-full rounded-full mt-2" /> {/* Slider */}
        <div className="flex justify-between mt-1">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </aside>
  );
}

// Main plans grid skeleton
export function PlansGridSkeleton() {
  return (
    <main className="lg:col-span-4">
      <Skeleton className="h-8 w-48 mb-6" /> {/* Title */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <PlanCardSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}

// Complete plans page skeleton
export function PlansPageSkeleton() {
  return (
    <section className="w-full min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Banner skeleton */}
      <div className="relative w-full h-[22.6vh] bg-gray-200 dark:bg-gray-800 animate-pulse">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Browse Plans Section skeleton */}
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <FilterSidebarSkeleton />
          <PlansGridSkeleton />
        </div>
      </div>
    </section>
  );
}

// Compact skeleton for loading states
export function PlansLoadingSkeleton() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-950">
      {/* Header skeleton */}
      <div className="h-[22.6vh] bg-gray-100 dark:bg-gray-800 animate-pulse" />

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Sidebar */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>

          {/* Main content */}
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-20" />
                  <div className="border dark:border-gray-700 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-6 w-6" />
                    </div>
                    <div className="flex gap-3">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
