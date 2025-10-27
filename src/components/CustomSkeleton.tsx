import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";

export const CustomSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2].map((n) => (
        <div key={n} className="flex gap-3 pb-4 border-b last:border-0">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const LeaderboardSkeleton = () => (
  <div className="space-y-3 mt-4">
    {[1, 2, 3].map((n) => (
      <Card
        key={n}
        className="flex items-center justify-between p-4 rounded-xl shadow-sm border"
      >
        <div className="flex items-center gap-3">
          <Skeleton className="w-5 h-5 rounded-full" />
          <div>
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-40 rounded-full" />
      </Card>
    ))}
  </div>
);
