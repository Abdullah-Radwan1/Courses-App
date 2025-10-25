import React from "react";
import { Skeleton } from "./ui/skeleton";

const CustomSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1].map((n) => (
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

export default CustomSkeleton;
