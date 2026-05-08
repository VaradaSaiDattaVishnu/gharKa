import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  permissionStatus: 'undetermined' | 'granted' | 'denied';
  isLoading: boolean;

  setCoordinates: (lat: number, lng: number) => void;
  setAddress: (address: string | null) => void;
  setPermissionStatus: (status: 'undetermined' | 'granted' | 'denied') => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  address: null,
  permissionStatus: 'undetermined',
  isLoading: false,

  setCoordinates: (latitude, longitude) => set({ latitude, longitude }),
  setAddress: (address) => set({ address }),
  setPermissionStatus: (permissionStatus) => set({ permissionStatus }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({
      latitude: null,
      longitude: null,
      address: null,
      permissionStatus: 'undetermined',
      isLoading: false,
    }),
}));
