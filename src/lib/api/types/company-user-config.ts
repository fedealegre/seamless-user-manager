export interface CompanyUserConfiguration {
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

export interface CompanyUserConfigService {
  getCompanyUserConfiguration(companyId: string): Promise<CompanyUserConfiguration>;
}