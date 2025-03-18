
import { LucideIcon, FileCog, Plus, Pencil, Trash, Lock, LockOpen, RefreshCw } from "lucide-react";
import { AuditLog } from "@/lib/api/types";

export const operationTypes = [
  { id: "USER_CREATE", label: "User Create", icon: "Plus" },
  { id: "USER_UPDATE", label: "User Update", icon: "Pencil" },
  { id: "USER_DELETE", label: "User Delete", icon: "Trash" },
  { id: "USER_BLOCK", label: "User Block", icon: "Lock" },
  { id: "USER_UNBLOCK", label: "User Unblock", icon: "LockOpen" },
  { id: "TRANSACTION_CANCEL", label: "Transaction Cancel", icon: "RefreshCw" },
  { id: "CUSTOMER_COMPENSATE", label: "Customer Compensate", icon: "FileCog" },
  { id: "RULE_CREATE", label: "Rule Create", icon: "Plus" },
  { id: "RULE_UPDATE", label: "Rule Update", icon: "Pencil" },
  { id: "RULE_DELETE", label: "Rule Delete", icon: "Trash" },
];

export const getBadgeColor = (type: string) => {
  if (type.includes("CREATE") || type.includes("COMPENSATE")) {
    return "bg-green-100 text-green-800 hover:bg-green-100";
  }
  if (type.includes("UPDATE")) {
    return "bg-blue-100 text-blue-800 hover:bg-blue-100";
  }
  if (type.includes("DELETE") || type.includes("CANCEL")) {
    return "bg-red-100 text-red-800 hover:bg-red-100";
  }
  if (type.includes("BLOCK")) {
    return "bg-amber-100 text-amber-800 hover:bg-amber-100";
  }
  if (type.includes("UNBLOCK")) {
    return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
  }
  return "";
};

// Example audit logs data
export const exampleAuditLogs: AuditLog[] = [
  {
    id: 1,
    dateTime: "2023-09-15T14:32:45Z",
    user: "admin.user",
    operationType: "USER_CREATE",
    entity: "User",
    previousValue: "",
    newValue: JSON.stringify({
      id: 1001,
      username: "john.doe",
      email: "john.doe@example.com",
      role: "customer"
    }, null, 2)
  },
  {
    id: 2,
    dateTime: "2023-09-16T09:21:33Z",
    user: "admin.user",
    operationType: "USER_UPDATE",
    entity: "User",
    previousValue: JSON.stringify({
      id: 1001,
      username: "john.doe",
      email: "john.doe@example.com",
      role: "customer"
    }, null, 2),
    newValue: JSON.stringify({
      id: 1001,
      username: "john.doe",
      email: "john.doe@example.com",
      role: "premium_customer"
    }, null, 2)
  },
  {
    id: 3,
    dateTime: "2023-09-18T11:05:17Z",
    user: "security.admin",
    operationType: "USER_BLOCK",
    entity: "User",
    previousValue: JSON.stringify({
      id: 1002,
      username: "suspicious.user",
      status: "active"
    }, null, 2),
    newValue: JSON.stringify({
      id: 1002,
      username: "suspicious.user",
      status: "blocked",
      reason: "Suspicious activity detected"
    }, null, 2)
  },
  {
    id: 4,
    dateTime: "2023-09-20T16:42:09Z",
    user: "support.agent",
    operationType: "TRANSACTION_CANCEL",
    entity: "Transaction",
    previousValue: JSON.stringify({
      id: "TRX-12345",
      amount: 1250.00,
      status: "pending",
      currency: "USD"
    }, null, 2),
    newValue: JSON.stringify({
      id: "TRX-12345",
      amount: 1250.00,
      status: "cancelled",
      currency: "USD",
      cancelReason: "Customer request"
    }, null, 2)
  },
  {
    id: 5,
    dateTime: "2023-09-22T10:18:55Z",
    user: "finance.manager",
    operationType: "CUSTOMER_COMPENSATE",
    entity: "Customer",
    previousValue: JSON.stringify({
      id: 1003,
      balance: 500.00,
      currency: "EUR"
    }, null, 2),
    newValue: JSON.stringify({
      id: 1003,
      balance: 550.00,
      currency: "EUR",
      compensationReason: "Service outage compensation"
    }, null, 2)
  },
  {
    id: 6,
    dateTime: "2023-09-25T13:27:30Z",
    user: "security.admin",
    operationType: "RULE_CREATE",
    entity: "FraudRule",
    previousValue: "",
    newValue: JSON.stringify({
      id: "RULE-001",
      name: "High Value Transaction Alert",
      threshold: 10000,
      action: "FLAG_FOR_REVIEW"
    }, null, 2)
  },
  {
    id: 7,
    dateTime: "2023-09-27T15:39:22Z",
    user: "security.admin",
    operationType: "RULE_UPDATE",
    entity: "FraudRule",
    previousValue: JSON.stringify({
      id: "RULE-001",
      name: "High Value Transaction Alert",
      threshold: 10000,
      action: "FLAG_FOR_REVIEW"
    }, null, 2),
    newValue: JSON.stringify({
      id: "RULE-001",
      name: "High Value Transaction Alert",
      threshold: 5000,
      action: "FLAG_FOR_REVIEW"
    }, null, 2)
  },
  {
    id: 8,
    dateTime: "2023-09-29T08:05:11Z",
    user: "support.supervisor",
    operationType: "USER_UNBLOCK",
    entity: "User",
    previousValue: JSON.stringify({
      id: 1002,
      username: "suspicious.user",
      status: "blocked"
    }, null, 2),
    newValue: JSON.stringify({
      id: 1002,
      username: "suspicious.user",
      status: "active",
      unblockReason: "Identity verified"
    }, null, 2)
  },
  {
    id: 9,
    dateTime: "2023-10-02T11:42:18Z",
    user: "system.admin",
    operationType: "USER_DELETE",
    entity: "User",
    previousValue: JSON.stringify({
      id: 1004,
      username: "test.account",
      email: "test@example.com",
      role: "tester"
    }, null, 2),
    newValue: ""
  },
  {
    id: 10,
    dateTime: "2023-10-05T14:33:27Z",
    user: "security.admin",
    operationType: "RULE_DELETE",
    entity: "FraudRule",
    previousValue: JSON.stringify({
      id: "RULE-002",
      name: "Multiple Failed Logins",
      threshold: 5,
      action: "TEMPORARY_BLOCK"
    }, null, 2),
    newValue: ""
  }
];
