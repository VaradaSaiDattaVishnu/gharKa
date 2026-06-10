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
  geocodeAndSet: (query: string) => Promise<void>;
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
                // High accuracy (GPS) is slow and frequently fails on desktops
                // with no GPS chip; network/Wi-Fi positioning is accurate enough
                // for a 5km radius and far more reliable. Generous timeout too.
                enableHighAccuracy: false,
                timeout: 20000,
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
          let message = "Failed to get your location. Please try again.";
          if (err instanceof GeolocationPositionError) {
            if (err.code === 1) {
              message =
                "Location permission was denied. Allow location for this site in your browser, then tap Enable Location again.";
            } else if (err.code === 2) {
              message =
                "Couldn't get a location fix. Make sure location services are turned on for your browser in your device settings, then try again.";
            } else if (err.code === 3) {
              message =
                "Location request timed out. Check your connection and try again.";
            }
          }
          set({ error: message, isLoading: false });
        }
      },

      geocodeAndSet: async (query) => {
        const q = query.trim();
        if (!q) return;
        set({ isLoading: true, error: null });
        try {
          // Free, no-key geocoding via OpenStreetMap Nominatim.
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
              q
            )}`,
            { headers: { Accept: "application/json" } }
          );
          if (!res.ok) throw new Error("geocode request failed");
          const results = (await res.json()) as Array<{
            lat: string;
            lon: string;
            display_name: string;
          }>;
          if (results.length === 0) {
            set({
              error:
                "Couldn't find that place. Try a more specific area, city, or pincode.",
              isLoading: false,
            });
            return;
          }
          const { lat, lon, display_name } = results[0];
          set({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            address: display_name,
            hasPermission: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({
            error:
              "Couldn't look up that location. Check your connection and try again.",
            isLoading: false,
          });
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
