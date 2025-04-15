
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import UserSearchBar from "./UserSearchBar";
import { CompanySearchConfig } from "@/lib/api/types/company-config";

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
