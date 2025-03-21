
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Save, Upload, Building, Wallet, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CompanyInfoForm } from "@/components/company-settings/CompanyInfoForm";
import { NotificationSettingsForm } from "@/components/company-settings/NotificationSettingsForm";
import { FinancialSettingsForm } from "@/components/company-settings/FinancialSettingsForm";

const CompanySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { settings, updateSettings } = useCompanySettings();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has admin role
  const isAdmin = user?.roles.includes("admin");

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="text-4xl font-bold text-destructive mb-2">Access Denied</div>
        <p className="text-lg text-muted-foreground mb-6">
          You don't have permission to access Company Settings.
        </p>
        <p className="text-sm text-muted-foreground">
          Required role: admin
        </p>
      </div>
    );
  }

  const handleCompanyInfoSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update context with new settings
      updateSettings({
        name: data.name,
        backofficeTitle: data.backofficeTitle,
        companyLogo: data.companyLogo,
        backofficeIcon: data.backofficeIcon
      });
      
      setIsLoading(false);
      toast({
        title: "Company information updated",
        description: "Your changes have been saved successfully.",
      });
    }, 1000);
  };

  const handleNotificationSettingsSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // We store the notification settings but don't update the context
      // as those settings don't affect the UI
      setIsLoading(false);
      toast({
        title: "Notification settings updated",
        description: "Your changes have been saved successfully.",
      });
    }, 1000);
  };

  const handleFinancialSettingsSubmit = (data: any) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // We store the financial settings but don't update the context
      // as those settings don't affect the UI
      setIsLoading(false);
      toast({
        title: "Financial settings updated",
        description: "Your changes have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
          <p className="text-muted-foreground">
            Manage company information and configuration
          </p>
        </div>
      </div>

      <Tabs defaultValue="company-info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company-info" className="flex items-center gap-2">
            <Building size={16} />
            <span>Company Information</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <Wallet size={16} />
            <span>Financial</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="company-info">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company information and branding settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyInfoForm 
                defaultValues={settings} 
                onSubmit={handleCompanyInfoSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettingsForm 
                defaultValues={{
                  notifyUsersWhenBlocked: true,
                  notifyUsersWhenUnblocked: true
                }}
                onSubmit={handleNotificationSettingsSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
              <CardDescription>
                Configure tax rates and commission percentages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialSettingsForm 
                defaultValues={{
                  iva: 16,
                  commissions: {
                    transfer: 1.5,
                    payment: 2.0,
                    withdrawal: 2.5
                  }
                }}
                onSubmit={handleFinancialSettingsSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanySettings;
