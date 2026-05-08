export enum OrderStatus {
  PLACED = "PLACED",
  CONFIRMED = "CONFIRMED",
  READY = "READY",
  PICKED_UP = "PICKED_UP",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Order {
  id: string;
  buyerId: string;
  listingId: string;
  sellerId: string;
  quantity: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
