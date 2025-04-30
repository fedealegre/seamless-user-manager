
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import BackofficeLayout from "@/components/BackofficeLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const MyProfilePage = () => {
  const { user } = useAuth();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  if (!user) return null;
  
  const locale = settings.language === "es" ? es : undefined;
  const lastLoginDate = new Date(user.last_login);
  const formattedLastLogin = formatDistanceToNow(lastLoginDate, { 
    addSuffix: true, 
    locale 
  });

  return (
    <BackofficeLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">{t("my-profile")}</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("personal-information")}</CardTitle>
              <CardDescription>
                {t("your-personal-information")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user.name.charAt(0)}{user.surname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium">{user.name} {user.surname}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{t("username")}</p>
                  <p className="text-sm">{user.id}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{t("email")}</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{t("full-name")}</p>
                  <p className="text-sm">{user.name} {user.surname}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("account-information")}</CardTitle>
              <CardDescription>
                {t("your-account-details")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{t("account-status")}</p>
                  <p className={`text-sm font-medium ${
                    user.state === "active" ? "text-green-500" : "text-red-500"
                  }`}>
                    {t(user.state)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{t("last-login")}</p>
                  <p className="text-sm">{formattedLastLogin}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{t("roles")}</p>
                  <div className="flex flex-wrap justify-end gap-1">
                    {user.roles.map((role) => (
                      <span key={role} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                        {t(role)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackofficeLayout>
  );
};

export default MyProfilePage;
