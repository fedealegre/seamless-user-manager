
import { Wallet } from "@/lib/api/types";

// Mock wallet data for development
export const mockWallets: Record<number, Wallet[]> = {
  827: [
    {
      id: 1001,
      name: "Main USD Wallet",
      status: "ACTIVE",
      companyId: 1,
      globalId: "wallet1001",
      currency: "USD",
      balance: 1500.00,
      availableBalance: 1500.00,
      additionalInfo: {
        type: "main",
        category: "personal"
      }
    },
    {
      id: 1002,
      name: "Savings EUR Wallet",
      status: "ACTIVE",
      companyId: 1,
      globalId: "wallet1002",
      currency: "EUR",
      balance: 1000.00,
      availableBalance: 1000.00,
      additionalInfo: {
        type: "savings",
        category: "personal"
      }
    }
  ],
  828: [
    {
      id: 2001,
      name: "Main CAD Wallet",
      status: "ACTIVE",
      companyId: 1,
      globalId: "wallet2001",
      currency: "CAD",
      balance: 2500.00,
      availableBalance: 2500.00,
      additionalInfo: {
        type: "main",
        category: "personal"
      }
    }
  ],
  829: [
    {
      id: 3001,
      name: "Main MXN Wallet",
      status: "BLOCKED",
      companyId: 1,
      globalId: "wallet3001",
      currency: "MXN",
      balance: 5000.00,
      availableBalance: 0.00,
      additionalInfo: {
        type: "main",
        category: "personal"
      }
    }
  ]
};
