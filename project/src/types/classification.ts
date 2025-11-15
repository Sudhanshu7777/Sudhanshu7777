/**
 * Classification types for EcoSort Assist
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface AlternativeClassification {
  type: string;
  confidence: number;
}

export interface EnvironmentalImpact {
  co2Saved: number;
  recyclable: boolean;
  biodegradable: boolean;
}

export interface ClassificationResponse {
  id: string;
  wasteType: string;
  category: 'recyclable' | 'organic' | 'hazardous' | 'general' | 'electronic';
  confidence: number;
  disposalInstructions: string[];
  environmentalImpact: EnvironmentalImpact;
  processingTime: number;
  timestamp: number;
  location?: Coordinates;
  alternatives?: AlternativeClassification[];
}

export interface ClassificationRequest {
  image: string; // Base64 encoded image
  location?: Coordinates;
}
