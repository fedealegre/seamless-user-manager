// Export the types
export * from "./types";

// Mock data for development
import { mockUsers } from "./mock/mock-users-data";
import { BackofficeUser, AntiFraudRule, AuditLog, LoginRequest, LoginResponse } from "./types";

// Mock backoffice users with passwords
const mockBackofficeUsers: BackofficeUser[] = [
  {
    id: "1",
    name: "Admin",
    surname: "User",
    email: "admin@example.com",
    password: "admin123", // Added password
    roles: ["configurador"],
    state: "active",
    last_login: "2023-09-01T10:00:00Z"
  },
  {
    id: "2",
    name: "Support",
    surname: "User",
    email: "support@example.com",
    password: "support123", // Added password
    roles: ["operador"],
    state: "active",
    last_login: "2023-09-02T11:00:00Z"
  },
  {
    id: "3",
    name: "Operations",
    surname: "Manager",
    email: "operations@example.com",
    password: "operations123", // Added password
    roles: ["operador", "analista"],
    state: "active",
    last_login: "2023-09-03T09:30:00Z"
  },
  {
    id: "4",
    name: "Finance",
    surname: "Analyst",
    email: "finance@example.com",
    password: "finance123", // Added password
    roles: ["compensador"],
    state: "blocked",
    last_login: "2023-08-25T14:20:00Z"
  }
];

const mockAntiFraudRules: AntiFraudRule[] = [
  {
    id: "rule1",
    applicationTime: "daily",
    transactionTypes: ["deposit", "withdrawal"],
    limit: 5000
  },
  {
    id: "rule2",
    applicationTime: "monthly",
    transactionTypes: ["transfer"],
    limit: 50000
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: "log1",
    dateTime: "2023-09-01T10:00:00Z",
    user: "admin@example.com",
    operationType: "user_create",
    previousValue: "",
    newValue: JSON.stringify({ name: "New User", email: "user@example.com" }),
    entity: "user"
  },
  {
    id: "log2",
    dateTime: "2023-09-02T11:00:00Z",
    user: "admin@example.com",
    operationType: "rule_update",
    previousValue: JSON.stringify({ limit: 1000 }),
    newValue: JSON.stringify({ limit: 5000 }),
    entity: "anti_fraud_rule"
  },
  {
    id: "log3",
    dateTime: "2023-09-03T14:30:00Z",
    user: "support@example.com",
    operationType: "user_block",
    previousValue: JSON.stringify({ state: "active" }),
    newValue: JSON.stringify({ state: "blocked" }),
    entity: "user"
  },
  {
    id: "log4",
    dateTime: "2023-09-04T09:15:00Z",
    user: "admin@example.com",
    operationType: "permission_change",
    previousValue: JSON.stringify({ roles: ["support"] }),
    newValue: JSON.stringify({ roles: ["support", "reporting"] }),
    entity: "backoffice_user"
  },
  {
    id: "log5",
    dateTime: "2023-09-05T16:45:00Z",
    user: "operations@example.com",
    operationType: "transaction_cancel",
    previousValue: JSON.stringify({ status: "pending" }),
    newValue: JSON.stringify({ status: "cancelled" }),
    entity: "transaction"
  },
  {
    id: "log6",
    dateTime: "2023-09-06T11:20:00Z",
    user: "finance@example.com",
    operationType: "compensation",
    previousValue: "",
    newValue: JSON.stringify({ amount: 500, reason: "Service issue" }),
    entity: "transaction"
  },
  {
    id: "log7",
    dateTime: "2023-09-07T13:10:00Z",
    user: "admin@example.com",
    operationType: "config_change",
    previousValue: JSON.stringify({ field_visibility: { email: true } }),
    newValue: JSON.stringify({ field_visibility: { email: false } }),
    entity: "settings"
  }
];

