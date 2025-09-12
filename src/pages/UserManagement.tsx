
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserManagement } from "@/hooks/use-user-management";
import UsersTable from "@/components/users/UsersTable";
import UsersLoadingSkeleton from "@/components/users/UsersLoadingSkeleton";
import UserActionDialogs from "@/components/users/UserActionDialogs";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import CollapsibleUserSearch from "@/components/users/CollapsibleUserSearch";
import UserSearchHistoryDialog from "@/components/users/UserSearchHistoryDialog";
import { Badge } from "@/components/ui/badge";
import { Filter, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserManagement = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const {
    users,
    isLoading,
    isSubmitting,
    searchParams,
    handleSearch,
    selectedUser,
    setSelectedUser,
    showBlockDialog,
    setShowBlockDialog,
    showUnblockDialog,
    setShowUnblockDialog,
    handleBlockUser,
    handleUnblockUser,
    searchHistory,
    clearSearchHistory,
    executeSearch,
    searchConfig
  } = useUserManagement();

  // Calculate the number of active filters
  const activeFiltersCount = searchParams ? 
    Object.keys(searchParams).filter(key => searchParams[key] !== "").length : 0;

  const handleViewUserDetails = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  const handleViewUserWallets = (userId: number) => {
    navigate(`/users/${userId}?tab=wallets`);
  };

  const handleViewUserTransactions = (userId: number) => {
    navigate(`/users/${userId}?tab=transactions`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("user-management")}</h1>
          <p className="text-muted-foreground">{t("manage-monitor-customer-accounts")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHistoryDialog(true)}
            className="h-10 w-10"
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {t("filters")}
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 bg-primary/20 text-primary text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <CollapsibleUserSearch
          searchConfig={searchConfig}
          onSearch={handleSearch}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      <Card>
        <CardHeader className="py-4">
          <CardTitle>{t("users")}</CardTitle>
          <CardDescription>
            {isLoading ? t("loading") :
              users && users.length > 0
                ? `${users.length} ${t("users-found")}`
                : t("no-users-found")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <UsersLoadingSkeleton />
          ) : (
            <UsersTable
              users={users || []}
              setSelectedUser={setSelectedUser}
              setShowBlockDialog={setShowBlockDialog}
              setShowUnblockDialog={setShowUnblockDialog}
              onViewDetails={handleViewUserDetails}
              onViewWallets={handleViewUserWallets}
              onViewTransactions={handleViewUserTransactions}
            />
          )}
        </CardContent>
      </Card>

      <UserActionDialogs
        selectedUser={selectedUser}
        showBlockDialog={showBlockDialog}
        setShowBlockDialog={setShowBlockDialog}
        showUnblockDialog={showUnblockDialog}
        setShowUnblockDialog={setShowUnblockDialog}
        handleBlockUser={handleBlockUser}
        handleUnblockUser={handleUnblockUser}
        isSubmitting={isSubmitting}
      />

      <UserSearchHistoryDialog
        open={showHistoryDialog}
        onClose={() => setShowHistoryDialog(false)}
        searchHistory={searchHistory}
        onClearHistory={clearSearchHistory}
        onExecuteSearch={executeSearch}
        searchConfig={searchConfig}
      />
    </div>
  );
};

export default UserManagement;
