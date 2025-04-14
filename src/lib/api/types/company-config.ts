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

export const defaultSearchConfig: CompanySearchConfig = {
  fields: [
    {
      id: "id",
      key: "id",
      label: "User ID",
      type: "text",
      placeholder: "Search by User ID...",
    },
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
      label: "Last Name",
      type: "text",
      placeholder: "Search by last name...",
    },
    {
      id: "email",
      key: "email",
      label: "Email",
      type: "text",
      placeholder: "Search by email...",
    },
    {
      id: "cellPhone",
      key: "cellPhone",
      label: "Cell Phone",
      type: "text",
      placeholder: "Search by cell phone number...",
    },
  ],
  searchOnLoad: false,
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
};
