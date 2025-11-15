import { useState, useEffect, useCallback } from 'react';
import { GeolocationService, Coordinates, GeolocationResult } from '../services/geolocation';

interface UseGeolocationReturn {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => Promise<void>;
  watchLocation: () => void;
  stopWatching: () => void;
  isSupported: boolean;
}

/**
 * Hook for managing geolocation
 */
export const useGeolocation = (): UseGeolocationReturn => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [watchId, setWatchId] = useState<number>(-1);

  const isSupported = GeolocationService.isSupported();

  const requestLocation = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await GeolocationService.getCurrentPosition();
      setCoordinates(result.coordinates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const watchLocation = useCallback((): void => {
    if (!isSupported) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    // Stop existing watch if any
    if (watchId !== -1) {
      GeolocationService.clearWatch(watchId);
    }

    const newWatchId = GeolocationService.watchPosition(
      (result) => {
        setCoordinates(result.coordinates);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );

    setWatchId(newWatchId);
  }, [isSupported, watchId]);

  const stopWatching = useCallback((): void => {
    if (watchId !== -1) {
      GeolocationService.clearWatch(watchId);
      setWatchId(-1);
    }
  }, [watchId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== -1) {
        GeolocationService.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    coordinates,
    error,
    isLoading,
    requestLocation,
    watchLocation,
    stopWatching,
    isSupported,
  };
};
