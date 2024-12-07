"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Quiz Dinámico</h1>
      
      {/* Progress Bar Skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>

      {/* Question Card Skeleton */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Question Text Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Options Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </Card>
    </div>
  );
}
