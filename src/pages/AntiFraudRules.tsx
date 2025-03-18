import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertCircle, Edit, Plus, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { AntiFraudRule } from "@/lib/api/types";

const AntiFraudRules = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<AntiFraudRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<AntiFraudRule | null>(null);
  
  const [formState, setFormState] = useState<AntiFraudRule>({
    applicationTime: 'daily',
    transactionTypes: [],
    limit: 0
  });
  
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
  const [newTransactionType, setNewTransactionType] = useState("");
  
  useEffect(() => {
    fetchRules();
  }, []);
  
  const fetchRules = async () => {
    try {
      setLoading(true);
      const rulesData = await apiService.listAntiFraudRules();
      setRules(rulesData);
      setError(null);
    } catch (err) {
      console.error("Error fetching anti-fraud rules:", err);
      setError("Failed to load anti-fraud rules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddRule = async () => {
    try {
      const newRule: AntiFraudRule = {
        applicationTime: formState.applicationTime,
        transactionTypes: selectedTransactionTypes,
        limit: Number(formState.limit)
      };
      
      await apiService.addAntiFraudRule(newRule);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Anti-fraud rule has been added successfully.",
      });
      fetchRules();
    } catch (err) {
      console.error("Error adding rule:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add anti-fraud rule. Please try again.",
      });
    }
  };
  
  const handleEditRule = async () => {
    if (!currentRule?.id) return;
    
    try {
      const updatedRule: AntiFraudRule = {
        applicationTime: formState.applicationTime,
        transactionTypes: selectedTransactionTypes,
        limit: Number(formState.limit)
      };
      
      await apiService.modifyAntiFraudRule(currentRule.id, updatedRule);
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Anti-fraud rule has been updated successfully.",
      });
      fetchRules();
    } catch (err) {
      console.error("Error updating rule:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update anti-fraud rule. Please try again.",
      });
    }
  };
  
  const handleDeleteRule = async (ruleId: string) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) return;
    
    try {
      await apiService.deleteAntiFraudRule(ruleId);
      toast({
        title: "Success",
        description: "Anti-fraud rule has been deleted successfully.",
      });
      fetchRules();
    } catch (err) {
      console.error("Error deleting rule:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete anti-fraud rule. Please try again.",
      });
    }
  };
  
  const openEditDialog = (rule: AntiFraudRule) => {
    setCurrentRule(rule);
    setFormState({
      applicationTime: rule.applicationTime,
      transactionTypes: rule.transactionTypes,
      limit: rule.limit
    });
    setSelectedTransactionTypes(rule.transactionTypes);
    setIsEditDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormState({
      applicationTime: 'daily',
      transactionTypes: [],
      limit: 0
    });
    setSelectedTransactionTypes([]);
    setNewTransactionType("");
    setCurrentRule(null);
  };
  
  const addTransactionType = () => {
    if (!newTransactionType.trim()) return;
    
    if (!selectedTransactionTypes.includes(newTransactionType)) {
      setSelectedTransactionTypes([...selectedTransactionTypes, newTransactionType]);
    }
    
    setNewTransactionType("");
  };
  
  const removeTransactionType = (type: string) => {
    setSelectedTransactionTypes(selectedTransactionTypes.filter(t => t !== type));
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Anti-Fraud Rules</h1>
          <p className="text-muted-foreground">Manage transaction limits and security rules</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add New Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Anti-Fraud Rule</DialogTitle>
              <DialogDescription>
                Create a new rule to limit transaction amounts over a specific time period.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="applicationTime" className="text-right">
                  Time Period
                </Label>
                <Select 
                  value={formState.applicationTime}
                  onValueChange={(value: 'daily' | 'monthly' | 'yearly') => 
                    setFormState({...formState, applicationTime: value})
                  }
                >
                  <SelectTrigger id="applicationTime" className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="limit" className="text-right">
                  Limit Amount
                </Label>
                <Input
                  id="limit"
                  type="number"
                  className="col-span-3"
                  value={formState.limit}
                  onChange={(e) => setFormState({...formState, limit: Number(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-2">
                  Transaction Types
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter transaction type"
                      value={newTransactionType}
                      onChange={(e) => setNewTransactionType(e.target.value)}
                    />
                    <Button type="button" onClick={addTransactionType}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTransactionTypes.map((type, index) => (
                      <div key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                        <span>{type}</span>
                        <button 
                          type="button" 
                          className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          onClick={() => removeTransactionType(type)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddRule}>Save Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Anti-Fraud Rules</CardTitle>
          <CardDescription>
            Rules that limit transaction amounts over specific time periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No anti-fraud rules configured yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus size={16} className="mr-2" />
                Add Your First Rule
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule ID</TableHead>
                  <TableHead>Application Period</TableHead>
                  <TableHead>Transaction Types</TableHead>
                  <TableHead>Limit Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.id}</TableCell>
                    <TableCell className="capitalize">{rule.applicationTime}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.transactionTypes.map((type, idx) => (
                          <span key={idx} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs">
                            {type}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{rule.limit.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditDialog(rule)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => rule.id && handleDeleteRule(rule.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Anti-Fraud Rule</DialogTitle>
            <DialogDescription>
              Modify the existing rule parameters.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-applicationTime" className="text-right">
                Time Period
              </Label>
              <Select 
                value={formState.applicationTime}
                onValueChange={(value: 'daily' | 'monthly' | 'yearly') => 
                  setFormState({...formState, applicationTime: value})
                }
              >
                <SelectTrigger id="edit-applicationTime" className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-limit" className="text-right">
                Limit Amount
              </Label>
              <Input
                id="edit-limit"
                type="number"
                className="col-span-3"
                value={formState.limit}
                onChange={(e) => setFormState({...formState, limit: Number(e.target.value)})}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                Transaction Types
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter transaction type"
                    value={newTransactionType}
                    onChange={(e) => setNewTransactionType(e.target.value)}
                  />
                  <Button type="button" onClick={addTransactionType}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTransactionTypes.map((type, index) => (
                    <div key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                      <span>{type}</span>
                      <button 
                        type="button" 
                        className="text-secondary-foreground/70 hover:text-secondary-foreground"
                        onClick={() => removeTransactionType(type)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditRule}>Update Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AntiFraudRules;
