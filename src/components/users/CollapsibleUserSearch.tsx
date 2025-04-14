
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import UserSearchBar from "./UserSearchBar";
import { CompanySearchConfig } from "@/lib/api/types/company-config";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface CollapsibleUserSearchProps {
  searchConfig: CompanySearchConfig;
  onSearch: (searchParams: Record<string, string>) => void;
  activeFiltersCount: number;
}

const CollapsibleUserSearch: React.FC<CollapsibleUserSearchProps> = ({
  searchConfig,
  onSearch,
  activeFiltersCount,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-2 mb-4">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            {t("filters")}
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 bg-primary/20 text-primary text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="mb-6">
          <UserSearchBar
            searchConfig={searchConfig}
            onSearch={onSearch}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleUserSearch;
