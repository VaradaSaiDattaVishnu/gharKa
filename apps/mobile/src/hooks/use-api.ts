import { apiClient, ApiError } from '../lib/api-client';
import type {
  ApiResponse,
  PaginatedResponse,
  UserResponse,
  ListingResponse,
  ListingsQuery,
  OrderResponse,
  MessageResponse,
} from '@gharka/shared';
import type { Conversation } from '@gharka/shared';

// ── Auth ──
export function authApi() {
  return {
    verifyFirebase: (firebaseToken: string) =>
      apiClient<ApiResponse<{ accessToken: string; refreshToken: string; user: UserResponse }>>(
        '/api/auth/verify-firebase',
        { method: 'POST', body: { firebaseToken }, authenticated: false }
      ),

    onboard: (data: { name: string; avatarUrl?: string; role: 'BUYER' | 'SELLER' }) =>
      apiClient<ApiResponse<UserResponse>>('/api/auth/onboard', {
        method: 'POST',
        body: data,
      }),

    logout: (refreshToken: string) =>
      apiClient<ApiResponse<null>>('/api/auth/logout', {
        method: 'POST',
        body: { refreshToken },
      }),
  };
}

// ── Users ──
export function usersApi() {
  return {
    getMe: () => apiClient<ApiResponse<UserResponse>>('/api/users/me'),

    updateMe: (data: { name?: string; avatarUrl?: string }) =>
      apiClient<ApiResponse<UserResponse>>('/api/users/me', {
        method: 'PATCH',
        body: data,
      }),

    updateLocation: (data: { latitude: number; longitude: number; location?: string }) =>
      apiClient<ApiResponse<UserResponse>>('/api/users/me/location', {
        method: 'PATCH',
        body: data,
      }),

    updateRole: (role: 'BUYER' | 'SELLER') =>
      apiClient<ApiResponse<UserResponse>>('/api/users/me/role', {
        method: 'PATCH',
        body: { role },
      }),
  };
}

// ── Listings ──
export function listingsApi() {
  return {
    list: (params: Partial<ListingsQuery> & { lat: number; lng: number }) => {
      const searchParams = new URLSearchParams();
      searchParams.set('lat', String(params.lat));
      searchParams.set('lng', String(params.lng));
      if (params.radius) searchParams.set('radius', String(params.radius));
      if (params.category) searchParams.set('category', params.category);
      if (params.cursor) searchParams.set('cursor', params.cursor);
      if (params.limit) searchParams.set('limit', String(params.limit));
      return apiClient<PaginatedResponse<ListingResponse & { seller?: UserResponse }>>(
        `/api/listings?${searchParams.toString()}`,
        { authenticated: false }
      );
    },

    getById: (id: string) =>
      apiClient<ApiResponse<ListingResponse & { seller?: UserResponse }>>(
        `/api/listings/${id}`,
        { authenticated: false }
      ),

    create: (data: {
      title: string;
      description?: string;
      images: string[];
      price: number;
      quantity: number;
      category: string;
      location: { latitude: number; longitude: number };
      expiresAt?: string;
    }) =>
      apiClient<ApiResponse<ListingResponse>>('/api/listings', {
        method: 'POST',
        body: data,
      }),

    update: (id: string, data: Record<string, unknown>) =>
      apiClient<ApiResponse<ListingResponse>>(`/api/listings/${id}`, {
        method: 'PATCH',
        body: data,
      }),

    remove: (id: string) =>
      apiClient<ApiResponse<null>>(`/api/listings/${id}`, { method: 'DELETE' }),

    toggleActive: (id: string) =>
      apiClient<ApiResponse<ListingResponse>>(`/api/listings/${id}/toggle`, {
        method: 'PATCH',
      }),
  };
}

// ── Orders ──
export function ordersApi() {
  return {
    create: (data: { listingId: string; quantity: number }) =>
      apiClient<ApiResponse<OrderResponse>>('/api/orders', {
        method: 'POST',
        body: data,
      }),

    list: () => apiClient<PaginatedResponse<OrderResponse & { listing?: ListingResponse; buyer?: UserResponse; seller?: UserResponse }>>('/api/orders'),

    getById: (id: string) =>
      apiClient<ApiResponse<OrderResponse & { listing?: ListingResponse; buyer?: UserResponse; seller?: UserResponse }>>(
        `/api/orders/${id}`
      ),

    updateStatus: (id: string, status: string) =>
      apiClient<ApiResponse<OrderResponse>>(`/api/orders/${id}/status`, {
        method: 'PATCH',
        body: { status },
      }),
  };
}

// ── Messages ──
export function messagesApi() {
  return {
    getConversations: () =>
      apiClient<ApiResponse<Conversation[]>>('/api/messages/conversations'),

    getMessages: (orderId: string) =>
      apiClient<PaginatedResponse<MessageResponse>>(`/api/messages/${orderId}`),

    sendMessage: (orderId: string, content: string) =>
      apiClient<ApiResponse<MessageResponse>>(`/api/messages/${orderId}`, {
        method: 'POST',
        body: { content },
      }),

    markAsRead: (orderId: string) =>
      apiClient<ApiResponse<null>>(`/api/messages/${orderId}/read`, {
        method: 'PATCH',
      }),
  };
}

// ── Upload ──
export function uploadApi() {
  return {
    getSignature: (folder?: 'listings' | 'avatars') =>
      apiClient<ApiResponse<{ signature: string; timestamp: number; cloudName: string; apiKey: string; folder: string }>>(
        '/api/upload/signature',
        { method: 'POST', body: { folder } }
      ),
  };
}

// ── Admin ──
export function adminApi() {
  return {
    getStats: () =>
      apiClient<ApiResponse<{ totalUsers: number; totalListings: number; totalOrders: number; activeListings: number }>>(
        '/api/admin/stats'
      ),

    listUsers: () => apiClient<PaginatedResponse<UserResponse>>('/api/admin/users'),

    toggleUserStatus: (id: string) =>
      apiClient<ApiResponse<UserResponse>>(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
      }),

    listListings: () => apiClient<PaginatedResponse<ListingResponse>>('/api/admin/listings'),

    deleteListing: (id: string) =>
      apiClient<ApiResponse<null>>(`/api/admin/listings/${id}`, {
        method: 'DELETE',
      }),
  };
}

export { ApiError };
