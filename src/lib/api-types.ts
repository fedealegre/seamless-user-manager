
export interface Transaction {
    id?: string | number; // Add id field
    originalTransactionId?: string;
    customerId: string;
    walletId: string;
    cardId?: string; // Added for card transactions
    initDate?: string;
    endDate?: string;
    reference?: string;
    transactionId?: string;
    originTransactionId?: string;
    destinationTransactionId?: string;
    status?: string;
    currency?: string;
    type?: string;
    removed?: boolean;
    lastIdTransaction?: string;
    length?: number;
    transactionType?: string;
    movementType?: string; // Add movementType field
    amount?: number; // Added for display purposes
    date?: string; // Added for display purposes
    additionalInfo?: Record<string, any>; // Add additionalInfo field
}

export interface Card {
    id: number;
    userId: string;
    cardNumber: string; // Full card number (will be obfuscated in UI)
    maskedCardNumber: string; // Pre-formatted masked number
    cardType: 'debit' | 'credit' | 'prepaid';
    brand: 'visa' | 'mastercard' | 'amex' | 'other';
    status: 'active' | 'blocked' | 'expired';
    expiryDate: string;
    isDefault: boolean;
    currency: string;
    availableLimit?: number;
    usedLimit?: number;
    createdAt: string;
}

export interface Wallet {
    id: number;
    status?: string;
    companyId: number;
    globalId?: string;
    currency?: string;
    balance?: number;
    availableBalance?: number;
    additionalInfo?: Record<string, string>;
    accumulators?: Array<{ [key: string]: any }>;
}

export interface User {
    id: number;
    publicId?: string;
    companyId: number;
    defaultWalletId?: number;
    username: string;
    name: string;
    surname: string;
    email?: string;
    phoneNumber?: string;
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
    status?: string;
}

export interface CompensationRequest {
    amount: string;
    reason: string;
    transaction_code: string;
    admin_user: string;
    transaction_type: string; // Changed from 'COMPENSATE' to string to allow 'Compensacion'
    compensation_type: 'credit' | 'adjustment';
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
    password?: string; // Added for user creation and authentication
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

export interface AntiFraudRule {
    id?: string;
    applicationTime: 'daily' | 'monthly' | 'yearly';
    transactionTypes: string[];
    limit: number;
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
