import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GeolocationService, Coordinates } from '../services/geolocation';

interface GeolocationContextType {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => Promise<void>;
  isSupported: boolean;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

interface GeolocationProviderProps {
  children: ReactNode;
}

export const GeolocationProvider: React.FC<GeolocationProviderProps> = ({ children }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSupported = GeolocationService.isSupported();

  const requestLocation = async (): Promise<void> => {
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
  };

  // Optionally request location on mount
  useEffect(() => {
    // You might want to auto-request location on app start
    // For now, we'll leave it manual
  }, []);

  const value: GeolocationContextType = {
    coordinates,
    error,
    isLoading,
    requestLocation,
    isSupported,
  };

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
};

export const useGeolocationContext = (): GeolocationContextType => {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('useGeolocationContext must be used within a GeolocationProvider');
  }
  return context;
};
