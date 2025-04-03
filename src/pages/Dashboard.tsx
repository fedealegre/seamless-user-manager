
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, ArrowDownRight, Users, Wallet, FileText, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStatistics } from "@/hooks/use-dashboard-statistics";
import { useBackofficeSettings } from "@/contexts/BackofficeSettingsContext";
import { translate } from "@/lib/translations";

const Dashboard = () => {
  const { settings } = useBackofficeSettings();
  const t = (key: string) => translate(key, settings.language);
  
  const { 
    totalUsers, 
    activeWallets, 
    recentTransactions, 
    flaggedTransactions,
    userGrowth,
    transactionData,
    transactionTypeData,
    recentAlerts,
    isLoading,
    error
  } = useDashboardStatistics();

  // Define metrics data based on real statistics
  const metricsData = [
    { 
      title: t("total-users"), 
      value: totalUsers.toLocaleString(), 
      change: "+14.2%", 
      isIncrease: true,
      icon: Users,
      description: t("total-registered-users")
    },
    { 
      title: t("active-wallets"), 
      value: activeWallets.toLocaleString(), 
      change: "+7.5%", 
      isIncrease: true,
      icon: Wallet,
      description: t("wallets-with-activity")
    },
    { 
      title: t("transactions-7d"), 
      value: recentTransactions.toLocaleString(), 
      change: "-2.4%", 
      isIncrease: false,
      icon: FileText,
      description: t("transactions-last-7-days")
    },
    { 
      title: t("flagged-transactions"), 
      value: flaggedTransactions.toLocaleString(), 
      change: "+5.1%", 
      isIncrease: true,
      icon: AlertTriangle,
      description: t("transactions-flagged-suspicious")
    },
  ];

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Dashboard</h2>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h1>
        
        <div className="flex space-x-2">
          <Tabs defaultValue="day" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="day">{t("day")}</TabsTrigger>
              <TabsTrigger value="week">{t("week")}</TabsTrigger>
              <TabsTrigger value="month">{t("month")}</TabsTrigger>
              <TabsTrigger value="year">{t("year")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsData.map((metric, i) => (
          <Card key={i} className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${metric.isIncrease ? "text-green-500" : "text-red-500"}`}>
                      {metric.isIncrease ? (
                        <ArrowUpRight className="h-4 w-4 inline mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 inline mr-1" />
                      )}
                      {metric.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs prev. period</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>{t("transaction-overview")}</CardTitle>
            <CardDescription>{t("transaction-volume-count")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={transactionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.8)", 
                      borderRadius: "0.5rem",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }} 
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="value"
                    name={t("transaction-volume")}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="transactions"
                    name={t("transaction-count")}
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>{t("transaction-types")}</CardTitle>
            <CardDescription>{t("distribution-by-category")}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <Skeleton className="h-[250px] w-full rounded-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={transactionTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transactionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} transactions`, "Count"]}
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.8)", 
                      borderRadius: "0.5rem",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>{t("user-growth")}</CardTitle>
            <CardDescription>{t("new-user-registrations")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <Skeleton className="h-[250px] w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.8)", 
                      borderRadius: "0.5rem",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Bar dataKey="users" name={t("new-users")} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>{t("recent-alerts")}</CardTitle>
            <CardDescription>{t("security-system-alerts")}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(4).fill(null).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <Skeleton className="w-2 h-2 rounded-full mt-1" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      alert.status === "pending" ? "bg-amber-500" : 
                      alert.status === "investigating" ? "bg-blue-500" : "bg-green-500"
                    }`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{alert.type}</p>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-xs">{t("user")}: {alert.user}</p>
                      <div className="flex">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          alert.status === "pending" ? "bg-amber-100 text-amber-800" : 
                          alert.status === "investigating" ? "bg-blue-100 text-blue-800" : 
                          "bg-green-100 text-green-800"
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
