
import { useState } from "react";
import { BackofficeUser } from "@/lib/api/types";

const initialMockUsers: BackofficeUser[] = [
  {
    id: "1",
    name: "Juan",
    surname: "Pérez",
    email: "juan.perez@empresa.com",
    roles: ["configurador", "operador"],
    state: "active",
    lastLogin: new Date("2024-01-15T10:30:00Z"),
  },
  {
    id: "2",
    name: "María",
    surname: "González",
    email: "maria.gonzalez@empresa.com",
    roles: ["compensador"],
    state: "active",
    lastLogin: new Date("2024-01-14T14:22:00Z"),
  },
  {
    id: "3",
    name: "Carlos",
    surname: "Rodriguez",
    email: "carlos.rodriguez@empresa.com",
    roles: ["analista"],
    state: "blocked",
    lastLogin: new Date("2024-01-10T09:15:00Z"),
  },
  {
    id: "4",
    name: "Ana",
    surname: "Martínez",
    email: "ana.martinez@empresa.com",
    roles: ["operador", "analista"],
    state: "active",
    lastLogin: new Date("2024-01-16T16:45:00Z"),
  },
  {
    id: "5",
    name: "Loyalty",
    surname: "User",
    email: "loyalty@empresa.com",
    roles: ["loyalty"],
    state: "active",
    lastLogin: new Date("2024-01-16T12:00:00Z"),
  },
];

export function useMockBackofficeUsers() {
  const [users, setUsers] = useState<BackofficeUser[]>(initialMockUsers);

  return {
    users,
    setUsers,
  };
}
