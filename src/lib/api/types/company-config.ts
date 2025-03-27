
import { User } from "../types";

export type SearchFieldType = "text" | "number" | "select" | "date";

export interface SearchFieldOption {
  value: string;
  label: string;
}

export interface SearchField {
  id: string;
  key: keyof User | string;
  label: string;
  type: SearchFieldType;
  placeholder?: string;
  options?: SearchFieldOption[];
  required?: boolean;
  minLength?: number;
  defaultValue?: string;
}

export interface CompanySearchConfig {
  fields: SearchField[];
  searchOnLoad?: boolean;
  pagination?: {
    defaultPageSize: number;
    pageSizeOptions: number[];
  };
}

// Example configuration
export const defaultSearchConfig: CompanySearchConfig = {
  fields: [
    {
      id: "name",
      key: "name",
      label: "Name",
      type: "text",
      placeholder: "Search by name...",
    },
    {
      id: "surname",
      key: "surname",
      label: "Surname",
      type: "text",
      placeholder: "Search by surname...",
    },
    {
      id: "identifier",
      key: "username",
      label: "ID/Email",
      type: "text",
      placeholder: "Search by ID or email...",
    },
    {
      id: "phone",
      key: "phoneNumber",
      label: "Phone",
      type: "text",
      placeholder: "Search by phone number...",
    },
    {
      id: "walletId",
      key: "walletId",
      label: "Wallet ID",
      type: "text",
      placeholder: "Search by wallet ID...",
    },
  ],
  searchOnLoad: false,
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
};
