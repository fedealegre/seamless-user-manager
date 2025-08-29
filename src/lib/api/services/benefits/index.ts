import { BenefitsService } from '../benefits-service';
import { MockBenefitsService } from '../mock-benefits-service';

// Use mock service by default (unless explicitly disabled)
const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Stabilized service export with explicit method delegation
export const CurrentBenefitsService = {
  listBenefits: (...args: Parameters<typeof BenefitsService.listBenefits>) => {
    const service = useMockApi ? MockBenefitsService : BenefitsService;
    return service.listBenefits(...args);
  },
  getBenefit: (...args: Parameters<typeof BenefitsService.getBenefit>) => {
    const service = useMockApi ? MockBenefitsService : BenefitsService;
    return service.getBenefit(...args);
  },
  createBenefit: (...args: Parameters<typeof BenefitsService.createBenefit>) => {
    const service = useMockApi ? MockBenefitsService : BenefitsService;
    return service.createBenefit(...args);
  },
  updateBenefit: (...args: Parameters<typeof BenefitsService.updateBenefit>) => {
    const service = useMockApi ? MockBenefitsService : BenefitsService;
    return service.updateBenefit(...args);
  },
  updateBenefitFields: (...args: Parameters<typeof BenefitsService.updateBenefitFields>) => {
    const service = useMockApi ? MockBenefitsService : BenefitsService;
    return service.updateBenefitFields(...args);
  },
  deleteBenefit: (...args: Parameters<typeof BenefitsService.deleteBenefit>) => {
    const service = useMockApi ? MockBenefitsService : BenefitsService;
    return service.deleteBenefit(...args);
  },
  bulkUploadBenefits: (...args: Parameters<typeof BenefitsService.bulkUploadBenefits>) => {
    const service = useMockApi ? MockBenefitsService : BenefitsService;
    return service.bulkUploadBenefits(...args);
  }
};

// Re-export types for convenience
export type { ListBenefitsParams } from '../mock-benefits-service';