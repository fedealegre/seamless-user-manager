
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/user-service";
import { Transaction, User, Wallet } from "@/lib/api/types";

interface DashboardStatistics {
  totalUsers: number;
  activeWallets: number;
  recentTransactions: number;
  flaggedTransactions: number;
  userGrowth: Array<{ name: string; users: number }>;
  transactionData: Array<{ name: string; transactions: number; value: number }>;
  transactionTypeData: Array<{ name: string; value: number; color: string }>;
  recentAlerts: Array<{
    id: number;
    type: string;
    user: string;
    time: string;
    status: "pending" | "resolved" | "investigating";
  }>;
  isLoading: boolean;
  error: Error | null;
}

export function useDashboardStatistics(): DashboardStatistics {
  // Fetch all users
  const { 
    data: users,
    isLoading: isLoadingUsers,
    error: usersError 
  } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: async () => {
      // Fetch all users with a generic search
      return userService.searchUsers({ });
    }
  });

  // Fetch all wallets
  const {
    data: allWallets,
    isLoading: isLoadingWallets,
    error: walletsError
  } = useQuery({
    queryKey: ['dashboard-wallets'],
    queryFn: async () => {
      return userService.getAllWallets();
    }
  });

  // Fetch recent transactions for transaction metrics
  const {
    data: latestTransaction,
    isLoading: isLoadingLatestTransaction,
    error: latestTransactionError
  } = useQuery({
    queryKey: ['dashboard-latest-transaction'],
    queryFn: async () => {
      // Generate a transaction to ensure we have at least one
      return userService.generateRandomTransaction();
    },
    // Only run this once to avoid spamming
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false
  });

  // Group wallet data by userid to count active wallets
  const walletsByUser = allWallets?.reduce<Record<string, Wallet[]>>((acc, { wallet, userId }) => {
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(wallet);
    return acc;
  }, {}) || {};

  // Process data for dashboard metrics
  const processedData: DashboardStatistics = {
    totalUsers: users?.length || 0,
    activeWallets: allWallets?.filter(({ wallet }) => wallet.status === 'ACTIVE').length || 0,
    recentTransactions: Math.floor(Math.random() * 1000) + 500, // Since we don't have a global list, we'll simulate this
    flaggedTransactions: Math.floor(Math.random() * 50) + 10, // Simulated data for flagged transactions
    
    // User growth data - create simulated historical data based on actual user count
    userGrowth: generateUserGrowthData(users?.length || 0),
    
    // Transaction data - simulate based on our interfaces
    transactionData: generateTransactionData(),
    
    // Transaction type distribution - simulate based on typical usage patterns
    transactionTypeData: [
      { name: "Deposits", value: Math.floor(Math.random() * 300) + 200, color: "#3b82f6" },
      { name: "Withdrawals", value: Math.floor(Math.random() * 200) + 100, color: "#ef4444" },
      { name: "Transfers", value: Math.floor(Math.random() * 150) + 50, color: "#10b981" },
      { name: "Payments", value: Math.floor(Math.random() * 100) + 50, color: "#f59e0b" },
    ],
    
    // Generate recent alerts based on users we have
    recentAlerts: generateRecentAlerts(users || []),
    
    isLoading: isLoadingUsers || isLoadingWallets || isLoadingLatestTransaction,
    error: usersError || walletsError || latestTransactionError || null
  };

  return processedData;
}

// Generate simulated but realistic user growth data
function generateUserGrowthData(currentUserCount: number): Array<{ name: string; users: number }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  let userCount = Math.max(50, Math.floor(currentUserCount * 0.7)); // Start with fewer users
  
  return months.map(month => {
    userCount = Math.floor(userCount * (1 + (Math.random() * 0.2))); // Growth between 0-20%
    return {
      name: month,
      users: userCount
    };
  });
}

// Generate simulated transaction data
function generateTransactionData(): Array<{ name: string; transactions: number; value: number }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  
  return months.map(month => {
    const transactions = Math.floor(Math.random() * 50) + 30;
    const avgValue = Math.floor(Math.random() * 50) + 10; // Average value per transaction
    
    return {
      name: month,
      transactions: transactions,
      value: transactions * avgValue
    };
  });
}

// Generate realistic alert data based on actual users
function generateRecentAlerts(users: User[]): Array<{
  id: number;
  type: string;
  user: string;
  time: string;
  status: "pending" | "resolved" | "investigating";
}> {
  const alertTypes = [
    "Suspicious activity",
    "Large withdrawal",
    "Multiple failed logins",
    "Geographic anomaly",
    "Unusual transaction pattern",
    "Account lockout"
  ];
  
  const timeDescriptions = [
    "Just now",
    "5 min ago",
    "30 min ago",
    "1 hour ago",
    "3 hours ago",
    "Yesterday"
  ];
  
  const statuses: Array<"pending" | "resolved" | "investigating"> = [
    "pending", "resolved", "investigating"
  ];
  
  // Get up to 5 users, or generate placeholder names if none available
  const userPool = users.length > 0 
    ? users.slice(0, Math.min(users.length, 5)) 
    : Array(5).fill(null).map((_, i) => ({ 
        id: i, 
        name: `User ${i+1}`, 
        surname: `Surname ${i+1}` 
      }));
  
  return Array(5).fill(null).map((_, i) => {
    const user = userPool[i % userPool.length];
    const userName = user?.name && user?.surname 
      ? `${user.name} ${user.surname}` 
      : `User ${i+1}`;
    
    return {
      id: i + 1,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      user: userName,
      time: timeDescriptions[Math.floor(Math.random() * timeDescriptions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
  });
}
