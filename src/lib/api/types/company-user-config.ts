export interface CompanyUserConfigResponse {
  user: {
    visible_fields: string[];
    mutable_fields: string[];
    searcheable_fields: string[];
  };
  additional_properties: {
    visible_fields: string[];
    mutable_fields: string[];
    searcheable_fields: string[];
  };
}

export interface CompanyUserConfig {
  visibleFields: string[];
  mutableFields: string[];
  searcheableFields: string[];
}