
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUserDetails } from "@/hooks/use-user-details";
import { useUserCards } from "@/hooks/use-user-cards";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserIcon } from "lucide-react";
import { UserInfoTab } from "@/components/users/UserInfoTab";
import { UserWalletsTab } from "@/components/users/UserWalletsTab";
import { UserTransactionsTab } from "@/components/users/UserTransactionsTab";
import { UserCardsTab } from "@/components/users/UserCardsTab";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  // Read tab from URL query parameters
  const urlParams = new URLSearchParams(location.search);
  const tabFromUrl = urlParams.get('tab');
  
  // Set initial tab state based on URL or default to 'info'
  const [activeTab, setActiveTab] = useState<string>(
    tabFromUrl === 'wallets' || tabFromUrl === 'transactions' ? 
      (tabFromUrl === 'transactions' ? 'wallets' : tabFromUrl) : 'info'
  );
  
  const { 
    user, 
    wallets, 
    isLoadingUser, 
    isLoadingWallets,
    error
  } = useUserDetails(userId);

  // Fetch user cards to determine if cards tab should be shown
  const { cards, isLoadingCards } = useUserCards(userId);

  useEffect(() => {
    if (error) {
      console.error("Error loading user details:", error);
    }
  }, [error]);
  
  // Update tab when URL parameters change
  useEffect(() => {
    if (tabFromUrl === 'wallets') {
      setActiveTab(tabFromUrl);
    } else if (tabFromUrl === 'cards') {
      // Only allow cards tab if user has cards
      if (cards && cards.length > 0) {
        setActiveTab(tabFromUrl);
      } else {
        // Redirect to info tab if user has no cards
        navigate(`/users/${userId}`, { replace: true });
        setActiveTab('info');
      }
    } else if (tabFromUrl === 'transactions') {
      // Redirect old transactions tab to wallets tab
      navigate(`/users/${userId}?tab=wallets`, { replace: true });
      setActiveTab('wallets');
    }
  }, [tabFromUrl, navigate, userId, cards]);

  const handleBack = () => {
    navigate("/users");
  };
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Only add query param if it's not the default 'info' tab
    if (value !== 'info') {
      navigate(`/users/${userId}?tab=${value}`, { replace: true });
    } else {
      navigate(`/users/${userId}`, { replace: true });
    }
  };

  if (isLoadingUser || isLoadingCards) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-[200px]" />
            <Skeleton className="h-5 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">{t("user-not-found")}</h2>
            <p className="text-muted-foreground">{t("requested-user-not-found")}</p>
          </div>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("back-to-user-management")}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("back")}
          </Button>
        </div>
        <div className="flex flex-col sm:items-end">
          <h1 className="text-2xl font-bold tracking-tight">{t("user-detail")}</h1>
          <p className="text-muted-foreground">{t("view-manage-user-info")}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 my-6">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
          <UserIcon size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.name} {user.surname}</h2>
          <p className="text-muted-foreground">{user.username}</p>
          <p className="text-muted-foreground">{user.cellPhone}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className={`w-full sm:w-auto grid ${cards && cards.length > 0 ? 'grid-cols-3' : 'grid-cols-2'} sm:inline-flex`}>
          <TabsTrigger value="info">{t("personal-info")}</TabsTrigger>
          <TabsTrigger value="wallets">{t("wallets")}</TabsTrigger>
          {cards && cards.length > 0 && (
            <TabsTrigger value="cards">{t("cards")}</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="info">
          <UserInfoTab user={user} />
        </TabsContent>
        
        <TabsContent value="wallets">
          <UserTransactionsTab 
            userId={userId!} 
            wallets={wallets} 
            defaultWalletId={user.defaultWalletId?.toString()}
          />
        </TabsContent>
        
        {cards && cards.length > 0 && (
          <TabsContent value="cards">
            <UserCardsTab userId={userId!} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserDetailPage;
