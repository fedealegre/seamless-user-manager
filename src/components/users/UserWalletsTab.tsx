
import React from "react";
import { Wallet } from "@/lib/api/types";
import { WalletsTable } from "@/components/wallets/WalletsTable";
import { WalletsLoadingSkeleton } from "@/components/wallets/WalletsLoadingSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UserWalletsTabProps {
  userId: string;
  wallets: Wallet[];
  isLoading: boolean;
}

export const UserWalletsTab: React.FC<UserWalletsTabProps> = ({ userId, wallets, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Wallets</CardTitle>
        <CardDescription>
          {isLoading ? "Loading..." : wallets.length > 0 
            ? `${wallets.length} wallets found` 
            : "No wallets found for this user"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <WalletsLoadingSkeleton />
        ) : (
          <WalletsTable wallets={wallets} />
        )}
      </CardContent>
    </Card>
  );
};
