import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserManagement } from "@/hooks/use-user-management";
import UsersTable from "@/components/users/UsersTable";
import UsersLoadingSkeleton from "@/components/users/UsersLoadingSkeleton";
import UserActionDialogs from "@/components/users/UserActionDialogs";
import { useNavigate } from "react-router-dom";
import { Filter, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import CollapsibleUserSearch from "@/components/users/CollapsibleUserSearch";
import UserSearchHistoryDialog from "@/components/users/UserSearchHistoryDialog";
import { Badge } from "@/components/ui/badge";

const UserManagement = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  const {
    users,
    isLoading,
    searchParams,
    handleSearch,
    selectedUser,
    setSelectedUser,
    showDeleteDialog,
    setShowDeleteDialog,
    showBlockDialog,
    setShowBlockDialog,
    showUnblockDialog,
    setShowUnblockDialog,
    handleDeleteUser,
    handleBlockUser,
    handleUnblockUser,
    searchHistory,
    clearSearchHistory,
    executeSearch,
    searchConfig
  } = useUserManagement();

  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = Object.values(searchParams).filter(Boolean).length;

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
    <>
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
                setShowDeleteDialog={setShowDeleteDialog}
                setShowBlockDialog={setShowBlockDialog}
                setShowUnblockDialog={setShowUnblockDialog}
                onViewDetails={handleViewUserDetails}
                onViewWallets={handleViewUserWallets}
                onViewTransactions={handleViewUserTransactions}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Action Dialogs */}
      <UserActionDialogs
        selectedUser={selectedUser}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        showBlockDialog={showBlockDialog}
        setShowBlockDialog={setShowBlockDialog}
        showUnblockDialog={showUnblockDialog}
        setShowUnblockDialog={setShowUnblockDialog}
        handleDeleteUser={handleDeleteUser}
        handleBlockUser={handleBlockUser}
        handleUnblockUser={handleUnblockUser}
      />

      {/* Search History Dialog */}
      <UserSearchHistoryDialog
        open={showHistoryDialog}
        onClose={() => setShowHistoryDialog(false)}
        searchHistory={searchHistory}
        onClearHistory={clearSearchHistory}
        onExecuteSearch={executeSearch}
        searchConfig={searchConfig}
      />
    </>
  );
};

export default UserManagement;
