import { BenefitsService } from '../benefits-service';
import { MockBenefitsService } from '../mock-benefits-service';

// Use mock service by default (unless explicitly disabled)
const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Export the appropriate service based on environment
export const CurrentBenefitsService = useMockApi ? MockBenefitsService : BenefitsService;

// Re-export types for convenience
export type { ListBenefitsParams } from '../mock-benefits-service';