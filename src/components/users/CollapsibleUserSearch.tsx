
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  return (
    <div className="mb-6">
      <UserSearchBar
        searchConfig={searchConfig}
        onSearch={onSearch}
      />
    </div>
  );
};

export default CollapsibleUserSearch;
