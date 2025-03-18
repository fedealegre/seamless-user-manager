
import { Transaction } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";

// Transaction status badges with appropriate colors
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

// Transaction type badges with appropriate colors
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
    default:
      return <Badge>{type || 'Unknown'}</Badge>;
  }
};

export const formatCurrency = (amount?: number, currency?: string) => {
  if (amount === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
};
