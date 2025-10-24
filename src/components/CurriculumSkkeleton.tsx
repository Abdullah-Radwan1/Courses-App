import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CurriculumSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Checkbox skeleton */}
      <Skeleton className="h-5 w-5 rounded mt-1" />

      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-8 rounded" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-10 ml-auto" />
    </div>
  );
};

export default CurriculumSkeleton;
