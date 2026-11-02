export interface BirdSighting {
  bird: string;
  location: string;
  year: number;
  month?: number;
  day?: number;
  spotter?: string;
  notes?: string;
}

export interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

export interface BirdSummary {
  name: string;
  slug: string;
  sightingCount: number;
  locations: string[];
  yearFirst: number;
  yearLast: number;
  sightings: BirdSighting[];
}
