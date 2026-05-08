export enum FoodCategory {
  RICE_DISHES = "RICE_DISHES",
  CURRIES = "CURRIES",
  BREADS = "BREADS",
  SNACKS = "SNACKS",
  SWEETS = "SWEETS",
  BEVERAGES = "BEVERAGES",
  THALI = "THALI",
  TIFFIN = "TIFFIN",
  PICKLES_CHUTNEYS = "PICKLES_CHUTNEYS",
  OTHER = "OTHER",
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string | null;
  images: string[];
  price: number;
  quantity: number;
  availableQuantity: number;
  category: FoodCategory;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
}
