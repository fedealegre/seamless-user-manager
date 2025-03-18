
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/api-service";
import { AntiFraudRule } from "@/lib/api-types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertTriangle, 
  Edit, 
  MoreVertical, 
  Plus, 
  Trash2, 
  CalendarDays, 
  CreditCard, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight 
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const transactionTypes = [
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "transfer", label: "Transfer" },
  { value: "payment", label: "Payment" },
  { value: "all", label: "All Transaction Types" },
];

const formSchema = z.object({
  applicationTime: z.enum(["daily", "monthly", "yearly"], {
    required_error: "Please select a time period.",
  }),
  transactionTypes: z.array(z.string()).min(1, {
    message: "Please select at least one transaction type.",
  }),
  limit: z.coerce.number().positive({
    message: "Limit must be a positive number.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AntiFraudRules = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AntiFraudRule | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["antiFraudRules"],
    queryFn: () => apiService.listAntiFraudRules(),
  });

  const addForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationTime: "daily",
      transactionTypes: [],
      limit: 1000,
    },
  });

  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationTime: "daily",
      transactionTypes: [],
      limit: 1000,
    },
  });

  const addMutation = useMutation({
    mutationFn: (newRule: AntiFraudRule) => {
      return apiService.addAntiFraudRule(newRule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["antiFraudRules"] });
      toast({
        title: "Rule Added",
        description: "Anti-fraud rule has been successfully added.",
      });
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: (error) => {
      console.error("Failed to add rule:", error);
      toast({
        title: "Error",
        description: "Failed to add anti-fraud rule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, rule }: { id: string; rule: AntiFraudRule }) => {
      return apiService.modifyAntiFraudRule(id, rule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["antiFraudRules"] });
      toast({
        title: "Rule Updated",
        description: "Anti-fraud rule has been successfully updated.",
      });
      setIsEditDialogOpen(false);
      editForm.reset();
    },
    onError: (error) => {
      console.error("Failed to update rule:", error);
      toast({
        title: "Error",
        description: "Failed to update anti-fraud rule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return apiService.deleteAntiFraudRule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["antiFraudRules"] });
      toast({
        title: "Rule Deleted",
        description: "Anti-fraud rule has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedRule(null);
    },
    onError: (error) => {
      console.error("Failed to delete rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete anti-fraud rule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onAddSubmit = (data: FormValues) => {
    addMutation.mutate(data);
  };

  const onEditSubmit = (data: FormValues) => {
    if (!selectedRule || !selectedRule.id) return;
    editMutation.mutate({ id: selectedRule.id, rule: data });
  };

  const handleDeleteRule = () => {
    if (!selectedRule || !selectedRule.id) return;
    deleteMutation.mutate(selectedRule.id);
  };

  const handleEditClick = (rule: AntiFraudRule) => {
    setSelectedRule(rule);
    editForm.reset({
      applicationTime: rule.applicationTime,
      transactionTypes: rule.transactionTypes,
      limit: rule.limit,
    });
    setIsEditDialogOpen(true);
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownToLine size={14} className="mr-1" />;
      case "withdrawal":
        return <ArrowUpFromLine size={14} className="mr-1" />;
      case "transfer":
        return <ArrowLeftRight size={14} className="mr-1" />;
      case "payment":
        return <CreditCard size={14} className="mr-1" />;
      case "all":
        return <AlertTriangle size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Anti-Fraud Rules</h1>
          <p className="text-muted-foreground">Manage transaction limits and security rules</p>
        </div>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus size={16} className="mr-2" /> Add Rule
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction Limit Rules</CardTitle>
          <CardDescription>
            Rules to automatically flag or block transactions that exceed specified limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time Period</TableHead>
                <TableHead>Transaction Types</TableHead>
                <TableHead>Limit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length > 0 ? (
                rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarDays size={16} className="mr-2 text-muted-foreground" />
                        <span className="capitalize">{rule.applicationTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.transactionTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="flex items-center">
                            {getTransactionTypeIcon(type)}
                            <span className="capitalize">{type}</span>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      ${rule.limit.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditClick(rule)}>
                            <Edit size={16} className="mr-2" /> Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedRule(rule);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 size={16} className="mr-2" /> Delete Rule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {isLoading ? (
                      "Loading rules..."
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <AlertTriangle size={24} className="text-muted-foreground mb-2" />
                        <p>No anti-fraud rules have been configured.</p>
                        <p className="text-sm text-muted-foreground mt-1">Click the "Add Rule" button to create your first rule.</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t p-4 text-sm text-muted-foreground bg-muted/30">
          <AlertTriangle size={16} className="mr-2 text-amber-500" />
          Rules are applied in order of strictness. Daily limits take precedence over monthly and yearly limits.
        </CardFooter>
      </Card>
      
      {/* Add Rule Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Anti-Fraud Rule</DialogTitle>
            <DialogDescription>
              Create a new transaction limit rule to protect against fraudulent activities.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4 py-4">
              <FormField
                control={addForm.control}
                name="applicationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Period</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily Limit</SelectItem>
                        <SelectItem value="monthly">Monthly Limit</SelectItem>
                        <SelectItem value="yearly">Yearly Limit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The time period this rule will apply to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="transactionTypes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Transaction Types</FormLabel>
                      <FormDescription>
                        Select the types of transactions this rule will apply to.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {transactionTypes.map((type) => (
                        <FormField
                          key={type.value}
                          control={addForm.control}
                          name="transactionTypes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={type.value}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(type.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, type.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== type.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {type.label}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Limit ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Transactions exceeding this amount will be flagged or blocked.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? "Creating..." : "Create Rule"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Rule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Anti-Fraud Rule</DialogTitle>
            <DialogDescription>
              Modify the selected transaction limit rule.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <FormField
                control={editForm.control}
                name="applicationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Period</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily Limit</SelectItem>
                        <SelectItem value="monthly">Monthly Limit</SelectItem>
                        <SelectItem value="yearly">Yearly Limit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The time period this rule will apply to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="transactionTypes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Transaction Types</FormLabel>
                      <FormDescription>
                        Select the types of transactions this rule will apply to.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {transactionTypes.map((type) => (
                        <FormField
                          key={type.value}
                          control={editForm.control}
                          name="transactionTypes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={type.value}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(type.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, type.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== type.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {type.label}
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Limit ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Transactions exceeding this amount will be flagged or blocked.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editMutation.isPending}>
                  {editMutation.isPending ? "Updating..." : "Update Rule"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Rule Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Anti-Fraud Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this rule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRule && (
            <div className="py-4">
              <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-destructive" />
                </div>
                <div>
                  <div className="font-medium">
                    {selectedRule.applicationTime.charAt(0).toUpperCase() + selectedRule.applicationTime.slice(1)} Limit: ${selectedRule.limit.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Applies to: {selectedRule.transactionTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRule} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AntiFraudRules;
