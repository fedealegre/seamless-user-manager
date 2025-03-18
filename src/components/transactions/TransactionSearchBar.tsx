
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TransactionSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const TransactionSearchBar: React.FC<TransactionSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
}) => {
  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by ID or Reference..."
          className="pl-8 w-full md:w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
};

export default TransactionSearchBar;
