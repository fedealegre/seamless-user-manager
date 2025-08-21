import { CategoriesService } from '../categories-service';
import { MockCategoriesService } from '../mock-categories-service';

// Use mock service by default (unless explicitly disabled)
const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Export the appropriate service based on environment
export const CurrentCategoriesService = useMockApi ? MockCategoriesService : CategoriesService;