export enum UserRole {
  BUYER = "BUYER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  phone: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
