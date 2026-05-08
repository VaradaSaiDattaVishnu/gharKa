import { UserRole } from "../types/user.types.js";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.BUYER]: 0,
  [UserRole.SELLER]: 1,
  [UserRole.ADMIN]: 2,
};

export const PERMISSIONS = {
  CREATE_LISTING: [UserRole.SELLER, UserRole.ADMIN],
  MANAGE_LISTING: [UserRole.SELLER, UserRole.ADMIN],
  PLACE_ORDER: [UserRole.BUYER, UserRole.ADMIN],
  MANAGE_USERS: [UserRole.ADMIN],
  VIEW_STATS: [UserRole.ADMIN],
  DELETE_ANY_LISTING: [UserRole.ADMIN],
} as const;

export type Permission = keyof typeof PERMISSIONS;
