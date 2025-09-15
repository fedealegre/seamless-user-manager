export interface CompanyUserFieldsConfig {
  visible_fields: string[];
  mutable_fields: string[];
  searcheable_fields: string[];
}

export interface CompanyUserConfiguration {
  user: CompanyUserFieldsConfig;
  additional_properties: CompanyUserFieldsConfig;
}

export interface CompanyUserConfigResponse {
  user: CompanyUserFieldsConfig;
  additional_properties: CompanyUserFieldsConfig;
}