
import { LucideIcon, FileCog } from "lucide-react";

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
