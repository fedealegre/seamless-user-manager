import axios from "axios";
import { CompanyUserConfigResponse } from "../types/company-user-config";

class CompanyUserConfigService {
  private baseURL = "http://localhost:47371/bo/v1";

  async getCompanyUserConfiguration(): Promise<CompanyUserConfigResponse> {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      throw new Error("No authorization token found");
    }

    try {
      const response = await axios.get(`${this.baseURL}/company-user-configuration`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching company user configuration:", error);
      
      // Mock different configurations for testing
      // In a real scenario, this would be determined by the company_id in the JWT token
      const mockConfigs = {
        default: {
          user: {
            visible_fields: [
              "name", "surname", "email", "cellPhone", "government_identification",
              "government_identification_type", "birthDate", "gender", "status"
            ],
            mutable_fields: ["name", "surname", "email", "cellPhone", "birthDate", "gender"],
            searcheable_fields: ["name", "surname", "email", "cellPhone"]
          },
          additional_properties: {
            visible_fields: ["timeZone", "language", "nationality", "additionalInfo"],
            mutable_fields: ["timeZone", "language", "additionalInfo"],
            searcheable_fields: ["timeZone"]
          }
        },
        restrictive: {
          user: {
            visible_fields: ["name", "surname", "email", "status"],
            mutable_fields: ["name", "surname"],
            searcheable_fields: ["name", "surname", "email"]
          },
          additional_properties: {
            visible_fields: ["additionalInfo"],
            mutable_fields: [],
            searcheable_fields: []
          }
        }
      };

      // Use default configuration for now
      return mockConfigs.default;
    }
  }
}

export const companyUserConfigService = new CompanyUserConfigService();