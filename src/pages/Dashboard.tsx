
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, ArrowDownRight, Users, Wallet, FileText, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the charts
const transactionData = [
  { name: "Jan", transactions: 65, value: 1200 },
  { name: "Feb", transactions: 59, value: 1100 },
  { name: "Mar", transactions: 80, value: 1400 },
  { name: "Apr", transactions: 81, value: 1750 },
  { name: "May", transactions: 56, value: 900 },
  { name: "Jun", transactions: 55, value: 1000 },
  { name: "Jul", transactions: 40, value: 800 },
];

const userGrowthData = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 500 },
  { name: "Mar", users: 600 },
  { name: "Apr", users: 750 },
  { name: "May", users: 800 },
  { name: "Jun", users: 950 },
  { name: "Jul", users: 1050 },
];

const transactionTypeData = [
  { name: "Deposits", value: 540, color: "#3b82f6" },
  { name: "Withdrawals", value: 320, color: "#ef4444" },
  { name: "Transfers", value: 210, color: "#10b981" },
  { name: "Payments", value: 170, color: "#f59e0b" },
];

const metricsData = [
  { 
    title: "Total Users", 
    value: "24,789", 
    change: "+14.2%", 
    isIncrease: true,
    icon: Users,
    description: "Total registered users"
  },
  { 
    title: "Active Wallets", 
    value: "32,451", 
    change: "+7.5%", 
    isIncrease: true,
    icon: Wallet,
    description: "Wallets with activity in last 30 days"
  },
  { 
    title: "Transactions (7d)", 
    value: "18,493", 
    change: "-2.4%", 
    isIncrease: false,
    icon: FileText,
    description: "Transactions in the last 7 days"
  },
  { 
    title: "Flagged Transactions", 
    value: "143", 
    change: "+5.1%", 
    isIncrease: true,
    icon: AlertTriangle,
    description: "Transactions flagged as suspicious"
  },
];

const recentAlerts = [
  { id: 1, type: "Suspicious activity", user: "John Doe", time: "2 hours ago", status: "pending" },
  { id: 2, type: "Large withdrawal", user: "Sarah Smith", time: "5 hours ago", status: "resolved" },
  { id: 3, type: "Multiple failed logins", user: "Mike Johnson", time: "Yesterday", status: "pending" },
  { id: 4, type: "Geographic anomaly", user: "Emma Williams", time: "Yesterday", status: "investigating" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="flex space-x-2">
          <Tabs defaultValue="day" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
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
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Transaction Overview</CardTitle>
            <CardDescription>Transaction volume and count over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
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
                  name="Transaction Volume ($)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="transactions"
                  name="Transaction Count"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Transaction Types</CardTitle>
            <CardDescription>Distribution by transaction category</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
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
                <Bar dataKey="users" name="New Users" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Security and system alerts</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <p className="text-xs">User: {alert.user}</p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
