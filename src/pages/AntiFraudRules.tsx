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
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Edit, Plus, Trash, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { AntiFraudRule, AntiFraudRuleType, AmountWithCurrency } from "@/lib/api/types";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const ruleTypeToTransactionTypes: Record<AntiFraudRuleType, string[]> = {
  max_transactions_daily: ['all'],
  max_amount_daily: ['all'],
  max_amount_daily_cash_out: ['cash_out'],
  max_amount_one_factor_cash_out: ['cash_out'],
  max_amount_daily_cash_in: ['cash_in'],
  max_amount_one_factor_cash_in: ['cash_in'],
  max_amount_daily_send_money: ['send_money'],
  max_amount_one_factor_send_money: ['send_money'],
  custom: []
};

const exampleRules: AntiFraudRule[] = [
  {
    id: "1",
    ruleType: 'max_transactions_daily',
    applicationTime: 'daily',
    limit: 5,
    enabled: true,
    description: 'Maximum of 5 transactions per day across all transaction types'
  },
  {
    id: "2",
    ruleType: 'max_amount_daily',
    applicationTime: 'daily',
    amountLimit: {
      value: 500.0,
      currency: 'EUR'
    },
    enabled: true,
    description: 'Maximum of €500 per day across all transaction types'
  },
  {
    id: "3",
    ruleType: 'max_amount_daily_cash_out',
    applicationTime: 'daily',
    transactionTypes: ['cash_out'],
    amountLimit: {
      value: 1000.0,
      currency: 'EUR'
    },
    enabled: true,
    description: 'Maximum of €1000 per day for cash out transactions'
  },
  {
    id: "4",
    ruleType: 'max_amount_one_factor_cash_out',
    securityFactor: 'one_factor',
    transactionTypes: ['cash_out'],
    amountLimit: {
      value: 30.0,
      currency: 'EUR'
    },
    enabled: true,
    description: 'Maximum of €30 for one-factor authentication cash out'
  },
  {
    id: "5",
    ruleType: 'max_amount_daily_cash_in',
    applicationTime: 'daily',
    transactionTypes: ['cash_in'],
    amountLimit: {
      value: 1000.0,
      currency: 'EUR'
    },
    enabled: true,
    description: 'Maximum of €1000 per day for cash in transactions'
  }
];

const ruleFormSchema = z.object({
  ruleType: z.string(),
  applicationTime: z.enum(['daily', 'monthly', 'yearly']).optional(),
  limit: z.number().optional(),
  amountLimit: z.object({
    value: z.number(),
    currency: z.string().min(1)
  }).optional(),
  securityFactor: z.enum(['one_factor', 'two_factor', 'any']).optional(),
  transactionTypes: z.array(z.string()).optional(),
  description: z.string().optional(),
  enabled: z.boolean().default(true)
});

type RuleFormValues = z.infer<typeof ruleFormSchema>;

