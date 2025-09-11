
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
      id: "name",
      key: "name",
      label: "Name",
      type: "text",
      placeholder: "search-by-name-placeholder",
    },
    {
      id: "surname",
      key: "surname",
      label: "Last Name",
      type: "text",
      placeholder: "search-by-surname-placeholder",
    },
    {
      id: "email",
      key: "email",
      label: "Email",
      type: "text",
      placeholder: "search-by-email-placeholder",
    },
    {
      id: "cellPhone",
      key: "cellPhone",
      label: "Cell Phone",
      type: "text",
      placeholder: "search-by-phone-placeholder",
    },
    {
      id: "phoneNumber",
      key: "phoneNumber",
      label: "Phone Number",
      type: "text",
      placeholder: "search-by-phone-placeholder",
    },
    {
      id: "government_identification",
      key: "government_identification",
      label: "DNI",
      type: "text",
      placeholder: "Buscar por DNI",
    },
    {
      id: "government_identification2",
      key: "government_identification2",
      label: "DNI 2",
      type: "text",
      placeholder: "Buscar por DNI 2",
    },
  ],
  searchOnLoad: false,
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
};
