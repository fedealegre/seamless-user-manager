
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserSearchBarProps {
  searchParams: {
    query: string;
    searchBy: "name" | "surname" | "identifier";
  };
  setSearchParams: React.Dispatch<React.SetStateAction<{
    query: string;
    searchBy: "name" | "surname" | "identifier";
  }>>;
  handleSearch: (e: React.FormEvent) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  searchParams,
  setSearchParams,
  handleSearch,
}) => {
  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8 w-full md:w-[300px]"
          value={searchParams.query}
          onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
        />
      </div>
      
      <Tabs
        defaultValue="name"
        value={searchParams.searchBy}
        onValueChange={(value) => setSearchParams({ ...searchParams, searchBy: value as any })}
        className="w-[200px]"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="name">Name</TabsTrigger>
          <TabsTrigger value="surname">Surname</TabsTrigger>
          <TabsTrigger value="identifier">ID/Email</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Button type="submit">Search</Button>
    </form>
  );
};

export default UserSearchBar;
