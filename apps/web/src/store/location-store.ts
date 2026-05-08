import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  setLocation: (lat: number, lng: number, address?: string) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      latitude: null,
      longitude: null,
      address: null,
      hasPermission: false,
      isLoading: false,
      error: null,

      requestLocation: async () => {
        if (!navigator.geolocation) {
          set({ error: "Geolocation is not supported by your browser" });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
              });
            }
          );

          set({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            hasPermission: true,
            isLoading: false,
          });
        } catch (err) {
          const message =
            err instanceof GeolocationPositionError
              ? err.code === 1
                ? "Location permission denied"
                : "Unable to detect your location"
              : "Failed to get location";
          set({ error: message, isLoading: false });
        }
      },

      setLocation: (lat, lng, address) =>
        set({
          latitude: lat,
          longitude: lng,
          address: address || null,
          hasPermission: true,
        }),

      clearLocation: () =>
        set({
          latitude: null,
          longitude: null,
          address: null,
          hasPermission: false,
        }),
    }),
    {
      name: "gharka-location",
      partialize: (state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        address: state.address,
        hasPermission: state.hasPermission,
      }),
    }
  )
);
