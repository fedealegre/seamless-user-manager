
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const UsersLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-2">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersLoadingSkeleton;
