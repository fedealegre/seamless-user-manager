import { CompanyUserConfiguration } from "@/lib/api/types/company-user-config";

// Mock configurations based on user roles
const ROLE_CONFIGURATIONS: Record<string, CompanyUserConfiguration> = {
  // Admin users see all fields
  "admin": {
    user: {
      visible_fields: [
        "government_identification",
        "government_identification2", 
        "gender",
        "government_identification_type2",
        "surname",
        "government_identification_type",
        "name",
        "email",
        "cellPhone",
        "birthDate",
        "nationality",
        "language",
        "region",
        "status",
        "hasPin",
        "timeZone",
        "username"
      ],
      mutable_fields: [
        "government_identification",
        "government_identification2",
        "gender", 
        "government_identification_type2",
        "government_identification_type",
        "email",
        "cellPhone",
        "birthDate",
        "nationality",
        "language",
        "region",
        "timeZone"
      ],
      searcheable_fields: [
        "surname",
        "name", 
        "email",
        "username",
        "government_identification",
        "cellPhone"
      ]
    },
    additional_properties: {
      visible_fields: [
        "client_uri",
        "onboarding_status", 
        "devices",
        "last_login",
        "registration_source",
        "kyc_level"
      ],
      mutable_fields: [
        "devices",
        "kyc_level"
      ],
      searcheable_fields: [
        "client_uri",
        "onboarding_status",
        "last_login",
        "registration_source"
      ]
    }
  },
  
  // Operators have limited access
  "operador": {
    user: {
      visible_fields: [
        "name",
        "surname", 
        "email",
        "cellPhone",
        "status",
        "username"
      ],
      mutable_fields: [
        "email",
        "cellPhone"
      ],
      searcheable_fields: [
        "surname",
        "name",
        "email", 
        "username"
      ]
    },
    additional_properties: {
      visible_fields: [
        "last_login",
        "onboarding_status"
      ],
      mutable_fields: [],
      searcheable_fields: [
        "onboarding_status"
      ]
    }
  },

  // Analysts have read-only access to more fields
  "analista": {
    user: {
      visible_fields: [
        "government_identification",
        "government_identification_type",
        "surname",
        "name",
        "email",
        "cellPhone",
        "birthDate",
        "status",
        "username"
      ],
      mutable_fields: [],
      searcheable_fields: [
        "surname", 
        "name",
        "email",
        "government_identification",
        "username"
      ]
    },
    additional_properties: {
      visible_fields: [
        "client_uri",
        "onboarding_status",
        "last_login",
        "registration_source"
      ],
      mutable_fields: [],
      searcheable_fields: [
        "client_uri",
        "onboarding_status",
        "registration_source"
      ]
    }
  }
};

export class CompanyUserConfigService {
  async getCompanyUserConfiguration(): Promise<CompanyUserConfiguration> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get token from localStorage to determine user role
    const storedUser = localStorage.getItem("user");
    let userRoles: string[] = [];
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        userRoles = user.roles || [];
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
    
    // Determine configuration based on roles (admin takes precedence)
    if (userRoles.includes("configurador") || userRoles.includes("compensador")) {
      return ROLE_CONFIGURATIONS["admin"];
    } else if (userRoles.includes("analista")) {
      return ROLE_CONFIGURATIONS["analista"];  
    } else if (userRoles.includes("operador")) {
      return ROLE_CONFIGURATIONS["operador"];
    }
    
    // Default to minimal configuration
    return ROLE_CONFIGURATIONS["operador"];
  }
}

export const companyUserConfigService = new CompanyUserConfigService();