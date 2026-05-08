import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  timestamp,
  json,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["BUYER", "SELLER", "ADMIN"]);
export const foodCategoryEnum = pgEnum("food_category", [
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
export const orderStatusEnum = pgEnum("order_status", [
  "PLACED",
  "CONFIRMED",
  "READY",
  "PICKED_UP",
  "COMPLETED",
  "CANCELLED",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: varchar("phone", { length: 20 }).notNull(),
    name: varchar("name", { length: 100 }),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").notNull().default("BUYER"),
    location: text("location"),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    phoneIdx: uniqueIndex("users_phone_idx").on(table.phone),
    roleIdx: index("users_role_idx").on(table.role),
  })
);

export const foodListings = pgTable(
  "food_listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 100 }).notNull(),
    description: text("description"),
    images: json("images").$type<string[]>().notNull().default([]),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    availableQuantity: integer("available_quantity").notNull(),
    category: foodCategoryEnum("category").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
    longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => ({
    sellerIdx: index("listings_seller_idx").on(table.sellerId),
    categoryIdx: index("listings_category_idx").on(table.category),
    activeIdx: index("listings_active_idx").on(table.isActive),
    locationIdx: index("listings_location_idx").on(table.latitude, table.longitude),
  })
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    buyerId: uuid("buyer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => foodListings.id, { onDelete: "cascade" }),
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    status: orderStatusEnum("status").notNull().default("PLACED"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    buyerIdx: index("orders_buyer_idx").on(table.buyerId),
    sellerIdx: index("orders_seller_idx").on(table.sellerId),
    listingIdx: index("orders_listing_idx").on(table.listingId),
    statusIdx: index("orders_status_idx").on(table.status),
  })
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    orderIdx: index("messages_order_idx").on(table.orderId),
    senderIdx: index("messages_sender_idx").on(table.senderId),
    receiverIdx: index("messages_receiver_idx").on(table.receiverId),
  })
);

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("refresh_tokens_user_idx").on(table.userId),
    tokenHashIdx: index("refresh_tokens_hash_idx").on(table.tokenHash),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  listings: many(foodListings),
  buyerOrders: many(orders, { relationName: "buyerOrders" }),
  sellerOrders: many(orders, { relationName: "sellerOrders" }),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  refreshTokens: many(refreshTokens),
}));

export const foodListingsRelations = relations(foodListings, ({ one, many }) => ({
  seller: one(users, {
    fields: [foodListings.sellerId],
    references: [users.id],
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id],
    relationName: "buyerOrders",
  }),
  seller: one(users, {
    fields: [orders.sellerId],
    references: [users.id],
    relationName: "sellerOrders",
  }),
  listing: one(foodListings, {
    fields: [orders.listingId],
    references: [foodListings.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
  order: one(orders, {
    fields: [messages.orderId],
    references: [orders.id],
  }),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));
