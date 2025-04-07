
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

interface TransactionSearchBarProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  handleSearch: () => void;
}

const TransactionSearchBar: React.FC<TransactionSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
}) => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full md:w-auto">
      <Input
        placeholder={t("search-transactions")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        className="rounded-r-none"
      />
      <Button 
        type="button" 
        onClick={handleSearch}
        className="rounded-l-none"
      >
        <Search size={16} />
      </Button>
    </div>
  );
};

export default TransactionSearchBar;
