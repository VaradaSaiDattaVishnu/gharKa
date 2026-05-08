import { useCallback } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../store/location-store';

export function useLocation() {
  const store = useLocationStore();

  const requestPermission = useCallback(async (): Promise<boolean> => {
    store.setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      store.setPermissionStatus(granted ? 'granted' : 'denied');
      return granted;
    } catch {
      store.setPermissionStatus('denied');
      return false;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const getCurrentLocation = useCallback(async (): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    store.setLoading(true);
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        store.setPermissionStatus('denied');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      store.setCoordinates(latitude, longitude);

      // Reverse geocode for display name
      try {
        const [geocode] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode) {
          const parts = [geocode.name, geocode.district, geocode.city].filter(Boolean);
          store.setAddress(parts.join(', '));
        }
      } catch {
        // Geocoding is optional
      }

      return { latitude, longitude };
    } catch {
      return null;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  return {
    ...store,
    requestPermission,
    getCurrentLocation,
  };
}
