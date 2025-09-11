// API types based on the OpenAPI specifications

export interface TransactionStatusChange {
    oldStatus: string;
    newStatus: string;
    reason: string;
    changedBy: string;
    changedAt: string;
}

export interface Transaction {
    originalTransactionId?: string;
    customerId: string;
    walletId: string;
    initDate?: string;
    endDate?: string;
    reference?: string;
    id: number;
    transactionId?: string; // Added to match usage in components
    originTransactionId?: string;
    destinationTransactionId?: string;
    status?: string;
    currency?: string;
    transactionType?: string; // Single definition
    movementType?: string;
    type?: string; // Added to match usage in components
    removed?: boolean;
    lastIdTransaction?: string;
    length?: number;
    amount?: number;
    date?: string;
    additionalInfo?: Record<string, any>; // Added to support mock data
    statusHistory?: TransactionStatusChange[]; // New field for status change history
}

export interface Wallet {
    id: number;
    name?: string; // Kept to avoid breaking mockWallets
    status?: string;
    companyId: number;
    globalId?: string;
    currency?: string;
    balance?: number;
    availableBalance?: number;
    additionalInfo?: Record<string, string>;
    accumulators?: Array<{ [key: string]: any }>;
}

export interface WalletUserAssociation {
    walletId: number;
    userId: string;
    associationDate: string;
    isOwner: boolean;
}

export interface User {
    id: number;
    companyId?: number; 
    publicId?: string;
    defaultWalletId?: number;
    username?: string; 
    name?: string; 
    surname?: string; 
    email?: string;
    phoneNumber?: string;
    phoneCompany?: string;
    cellPhone?: string;
    gender?: 'M' | 'F' | 'Other'; 
    government_identification2?: string;
    government_identification_type2?: string;
    government_identification?: string;
    government_identification_type?: string;
    birthDate?: string;
    nationality?: string;
    hasPin?: boolean;
    timeZone?: string;
    language?: string;
    region?: string;
    additionalInfo?: Record<string, string>;
    deleted?: boolean;
    blocked?: boolean;
    blockReason?: string; // Added the blockReason field
    status?: string;
    creationDate?: string;
    modificationDate?: string;
    biometrics?: boolean;
    ocr?: boolean;
    cpg?: boolean;
    address?: Address;
    network?: Network;
    blockDetails?: string[];
}

export interface Network {
    network?: string;
    identifier?: string;
}

export interface Address {
    street?: string;
    number?: string;
    floor?: string;
    department?: string;
    zipCode?: string;
    city?: string;
    province?: string;
    country?: string;
}

export interface CompensationRequest {
    amount: string;
    reason: string;
    transaction_code: string;
    admin_user: string;
    transaction_type: string; // Modified to accept string values like 'Compensacion'
    compensation_type: 'credit' | 'adjustment';
}

export interface ResetPasswordRequest {
    userId: string;
    reason: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
    temporaryPassword?: string;
}

export interface CancelTransactionRequest {
    reason: string;
}

export interface BackofficeUser {
    id?: string;
    name: string;
    surname: string;
    email?: string;
    roles: string[];
    state: 'active' | 'blocked';
    last_login?: string;
    companyId: string;
}

export interface AuditLog {
    id?: string;
    dateTime: string;
    user: string;
    operationType: string;
    previousValue: string;
    newValue: string;
    entity?: string;
}

export interface AmountWithCurrency {
    value: number;
    currency: string;
}

export type AntiFraudRuleType = 
    | 'max_transactions_daily'
    | 'max_amount_daily'
    | 'max_amount_daily_cash_out'
    | 'max_amount_one_factor_cash_out'
    | 'max_amount_daily_cash_in'
    | 'max_amount_one_factor_cash_in'
    | 'max_amount_daily_send_money'
    | 'max_amount_one_factor_send_money'
    | 'custom';

export interface AntiFraudRule {
    id?: string;
    ruleType?: AntiFraudRuleType;
    applicationTime?: 'daily' | 'monthly' | 'yearly';
    transactionTypes?: string[];
    limit?: number;
    amountLimit?: AmountWithCurrency;
    securityFactor?: 'one_factor' | 'two_factor' | 'any';
    enabled?: boolean;
    description?: string;
}

export interface LoginRequest {
    userName: string;
    password: string;
    appDeviceId?: string;
    appVersion?: string;
    appModel?: string;
    appPlatform?: string;
    appRelease?: string;
    appApi?: string;
    appVersionLabel?: string;
    appFirebaseToken?: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: BackofficeUser;
}

export interface TransactionListParams {
    startDate?: string;
    endDate?: string;
    status?: string;
    type?: string;
    currency?: string;
    page?: number;
    pageSize?: number;
}

// Error responses
export interface ApiError {
    message: string;
    statusCode: number;
}
