
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CompanySearchConfig, SearchField } from "@/lib/api/types/company-config";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface UserSearchBarProps {
  searchConfig: CompanySearchConfig;
  onSearch: (searchParams: Record<string, string>) => void;
}

const UserSearchBar: React.FC<UserSearchBarProps> = ({
  searchConfig,
  onSearch,
}) => {
  const form = useForm<Record<string, string>>({
    defaultValues: searchConfig.fields.reduce((acc, field) => {
      acc[field.id] = field.defaultValue || "";
      return acc;
    }, {} as Record<string, string>),
  });

  const handleSubmit = (data: Record<string, string>) => {
    // Filter out empty values
    const filteredParams = Object.keys(data).reduce((acc, key) => {
      if (data[key]) {
        acc[key] = data[key];
      }
      return acc;
    }, {} as Record<string, string>);
    
    onSearch(filteredParams);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchConfig.fields.map((field) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={field.id}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...formField}
                            type={field.type === "number" ? "number" : "text"}
                            placeholder={field.placeholder}
                            className="pl-8 w-full"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Search Users
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserSearchBar;
