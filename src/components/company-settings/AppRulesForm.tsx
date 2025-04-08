
import React, { useState } from "react";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AppRulesTable from "./AppRulesTable";
import { AppRule } from "@/contexts/CompanySettingsContext";

const AppRulesForm: React.FC = () => {
  const { settings, updateAppRules } = useCompanySettings();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRule = (updatedRule: AppRule) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedRules = settings.appRules.map(rule => 
        rule.key === updatedRule.key ? updatedRule : rule
      );
      
      // Update context with new settings
      updateAppRules(updatedRules);
      
      setIsLoading(false);
      toast({
        title: "Rule updated",
        description: `${updatedRule.name} has been updated successfully.`,
      });
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Rules</CardTitle>
        <CardDescription>
          Configure rules that affect wallet user functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <AppRulesTable 
            rules={settings.appRules || []} 
            onUpdateRule={handleUpdateRule}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AppRulesForm;
