import { z } from "zod";

const foodCategoryEnum = z.enum([
  "RICE_DISHES",
  "CURRIES",
  "BREADS",
  "SNACKS",
  "SWEETS",
  "BEVERAGES",
  "THALI",
  "TIFFIN",
  "PICKLES_CHUTNEYS",
  "OTHER",
]);

export const createListingSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  images: z.array(z.string().url()).min(1).max(5),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  category: foodCategoryEnum,
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  expiresAt: z.string().datetime().optional(),
});

export const updateListingSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  images: z.array(z.string().url()).min(1).max(5).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().positive().optional(),
  category: foodCategoryEnum.optional(),
  expiresAt: z.string().datetime().optional(),
});

export const listingResponseSchema = z.object({
  id: z.string().uuid(),
  sellerId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  images: z.array(z.string()),
  price: z.number(),
  quantity: z.number(),
  availableQuantity: z.number(),
  category: foodCategoryEnum,
  latitude: z.number(),
  longitude: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string().nullable(),
  distance: z.number().optional(),
});

export const listingsQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().default(5000),
  category: foodCategoryEnum.optional(),
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingResponse = z.infer<typeof listingResponseSchema>;
export type ListingsQuery = z.infer<typeof listingsQuerySchema>;