const AntiFraudRules = () => {
  const { toast } = useToast();
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const [rules, setRules] = useState<AntiFraudRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<AntiFraudRule | null>(null);
  const [useExampleData, setUseExampleData] = useState(false);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
  const [newTransactionType, setNewTransactionType] = useState("");
  
  const form = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: {
      ruleType: 'custom',
      applicationTime: 'daily',
      limit: 0,
      amountLimit: {
        value: 0,
        currency: 'EUR'
      },
      enabled: true,
      transactionTypes: []
    }
  });

  const editForm = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: {
      ruleType: 'custom',
      applicationTime: 'daily',
      limit: 0,
      amountLimit: {
        value: 0,
        currency: 'EUR'
      },
      enabled: true,
      transactionTypes: []
    }
  });
  
  const ruleType = form.watch('ruleType') as AntiFraudRuleType;
  const editRuleType = editForm.watch('ruleType') as AntiFraudRuleType;
  
  useEffect(() => {
    fetchRules();
  }, [useExampleData]);
  
  const fetchRules = async () => {
    try {
      setLoading(true);
      
      if (useExampleData) {
        setRules(exampleRules);
      } else {
        const rulesData = await apiService.listAntiFraudRules();
        setRules(rulesData);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching anti-fraud rules:", err);
      setError("Failed to load anti-fraud rules. Please try again later.");
      
      setRules(exampleRules);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddRule = async (values: RuleFormValues) => {
    try {
      const newRule: AntiFraudRule = {
        ...values,
        ruleType: values.ruleType as AntiFraudRuleType,
        applicationTime: needsApplicationTime(values.ruleType as AntiFraudRuleType) 
          ? values.applicationTime 
          : undefined,
        limit: needsSimpleLimit(values.ruleType as AntiFraudRuleType) 
          ? values.limit 
          : undefined,
        amountLimit: needsAmountLimit(values.ruleType as AntiFraudRuleType) 
          ? (values.amountLimit as AmountWithCurrency)
          : undefined,
        securityFactor: needsSecurityFactor(values.ruleType as AntiFraudRuleType) 
          ? values.securityFactor 
          : undefined,
        transactionTypes: values.ruleType === 'custom' 
          ? values.transactionTypes 
          : ruleTypeToTransactionTypes[values.ruleType as AntiFraudRuleType]
      };
      
      if (useExampleData) {
        const newId = (Math.max(...rules.map(r => Number(r.id || "0"))) + 1).toString();
        const ruleWithId = { ...newRule, id: newId };
        setRules([...rules, ruleWithId]);
      } else {
        await apiService.addAntiFraudRule(newRule);
        await fetchRules();
      }
      
      setIsAddDialogOpen(false);
      form.reset();
      
      toast({
        title: t("success"),
        description: t("rule-added-success"),
      });
    } catch (err) {
      console.error("Error adding rule:", err);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("failed-add-rule"),
      });
    }
  };
  
  const handleEditRule = async (values: RuleFormValues) => {
    if (!currentRule?.id) return;
    
    try {
      const updatedRule: AntiFraudRule = {
        ...values,
        ruleType: values.ruleType as AntiFraudRuleType,
        applicationTime: needsApplicationTime(values.ruleType as AntiFraudRuleType) 
          ? values.applicationTime 
          : undefined,
        limit: needsSimpleLimit(values.ruleType as AntiFraudRuleType) 
          ? values.limit 
          : undefined,
        amountLimit: needsAmountLimit(values.ruleType as AntiFraudRuleType) 
          ? (values.amountLimit as AmountWithCurrency)
          : undefined,
        securityFactor: needsSecurityFactor(values.ruleType as AntiFraudRuleType) 
          ? values.securityFactor 
          : undefined,
        transactionTypes: values.ruleType === 'custom' 
          ? values.transactionTypes 
          : ruleTypeToTransactionTypes[values.ruleType as AntiFraudRuleType]
      };
      
      if (useExampleData) {
        setRules(rules.map(rule => 
          rule.id === currentRule.id ? { ...updatedRule, id: rule.id } : rule
        ));
      } else {
        await apiService.modifyAntiFraudRule(currentRule.id, updatedRule);
        await fetchRules();
      }
      
      setIsEditDialogOpen(false);
      editForm.reset();
      setCurrentRule(null);
      
      toast({
        title: t("success"),
        description: t("rule-updated-success"),
      });
    } catch (err) {
      console.error("Error updating rule:", err);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("failed-update-rule"),
      });
    }
  };
  
  const handleDeleteRule = async (ruleId: string) => {
    if (!window.confirm(t("confirm-delete-rule"))) return;
    
    try {
      if (useExampleData) {
        setRules(rules.filter(rule => rule.id !== ruleId));
      } else {
        await apiService.deleteAntiFraudRule(ruleId);
        await fetchRules();
      }
      
      toast({
        title: t("success"),
        description: t("rule-deleted-success"),
      });
    } catch (err) {
      console.error("Error deleting rule:", err);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("failed-delete-rule"),
      });
    }
  };
  
  const openEditDialog = (rule: AntiFraudRule) => {
    setCurrentRule(rule);
    
    const amountLimit = rule.amountLimit ? {
      value: rule.amountLimit.value,
      currency: rule.amountLimit.currency
    } : {
      value: 0,
      currency: 'EUR'
    };
    
    editForm.reset({
      ruleType: rule.ruleType || 'custom',
      applicationTime: rule.applicationTime,
      limit: rule.limit,
      amountLimit: amountLimit,
      securityFactor: rule.securityFactor || 'any',
      transactionTypes: rule.transactionTypes || [],
      description: rule.description,
      enabled: rule.enabled !== false
    });
    
    setIsEditDialogOpen(true);
  };
  
  const addTransactionType = () => {
    if (!newTransactionType.trim()) return;
    
    if (!selectedTransactionTypes.includes(newTransactionType)) {
      setSelectedTransactionTypes([...selectedTransactionTypes, newTransactionType]);
      form.setValue('transactionTypes', [...selectedTransactionTypes, newTransactionType]);
    }
    
    setNewTransactionType("");
  };
  
  const removeTransactionType = (type: string) => {
    const updatedTypes = selectedTransactionTypes.filter(t => t !== type);
    setSelectedTransactionTypes(updatedTypes);
    form.setValue('transactionTypes', updatedTypes);
  };
  
  const needsApplicationTime = (type: AntiFraudRuleType) => {
    return [
      'max_transactions_daily', 
      'max_amount_daily', 
      'max_amount_daily_cash_out', 
      'max_amount_daily_cash_in', 
      'max_amount_daily_send_money',
      'custom'
    ].includes(type);
  };
  
  const needsSimpleLimit = (type: AntiFraudRuleType) => {
    return type === 'max_transactions_daily' || type === 'custom';
  };
  
  const needsAmountLimit = (type: AntiFraudRuleType) => {
    return [
      'max_amount_daily', 
      'max_amount_daily_cash_out', 
      'max_amount_one_factor_cash_out', 
      'max_amount_daily_cash_in', 
      'max_amount_one_factor_cash_in', 
      'max_amount_daily_send_money', 
      'max_amount_one_factor_send_money',
      'custom'
    ].includes(type);
  };
  
  const needsSecurityFactor = (type: AntiFraudRuleType) => {
    return [
      'max_amount_one_factor_cash_out', 
      'max_amount_one_factor_cash_in', 
      'max_amount_one_factor_send_money',
      'custom'
    ].includes(type);
  };
  
  const toggleExampleData = () => {
    setUseExampleData(!useExampleData);
  };

  const formatRuleDescription = (rule: AntiFraudRule): string => {
    if (rule.description) return rule.description;
    
    switch (rule.ruleType) {
      case 'max_transactions_daily':
        return `Maximum of ${rule.limit} transactions per day`;
      case 'max_amount_daily':
        return rule.amountLimit 
          ? `Maximum of ${rule.amountLimit.value} ${rule.amountLimit.currency} per day across all transaction types` 
          : '';
      case 'max_amount_daily_cash_out':
        return rule.amountLimit 
          ? `Maximum of ${rule.amountLimit.value} ${rule.amountLimit.currency} per day for cash out transactions` 
          : '';
      case 'max_amount_one_factor_cash_out':
        return rule.amountLimit 
          ? `Maximum of ${rule.amountLimit.value} ${rule.amountLimit.currency} for one-factor authentication cash out` 
          : '';
      case 'max_amount_daily_cash_in':
        return rule.amountLimit 
          ? `Maximum of ${rule.amountLimit.value} ${rule.amountLimit.currency} per day for cash in transactions` 
          : '';
      case 'max_amount_one_factor_cash_in':
        return rule.amountLimit 
          ? `Maximum of ${rule.amountLimit.value} ${rule.amountLimit.currency} for one-factor authentication cash in` 
          : '';
      case 'max_amount_daily_send_money':
        return rule.amountLimit 
          ? `Maximum of ${rule.amountLimit.value} ${rule.amountLimit.currency} per day for send money transactions` 
          : '';
      case 'max_amount_one_factor_send_money':
        return rule.amountLimit 
          ? `Maximum of ${rule.amountLimit.value} ${rule.amountLimit.currency} for one-factor authentication send money` 
          : '';
      default:
        return rule.limit !== undefined
          ? `Limit: ${rule.limit}`
          : rule.amountLimit 
            ? `Amount limit: ${rule.amountLimit.value} ${rule.amountLimit.currency}` 
            : '';
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t("anti-fraud-rules")}</h1>
          <p className="text-muted-foreground">{t("manage-transaction-limits-security")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleExampleData}>
            {useExampleData ? "Use API Data" : "Use Example Data"}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                {t("add-new-rule")}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[95vw] sm:max-w-[80vw] md:max-w-[700px] h-auto max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("add-new-anti-fraud-rule")}</DialogTitle>
                <DialogDescription>
                  {t("create-new-rule")}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddRule)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ruleType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("rule-type")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("select-rule-type")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="max_transactions_daily">{t("max-transactions-daily")}</SelectItem>
                              <SelectItem value="max_amount_daily">{t("max-amount-daily")}</SelectItem>
                              <SelectItem value="max_amount_daily_cash_out">{t("max-amount-daily-cash-out")}</SelectItem>
                              <SelectItem value="max_amount_one_factor_cash_out">{t("max-amount-one-factor-cash-out")}</SelectItem>
                              <SelectItem value="max_amount_daily_cash_in">{t("max-amount-daily-cash-in")}</SelectItem>
                              <SelectItem value="max_amount_one_factor_cash_in">{t("max-amount-one-factor-cash-in")}</SelectItem>
                              <SelectItem value="max_amount_daily_send_money">{t("max-amount-daily-send-money")}</SelectItem>
                              <SelectItem value="max_amount_one_factor_send_money">{t("max-amount-one-factor-send-money")}</SelectItem>
                              <SelectItem value="custom">{t("custom")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {needsApplicationTime(ruleType) && (
                      <FormField
                        control={form.control}
                        name="applicationTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("application-period")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("select-application-period")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">{t("daily")}</SelectItem>
                                <SelectItem value="monthly">{t("monthly")}</SelectItem>
                                <SelectItem value="yearly">{t("yearly")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {needsSecurityFactor(ruleType) && (
                      <FormField
                        control={form.control}
                        name="securityFactor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("security-factor")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || "any"}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("select-security-factor")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="one_factor">{t("one-factor")}</SelectItem>
                                <SelectItem value="two_factor">{t("two-factor")}</SelectItem>
                                <SelectItem value="any">{t("any-factor")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {needsSimpleLimit(ruleType) && (
                      <FormField
                        control={form.control}
                        name="limit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("limit-amount")}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={e => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  {needsAmountLimit(ruleType) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="amountLimit.value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("value")}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={e => {
                                  field.onChange(Number(e.target.value));
                                  form.setValue('amountLimit.value', Number(e.target.value));
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="amountLimit.currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("currency")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {ruleType === 'custom' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        {t("transaction-types")}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder={t("enter-transaction-type")}
                          value={newTransactionType}
                          onChange={(e) => setNewTransactionType(e.target.value)}
                        />
                        <Button type="button" onClick={addTransactionType}>{t("add")}</Button>
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
                  )}
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("description")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t("rule-description")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>{t("status")}</FormLabel>
                          <FormDescription>
                            {field.value ? t("enabled") : t("disabled")}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" type="button" onClick={() => {
                      form.reset();
                      setIsAddDialogOpen(false);
                    }}>
                      {t("cancel")}
                    </Button>
                    <Button type="submit">{t("save-rule")}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("error")}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {useExampleData && (
        <Alert variant="default" className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-300">Example Data Mode</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            You are viewing example data based on the provided JSON. Changes made here won't affect the actual API.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>{t("anti-fraud-rules")}</CardTitle>
          <CardDescription>
            {t("rules-limit-transaction-amounts")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">{t("no-anti-fraud-rules-configured")}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus size={16} className="mr-2" />
                {t("add-your-first-rule")}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("rule-id")}</TableHead>
                  <TableHead>{t("rule-type")}</TableHead>
                  <TableHead>{t("description")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.id}</TableCell>
                    <TableCell>
                      {rule.ruleType ? t(rule.ruleType.replace(/_/g, '-')) : t('custom')}
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {formatRuleDescription(rule)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rule.enabled !== false 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                      }`}>
                        {rule.enabled !== false ? t('enabled') : t('disabled')}
                      </span>
                    </TableCell>
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
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[80vw] md:max-w-[700px] h-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("edit-anti-fraud-rule")}</DialogTitle>
            <DialogDescription>
              {t("modify-existing-rule")}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditRule)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="ruleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("rule-type")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("select-rule-type")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="max_transactions_daily">{t("max-transactions-daily")}</SelectItem>
                          <SelectItem value="max_amount_daily">{t("max-amount-daily")}</SelectItem>
                          <SelectItem value="max_amount_daily_cash_out">{t("max-amount-daily-cash-out")}</SelectItem>
                          <SelectItem value="max_amount_one_factor_cash_out">{t("max-amount-one-factor-cash-out")}</SelectItem>
                          <SelectItem value="max_amount_daily_cash_in">{t("max-amount-daily-cash-in")}</SelectItem>
                          <SelectItem value="max_amount_one_factor_cash_in">{t("max-amount-one-factor-cash-in")}</SelectItem>
                          <SelectItem value="max_amount_daily_send_money">{t("max-amount-daily-send-money")}</SelectItem>
                          <SelectItem value="max_amount_one_factor_send_money">{t("max-amount-one-factor-send-money")}</SelectItem>
                          <SelectItem value="custom">{t("custom")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {needsApplicationTime(editRuleType) && (
                  <FormField
                    control={editForm.control}
                    name="applicationTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("application-period")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("select-application-period")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">{t("daily")}</SelectItem>
                            <SelectItem value="monthly">{t("monthly")}</SelectItem>
                            <SelectItem value="yearly">{t("yearly")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {needsSecurityFactor(editRuleType) && (
                  <FormField
                    control={editForm.control}
                    name="securityFactor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("security-factor")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || "any"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("select-security-factor")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="one_factor">{t("one-factor")}</SelectItem>
                            <SelectItem value="two_factor">{t("two-factor")}</SelectItem>
                            <SelectItem value="any">{t("any-factor")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {needsSimpleLimit(editRuleType) && (
                  <FormField
                    control={editForm.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("limit-amount")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                            value={field.value || 0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              {needsAmountLimit(editRuleType) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="amountLimit.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("value")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={e => {
                              field.onChange(Number(e.target.value));
                              editForm.setValue('amountLimit.value', Number(e.target.value));
                            }}
                            value={field.value || 0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="amountLimit.currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("currency")}</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("rule-description")}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>{t("status")}</FormLabel>
                      <FormDescription>
                        {field.value ? t("enabled") : t("disabled")}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
                <Button variant="outline" type="button" onClick={() => {
                  editForm.reset();
                  setIsEditDialogOpen(false);
                  setCurrentRule(null);
                }}>
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("update-rule")}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AntiFraudRules;
