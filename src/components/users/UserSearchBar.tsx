
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface UserSearchBarProps {
  searchParams: {
    query: string;
    searchBy: "name" | "surname" | "identifier" | "phone" | "walletId";
  };
  setSearchParams: React.Dispatch<React.SetStateAction<{
    query: string;
    searchBy: "name" | "surname" | "identifier" | "phone" | "walletId";
  }>>;
  handleSearch: (e: React.FormEvent) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  searchParams,
  setSearchParams,
  handleSearch,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full"
                value={searchParams.query}
                onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
              />
            </div>
            
            <Button type="submit" className="md:w-auto w-full">Search</Button>
          </div>
          
          <Tabs
            defaultValue="name"
            value={searchParams.searchBy}
            onValueChange={(value) => setSearchParams({ ...searchParams, searchBy: value as any })}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="name">Name</TabsTrigger>
              <TabsTrigger value="surname">Surname</TabsTrigger>
              <TabsTrigger value="identifier">ID/Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="walletId">Wallet ID</TabsTrigger>
            </TabsList>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserSearchBar;
