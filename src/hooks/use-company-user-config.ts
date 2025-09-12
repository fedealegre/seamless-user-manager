import { useState, useEffect, useCallback } from "react";
import { CompanyUserConfiguration } from "@/lib/api/types/company-user-config";
import { companyConfigService } from "@/lib/api/services/mock-company-config-service";
import { getGlobalCompanyId } from "@/lib/api/http-client";

export function useCompanyUserConfig() {
  const [config, setConfig] = useState<CompanyUserConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const companyId = getGlobalCompanyId();
      if (!companyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const companyConfig = await companyConfigService.getCompanyUserConfiguration(companyId);
        setConfig(companyConfig);
        setError(null);
      } catch (err) {
        console.error("Failed to load company user configuration:", err);
        setError(err instanceof Error ? err.message : "Failed to load configuration");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const isFieldVisible = useCallback((fieldName: string): boolean => {
    if (!config) return false;
    return config.user.visible_fields.includes(fieldName) || 
           config.additional_properties.visible_fields.includes(fieldName);
  }, [config]);

  const isFieldEditable = useCallback((fieldName: string): boolean => {
    if (!config) return false;
    return config.user.mutable_fields.includes(fieldName) || 
           config.additional_properties.mutable_fields.includes(fieldName);
  }, [config]);

  const isFieldSearchable = useCallback((fieldName: string): boolean => {
    if (!config) return false;
    return config.user.searcheable_fields.includes(fieldName) || 
           config.additional_properties.searcheable_fields.includes(fieldName);
  }, [config]);

  return {
    config,
    loading,
    error,
    isFieldVisible,
    isFieldEditable,
    isFieldSearchable,
  };
}