
import { User, Wallet, Transaction } from "../types";

// Mock data for users
export const mockUsers: User[] = [
  {id: 827, name: 'Wilson Ricardo', surname: 'Guarin Nava', email: 'wilson.guarin@globant.com', gender: 'M', cellPhone: '573132615186', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Junior! 🥳👨‍👩‍👧👨🏻‍💻⚽🥏🏕️🏖️', occupation: 'Empleado/a', email_verification_code: '{ "verified": true, "code": "null", "expiration": 0}', income_source: 'Ingresos del mercado de valores', tyc_gpdpr: 'true', pin_authentication_time: '1732208108119', last_channel_used: 'Silbo-Waasabi-QA', liveness_reference_id: '366', work_area: 'Construcción', liveness_authentication_time: '1732208408119', dubious_behaviour: '', liveness_authenticated: 'true', silbo_use: 'Proyectos personales', onboard_data: '{ "name": "WILSON RICARDO", "surname": "GUARIN NAVA"}', account_state: 'ENABLED'}},
  {id: 830, name: '0455440854', cellPhone: '5491132500950', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Marian 🦋', tyc_gpdpr: 'false', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
  {id: 831, name: '4928559875', cellPhone: '34670392532', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Isa', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1732221641749', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
  {id: 832, name: '2590880685', cellPhone: '34670392532', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Isa', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1732221982970', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
  {id: 834, name: '7719467959', cellPhone: '573041206395', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Sarita', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1732565039186', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
  {id: 837, name: '3062709716', cellPhone: '573041206395', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Sarita', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1732567039247', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
  {id: 838, name: '1667013346', cellPhone: '573041206395', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Sarita', dubious_behaviour: '', tyc_gpdpr: 'true', pin_authentication_time: '1732567909148', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED'}},
  {id: 840, name: 'Isabel', surname: 'Tovar Pozo', cellPhone: '50672476094', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Carmen Torres', liveness_authentication_time: '1732628387054', dubious_behaviour: '', liveness_authenticated: 'true', tyc_gpdpr: 'true', onboard_data: '{ "name": "ISABEL", "surname": "TOVAR POZO"}', pin_authentication_time: '1732628087054', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', liveness_reference_id: '480'}},
  {id: 848, name: 'Jose Leopoldo', surname: 'Pedregal Forte', cellPhone: '34744487047', deleted: false, blocked: false, additionalInfo: {newsletter: 'false', whatsapp_profile_name: 'Pepe Pedregal', liveness_authentication_time: '1732810695754', dubious_behaviour: '', liveness_authenticated: 'true', tyc_gpdpr: 'true', onboard_data: '{ "name": "JOSE LEOPOLDO", "surname": "PEDREGAL FORTE"}', pin_authentication_time: '1732810395755', last_channel_used: 'Silbo-Waasabi-QA', account_state: 'ENABLED', liveness_reference_id: '555'}},
  // ... more mock users with same structure (shortened for brevity)
];

// Mock wallets data
export const mockWallets: { [userId: number]: Wallet[] } = {
  827: [
    {
      id: 101,
      companyId: 1,
      status: "ACTIVE",
      currency: "USD",
      balance: 1250.75,
      availableBalance: 1200.50,
      additionalInfo: { "walletType": "PRIMARY" }
    },
    {
      id: 102,
      companyId: 1,
      status: "ACTIVE",
      currency: "EUR",
      balance: 850.25,
      availableBalance: 850.25,
      additionalInfo: { "walletType": "SECONDARY" }
    }
  ],
  830: [
    {
      id: 201,
      companyId: 1,
      status: "ACTIVE",
      currency: "USD",
      balance: 520.30,
      availableBalance: 520.30,
      additionalInfo: { "walletType": "PRIMARY" }
    }
  ],
  848: [
    {
      id: 301,
      companyId: 1,
      status: "BLOCKED",
      currency: "GBP",
      balance: 0,
      availableBalance: 0,
      additionalInfo: { "walletType": "PRIMARY" }
    }
  ]
};

// Mock transactions data
export const mockTransactions: { [walletId: number]: Transaction[] } = {
  101: [
    {
      transactionId: "tx_10001",
      customerId: "827",
      walletId: "101",
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      status: "completed",
      type: "deposit",
      amount: 500,
      currency: "USD",
      reference: "Salary payment"
    },
    {
      transactionId: "tx_10002",
      customerId: "827",
      walletId: "101",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: "completed",
      type: "withdrawal",
      amount: 150,
      currency: "USD",
      reference: "ATM withdrawal"
    },
    {
      transactionId: "tx_10003",
      customerId: "827",
      walletId: "101",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      status: "completed",
      type: "transfer",
      amount: 200,
      currency: "USD",
      reference: "Transfer to savings"
    }
  ],
  102: [
    {
      transactionId: "tx_20001",
      customerId: "827",
      walletId: "102",
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      status: "completed",
      type: "deposit",
      amount: 600,
      currency: "EUR",
      reference: "Foreign income"
    },
    {
      transactionId: "tx_20002",
      customerId: "827",
      walletId: "102",
      date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      status: "pending",
      type: "withdrawal",
      amount: 50,
      currency: "EUR",
      reference: "Online purchase"
    }
  ],
  201: [
    {
      transactionId: "tx_30001",
      customerId: "830",
      walletId: "201",
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      status: "completed",
      type: "deposit",
      amount: 300,
      currency: "USD",
      reference: "Refund"
    }
  ],
  301: [
    {
      transactionId: "tx_40001",
      customerId: "848",
      walletId: "301",
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      status: "cancelled",
      type: "withdrawal",
      amount: 750,
      currency: "GBP",
      reference: "Suspicious activity"
    }
  ]
};
