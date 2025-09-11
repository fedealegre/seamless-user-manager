import { CompanyUserConfiguration, CompanyUserConfigService } from "../types/company-user-config";

// Mock configurations for different companies
const COMPANY_CONFIGURATIONS: Record<string, CompanyUserConfiguration> = {
  "1111": {
    user: {
      visible_fields: [
        "name",
        "surname", 
        "username",
        "email",
        "cellPhone",
        "phoneNumber",
        "birthDate",
        "nationality",
        "gender",
        "language",
        "region",
        "status",
        "government_identification",
        "government_identification_type",
        "government_identification2",
        "government_identification_type2",
        "blocked",
        "blockReason"
      ],
      mutable_fields: [
        "name",
        "surname",
        "username", 
        "email",
        "cellPhone",
        "phoneNumber",
        "birthDate",
        "nationality",
        "gender",
        "language",
        "region",
        "status",
        "government_identification",
        "government_identification_type",
        "government_identification2",
        "government_identification_type2"
      ],
      searcheable_fields: [
        "name",
        "surname",
        "email",
        "cellPhone",
        "phoneNumber",
        "government_identification",
        "government_identification2"
      ]
    },
    additional_properties: {
      visible_fields: [
        "additionalInfo"
      ],
      mutable_fields: [
        "additionalInfo"
      ],
      searcheable_fields: []
    }
  },
  "2222": {
    user: {
      visible_fields: [
        "name",
        "surname",
        "email",
        "cellPhone",
        "status",
        "government_identification",
        "government_identification_type"
      ],
      mutable_fields: [
        "email",
        "cellPhone"
      ],
      searcheable_fields: [
        "name",
        "surname",
        "email"
      ]
    },
    additional_properties: {
      visible_fields: [],
      mutable_fields: [],
      searcheable_fields: []
    }
  }
};

export class MockCompanyConfigService implements CompanyUserConfigService {
  async getCompanyUserConfiguration(companyId: string): Promise<CompanyUserConfiguration> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const config = COMPANY_CONFIGURATIONS[companyId];
    
    if (!config) {
      throw new Error(`Company configuration not found for company ID: ${companyId}`);
    }
    
    return config;
  }
}

export const companyConfigService = new MockCompanyConfigService();