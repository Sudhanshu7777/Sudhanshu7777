/**
 * Geolocation service for handling user location
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeolocationResult {
  coordinates: Coordinates;
  timestamp: number;
}

export class GeolocationService {
  /**
   * Request current position from browser
   */
  static async getCurrentPosition(): Promise<GeolocationResult> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            timestamp: position.timestamp,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('User denied the request for Geolocation'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Location information is unavailable'));
              break;
            case error.TIMEOUT:
              reject(new Error('The request to get user location timed out'));
              break;
            default:
              reject(new Error('An unknown error occurred'));
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  /**
   * Check if geolocation is supported
   */
  static isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Request permission for geolocation (for newer browsers)
   */
  static async requestPermission(): Promise<PermissionState> {
    if (!navigator.permissions) {
      return 'prompt';
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      console.warn('Permission API not supported:', error);
      return 'prompt';
    }
  }

  /**
   * Watch position changes
   */
  static watchPosition(
    callback: (position: GeolocationResult) => void,
    errorCallback?: (error: Error) => void
  ): number {
    if (!navigator.geolocation) {
      if (errorCallback) {
        errorCallback(new Error('Geolocation is not supported by this browser'));
      }
      return -1;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          timestamp: position.timestamp,
        });
      },
      (error) => {
        if (errorCallback) {
          errorCallback(new Error(error.message));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  /**
   * Clear watch position
   */
  static clearWatch(watchId: number): void {
    if (watchId !== -1) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
}
