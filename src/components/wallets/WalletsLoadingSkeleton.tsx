
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WalletsLoadingSkeletonProps {
  showUser?: boolean;
}

export const WalletsLoadingSkeleton: React.FC<WalletsLoadingSkeletonProps> = ({ showUser = false }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            {showUser && <TableHead>User ID</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Available Balance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-5 w-12" /></TableCell>
              {showUser && <TableCell><Skeleton className="h-5 w-12" /></TableCell>}
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-10" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
