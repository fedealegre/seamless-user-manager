import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserManagement } from "@/hooks/use-user-management";
import UsersTable from "@/components/users/UsersTable";
import UsersLoadingSkeleton from "@/components/users/UsersLoadingSkeleton";
import UserActionDialogs from "@/components/users/UserActionDialogs";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import CollapsibleUserSearch from "@/components/users/CollapsibleUserSearch";

const UserManagement = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
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
  const [activeTab, setActiveTab] = useState("search");

  const handleViewUserDetails = (userId: number) => {
    navigate(`/users/${userId}`);
  };
  
  const handleViewUserWallets = (userId: number) => {
    navigate(`/users/${userId}?tab=wallets`);
  };
  
  const handleViewUserTransactions = (userId: number) => {
    navigate(`/users/${userId}?tab=transactions`);
  };

  // Calculate active filters count
  const activeFiltersCount = Object.values(searchParams).filter(Boolean).length;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("user-management")}</h1>
            <p className="text-muted-foreground">{t("manage-monitor-customer-accounts")}</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">{t("search-users")}</TabsTrigger>
            <TabsTrigger value="history">{t("search-history")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-6">
            <CollapsibleUserSearch
              searchConfig={searchConfig}
              onSearch={handleSearch}
              activeFiltersCount={activeFiltersCount}
            />
            
            <Card className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                  <CardTitle>{t("recent-searches")}</CardTitle>
                  {searchHistory.length > 0 && (
                    <button 
                      onClick={clearSearchHistory}
                      className="text-sm text-destructive hover:underline"
                    >
                      {t("clear-all")}
                    </button>
                  )}
                </div>
                <CardDescription>
                  {t("your-recent-user-searches")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t("no-recent-searches")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchHistory.map((item, index) => (
                      <Card key={index} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div className="flex-1">
                              {item.params && Object.entries(item.params).map(([key, value]) => (
                                <p key={key} className="font-medium text-sm">
                                  {searchConfig.fields.find(f => f.id === key)?.label || key}:
                                  <span className="ml-2 text-muted-foreground">{value}</span>
                                </p>
                              ))}
                              <p className="text-xs text-muted-foreground">
                                {new Date(item.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (item.params) {
                                  executeSearch(item.params);
                                  setActiveTab("search");
                                }
                              }}
                            >
                              {t("search-again")}
                              <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
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
    </>
  );
};

export default UserManagement;
