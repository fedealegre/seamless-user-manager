
import React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterButtonProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  showFilters,
  setShowFilters,
  activeFiltersCount,
}) => {
  return (
    <Button 
      variant="outline" 
      onClick={() => setShowFilters(!showFilters)}
      className="flex items-center gap-2"
    >
      <Filter size={16} />
      Filters
      {activeFiltersCount > 0 && (
        <Badge className="ml-1 bg-primary/20 text-primary text-xs">
          {activeFiltersCount}
        </Badge>
      )}
    </Button>
  );
};

export default FilterButton;
