"use client";

import { useEffect } from "react";
import { useLocationStore } from "@/store/location-store";

export function useLocation() {
  const store = useLocationStore();

  useEffect(() => {
    if (!store.hasPermission && !store.isLoading && !store.error) {
      // Don't auto-request -- let UI prompt user
    }
  }, [store.hasPermission, store.isLoading, store.error]);

  return {
    latitude: store.latitude,
    longitude: store.longitude,
    address: store.address,
    hasPermission: store.hasPermission,
    isLoading: store.isLoading,
    error: store.error,
    requestLocation: store.requestLocation,
    setLocation: store.setLocation,
  };
}
