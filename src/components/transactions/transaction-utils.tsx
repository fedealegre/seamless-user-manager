
import React from "react";
import { Transaction } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

// Function to get translated status badges
export const getTranslatedStatusBadge = (status?: string, language: string = "en") => {
  const t = (key: string) => translate(key, language as any);
  const statusKey = status?.toLowerCase() || "unknown";
  const translatedStatus = t(statusKey);
  
  switch(statusKey) {
    case 'completed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{translatedStatus}</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{translatedStatus}</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">{translatedStatus}</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">{translatedStatus}</Badge>;
    default:
      return <Badge variant="outline">{status || t("unknown")}</Badge>;
  }
};

// Function to get translated type badges
export const getTranslatedTypeBadge = (type?: string, language: string = "en") => {
  const t = (key: string) => translate(key, language as any);
  const typeKey = type?.toLowerCase() || "unknown";
  const translatedType = t(typeKey);
  
  switch(typeKey) {
    case 'deposit':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{translatedType}</Badge>;
    case 'withdrawal':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{translatedType}</Badge>;
    case 'transfer':
      return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">{translatedType}</Badge>;
    case 'compensation':
      return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">{translatedType}</Badge>;
    case 'cash_in':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{translatedType}</Badge>;
    case 'TK_PAY_REQ':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{translatedType}</Badge>;
    case 'TRANSFER_CASH_IN':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{translatedType}</Badge>;
    case 'CASH_OUT':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{translatedType}</Badge>;
    case 'TK_PAY_REQ_CASH_OUT':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{translatedType}</Badge>;
    case 'TRANSFER_CASH_OUT':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{translatedType}</Badge>;
    case 'COMPENSATE':
      return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">{translatedType}</Badge>;
    default:
      return <Badge>{type || t("unknown")}</Badge>;
  }
};

// Original functions remain for backward compatibility
export const getStatusBadge = (status?: string) => {
  switch(status?.toLowerCase()) {
    case 'completed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
    default:
      return <Badge variant="outline">{status || 'Unknown'}</Badge>;
  }
};

export const getTypeBadge = (type?: string) => {
  switch(type?.toLowerCase()) {
    case 'deposit':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Deposit</Badge>;
    case 'withdrawal':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Withdrawal</Badge>;
    case 'transfer':
      return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Transfer</Badge>;
    case 'compensation':
      return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Compensation</Badge>;
    case 'CASH_IN':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">CASH_IN</Badge>;
    case 'TK_PAY_REQ':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">TK_PAY_REQ</Badge>;
    case 'TRANSFER_CASH_IN':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">TRANSFER_CASH_IN</Badge>;
    case 'CASH_OUT':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">CASH_OUT</Badge>;
    case 'TK_PAY_REQ_CASH_OUT':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">TK_PAY_REQ_CASH_OUT</Badge>;
    case 'TRANSFER_CASH_OUT':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">TRANSFER_CASH_OUT</Badge>;
    case 'COMPENSATE':
      return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">COMPENSATE</Badge>;
    default:
      return <Badge>{type || 'Unknown'}</Badge>;
  }
};

export const formatCurrency = (amount?: number, currency?: string, locale: string = "en-US") => {
  if (amount === undefined) return '-';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
};
