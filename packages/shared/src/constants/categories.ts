import { FoodCategory } from "../types/listing.types.js";

export const CATEGORY_DISPLAY_NAMES: Record<FoodCategory, string> = {
  [FoodCategory.RICE_DISHES]: "Rice Dishes",
  [FoodCategory.CURRIES]: "Curries",
  [FoodCategory.BREADS]: "Breads",
  [FoodCategory.SNACKS]: "Snacks",
  [FoodCategory.SWEETS]: "Sweets",
  [FoodCategory.BEVERAGES]: "Beverages",
  [FoodCategory.THALI]: "Thali",
  [FoodCategory.TIFFIN]: "Tiffin",
  [FoodCategory.PICKLES_CHUTNEYS]: "Pickles & Chutneys",
  [FoodCategory.OTHER]: "Other",
};

export const FOOD_CATEGORIES = Object.values(FoodCategory);