// Simple mock API service
export const apiService = {
  // Backoffice users
  listBackofficeUsers: async (): Promise<BackofficeUser[]> => {
    console.log("Mock: Fetching backoffice users");
    // Return users without passwords for security
    return mockBackofficeUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  },
  
  createBackofficeUser: async (user: BackofficeUser): Promise<void> => {
    console.log("Mock: Creating backoffice user", user);
    // Validate email isn't already in use
    if (mockBackofficeUsers.some(u => u.email === user.email)) {
      throw new Error("Email is already in use");
    }
    
    mockBackofficeUsers.push({
      ...user,
      id: `${mockBackofficeUsers.length + 1}`,
      last_login: new Date().toISOString()
    });
  },
  
  // Update backoffice user
  updateBackofficeUser: async (userId: string, updatedUser: BackofficeUser): Promise<void> => {
    console.log("Mock: Updating backoffice user", userId, updatedUser);
    const index = mockBackofficeUsers.findIndex(user => user.id === userId);
    
    if (index >= 0) {
      // Check if email is being changed and not already in use by another user
      if (updatedUser.email !== mockBackofficeUsers[index].email &&
          mockBackofficeUsers.some(u => u.id !== userId && u.email === updatedUser.email)) {
        throw new Error("Email is already in use by another user");
      }
      
      // Keep the existing password if not explicitly updated
      if (!updatedUser.password) {
        updatedUser.password = mockBackofficeUsers[index].password;
      }
      
      mockBackofficeUsers[index] = {
        ...mockBackofficeUsers[index],
        ...updatedUser,
        id: userId // Ensure ID remains the same
      };
    } else {
      throw new Error("User not found");
    }
  },
  
  // Add the missing methods for backoffice users
  deleteBackofficeUser: async (userId: string): Promise<void> => {
    console.log("Mock: Deleting backoffice user", userId);
    const index = mockBackofficeUsers.findIndex(user => user.id === userId);
    if (index >= 0) {
      mockBackofficeUsers.splice(index, 1);
    } else {
      throw new Error("User not found");
    }
  },
  
  blockBackofficeUser: async (userId: string): Promise<void> => {
    console.log("Mock: Blocking backoffice user", userId);
    const user = mockBackofficeUsers.find(u => u.id === userId);
    if (user) {
      user.state = "blocked";
    } else {
      throw new Error("User not found");
    }
  },
  
  unblockBackofficeUser: async (userId: string): Promise<void> => {
    console.log("Mock: Unblocking backoffice user", userId);
    const user = mockBackofficeUsers.find(u => u.id === userId);
    if (user) {
      user.state = "active";
    } else {
      throw new Error("User not found");
    }
  },
  
  modifyUserRoles: async (userId: string, roles: string[]): Promise<void> => {
    console.log("Mock: Modifying user roles", userId, roles);
    const user = mockBackofficeUsers.find(u => u.id === userId);
    if (user) {
      user.roles = [...roles];
    } else {
      throw new Error("User not found");
    }
  },
  
  // Updated login functionality to use email/password
  login: async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    console.log("Mock: Login attempt", loginRequest);
    
    // First try to authenticate using the mock users with predefined username/password
    const mockUserMatch = mockBackofficeUsers.find(
      u => u.email === loginRequest.userName && u.password === loginRequest.password
    );
    
    if (mockUserMatch) {
      // Update last login time
      const userIndex = mockBackofficeUsers.findIndex(u => u.id === mockUserMatch.id);
      if (userIndex >= 0) {
        mockBackofficeUsers[userIndex].last_login = new Date().toISOString();
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = mockUserMatch;
      
      return {
        accessToken: "mock-token-" + Date.now(),
        refreshToken: "mock-refresh-token-" + Date.now(),
        expiresIn: 86400, // 24 hours
        user: userWithoutPassword
      };
    }
    
    // If no matching user is found
    throw new Error("Invalid email or password");
  },
  
  // Anti-fraud rules
  listAntiFraudRules: async (): Promise<AntiFraudRule[]> => {
    console.log("Mock: Fetching anti-fraud rules");
    return [...mockAntiFraudRules];
  },
  
  addAntiFraudRule: async (rule: AntiFraudRule): Promise<void> => {
    console.log("Mock: Adding anti-fraud rule", rule);
    mockAntiFraudRules.push({
      ...rule,
      id: `rule${mockAntiFraudRules.length + 1}`
    });
  },
  
  modifyAntiFraudRule: async (ruleId: string, rule: AntiFraudRule): Promise<void> => {
    console.log("Mock: Modifying anti-fraud rule", ruleId, rule);
    const index = mockAntiFraudRules.findIndex(r => r.id === ruleId);
    if (index >= 0) {
      mockAntiFraudRules[index] = { ...rule, id: ruleId };
    }
  },
  
  deleteAntiFraudRule: async (ruleId: string): Promise<void> => {
    console.log("Mock: Deleting anti-fraud rule", ruleId);
    const index = mockAntiFraudRules.findIndex(r => r.id === ruleId);
    if (index >= 0) {
      mockAntiFraudRules.splice(index, 1);
    }
  },
  
  // Audit logs
  getAuditLogs: async (
    startDate?: string,
    endDate?: string,
    user?: string,
    operationType?: string
  ): Promise<AuditLog[]> => {
    console.log("Mock: Fetching audit logs", { startDate, endDate, user, operationType });
    
    let filteredLogs = [...mockAuditLogs];
    
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.dateTime) >= new Date(startDate));
    }
    
    if (endDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.dateTime) <= new Date(endDate));
    }
    
    if (user) {
      filteredLogs = filteredLogs.filter(log => log.user.includes(user));
    }
    
    if (operationType) {
      filteredLogs = filteredLogs.filter(log => log.operationType === operationType);
    }
    
    // Sort by date (newest first)
    filteredLogs.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    
    return filteredLogs;
  }
};

// Also export as api for newer code patterns
export const api = apiService;
