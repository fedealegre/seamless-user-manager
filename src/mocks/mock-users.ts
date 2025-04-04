
import { User } from "@/lib/api/types";

// Mock user data for development
export const mockUsers: User[] = [
  {
    id: 827,
    companyId: 1,
    publicId: "user827",
    username: "john.doe",
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    cellPhone: "+1234567890",
    gender: "M",
    governmentIdentification: "ID123456",
    governmentIdentificationType: "SSN",
    birthDate: "1990-01-01",
    nationality: "US",
    hasPin: true,
    timeZone: "America/New_York",
    language: "en",
    region: "US",
    status: "ACTIVE",
    creationDate: "2022-01-01T00:00:00Z",
    modificationDate: "2022-01-01T00:00:00Z",
    address: {
      street: "123 Main St",
      city: "Anytown",
      country: "US",
      zipCode: "12345"
    }
  },
  {
    id: 828,
    companyId: 1,
    publicId: "user828",
    username: "jane.smith",
    name: "Jane",
    surname: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+1987654321",
    cellPhone: "+1987654321",
    gender: "F",
    governmentIdentification: "ID654321",
    governmentIdentificationType: "SSN",
    birthDate: "1992-02-02",
    nationality: "CA",
    hasPin: true,
    timeZone: "America/Toronto",
    language: "en",
    region: "CA",
    status: "ACTIVE",
    creationDate: "2022-01-02T00:00:00Z",
    modificationDate: "2022-01-02T00:00:00Z",
    address: {
      street: "456 Oak St",
      city: "Othertown",
      country: "CA",
      zipCode: "67890"
    }
  },
  {
    id: 829,
    companyId: 1,
    publicId: "user829",
    username: "blocked.user",
    name: "Blocked",
    surname: "User",
    email: "blocked.user@example.com",
    phoneNumber: "+1122334455",
    cellPhone: "+1122334455",
    gender: "Other",
    governmentIdentification: "ID112233",
    governmentIdentificationType: "ID",
    birthDate: "1985-03-03",
    nationality: "MX",
    hasPin: false,
    timeZone: "America/Mexico_City",
    language: "es",
    region: "MX",
    status: "BLOCKED",
    creationDate: "2022-01-03T00:00:00Z",
    modificationDate: "2022-01-03T00:00:00Z"
  }
];
