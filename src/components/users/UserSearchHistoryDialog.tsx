
import React from "react";
import { Clock, ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { CompanySearchConfig } from "@/lib/api/types/company-config";

interface UserSearchHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  searchHistory: Array<{
    params: Record<string, string>;
    timestamp: number;
  }>;
  onClearHistory: () => void;
  onExecuteSearch: (params: Record<string, string>) => void;
  searchConfig: CompanySearchConfig;
}

const UserSearchHistoryDialog: React.FC<UserSearchHistoryDialogProps> = ({
  open,
  onClose,
  searchHistory,
  onClearHistory,
  onExecuteSearch,
  searchConfig,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{t("recent-searches")}</DialogTitle>
            {searchHistory.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClearHistory}
                className="text-destructive hover:text-destructive"
              >
                {t("clear-all")}
              </Button>
            )}
          </div>
        </DialogHeader>
        
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
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (item.params) {
                          onExecuteSearch(item.params);
                          onClose();
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
      </DialogContent>
    </Dialog>
  );
};

export default UserSearchHistoryDialog;
