export interface Location {
  locationId: number;
  locationName: string;
  locationZone?: string | null;
}

export interface LocationRequest {
  locationName: string;
  locationZone?: string;
}
