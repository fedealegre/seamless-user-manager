
// API types based on the OpenAPI specifications

export interface Transaction {
    originalTransactionId?: string;
    customerId: string;
    walletId: string;
    initDate?: string;
    endDate?: string;
    reference?: string;
    transactionId: string;
    originTransactionId?: string;
    destinationTransactionId?: string;
    status?: string;
    currency?: string;
    type?: string;
    removed?: boolean;
    lastIdTransaction?: string;
    length?: number;
    transactionType?: string;
    amount?: number;
    date?: string;
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
    companyId?: number; // Made optional to match mock data
    publicId?: string;
    defaultWalletId?: number;
    username?: string; // Made optional to match mock data
    name?: string; // Made optional to match mock data
    surname?: string; // Made optional to match mock data
    email?: string;
    phoneNumber?: string;
    phoneCompany?: string;
    cellPhone?: string;
    gender?: 'M' | 'F' | 'Other'; // Updated to match the expected enum values
    governmentIdentification2?: string;
    governmentIdentificationType2?: string;
    governmentIdentification?: string;
    governmentIdentificationType?: string;
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
    transaction_type: 'COMPENSATE';
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
