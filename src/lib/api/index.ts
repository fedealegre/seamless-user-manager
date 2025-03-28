
import { ApiClient } from "./api-client";
import { OAuth2Client } from "./oauth-client";
import { BackofficeUser, AntiFraudRule, AuditLog } from "./types";

// Export the types
export * from "./types";

// Initialize OAuth2Client and ApiClient
const oauthClient = new OAuth2Client(
  "backoffice-client",
  "backoffice-secret",
  "https://api.example.com/oauth/token",
  "https://api.example.com/oauth/authorize"
);

// Initialize API client with base URL
const apiService = new ApiClient(oauthClient, "https://api.example.com");

// Mock data for development
// This would be removed in production and replaced with real API calls
const mockBackofficeUsers: BackofficeUser[] = [
  {
    id: "1",
    name: "Admin",
    surname: "User",
    email: "admin@example.com",
    roles: ["admin"],
    state: "active",
    last_login: "2023-09-01T10:00:00Z"
  },
  {
    id: "2",
    name: "Support",
    surname: "User",
    email: "support@example.com",
    roles: ["support"],
    state: "active",
    last_login: "2023-09-02T11:00:00Z"
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
  }
];

// Mock implementations for development
// Override the API methods with mock implementations
const originalListBackofficeUsers = apiService.listBackofficeUsers.bind(apiService);
apiService.listBackofficeUsers = async (): Promise<BackofficeUser[]> => {
  console.log("Mock: Fetching backoffice users");
  return [...mockBackofficeUsers];
};

const originalCreateBackofficeUser = apiService.createBackofficeUser.bind(apiService);
apiService.createBackofficeUser = async (user: BackofficeUser): Promise<void> => {
  console.log("Mock: Creating backoffice user", user);
  mockBackofficeUsers.push({
    ...user,
    id: `${mockBackofficeUsers.length + 1}`,
    last_login: new Date().toISOString()
  });
};

const originalListAntiFraudRules = apiService.listAntiFraudRules.bind(apiService);
apiService.listAntiFraudRules = async (): Promise<AntiFraudRule[]> => {
  console.log("Mock: Fetching anti-fraud rules");
  return [...mockAntiFraudRules];
};

const originalAddAntiFraudRule = apiService.addAntiFraudRule.bind(apiService);
apiService.addAntiFraudRule = async (rule: AntiFraudRule): Promise<void> => {
  console.log("Mock: Adding anti-fraud rule", rule);
  mockAntiFraudRules.push({
    ...rule,
    id: `rule${mockAntiFraudRules.length + 1}`
  });
};

const originalModifyAntiFraudRule = apiService.modifyAntiFraudRule.bind(apiService);
apiService.modifyAntiFraudRule = async (ruleId: string, rule: AntiFraudRule): Promise<void> => {
  console.log("Mock: Modifying anti-fraud rule", ruleId, rule);
  const index = mockAntiFraudRules.findIndex(r => r.id === ruleId);
  if (index >= 0) {
    mockAntiFraudRules[index] = { ...rule, id: ruleId };
  }
};

const originalDeleteAntiFraudRule = apiService.deleteAntiFraudRule.bind(apiService);
apiService.deleteAntiFraudRule = async (ruleId: string): Promise<void> => {
  console.log("Mock: Deleting anti-fraud rule", ruleId);
  const index = mockAntiFraudRules.findIndex(r => r.id === ruleId);
  if (index >= 0) {
    mockAntiFraudRules.splice(index, 1);
  }
};

const originalGetAuditLogs = apiService.getAuditLogs.bind(apiService);
apiService.getAuditLogs = async (
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
  
  return filteredLogs;
};

// Export the API service
export { apiService };
// Also export as api for newer code patterns
export const api = apiService;
