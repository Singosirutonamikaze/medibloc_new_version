export type EpiSource = 'WHO' | 'ECDC' | 'ProMED';

export interface DiseaseHotspot {
  id: string;
  disease: string;
  city: string;
  country: string;
  coordinates: [number, number]; // [lng, lat]
  totalCases: number;
  activeCases: number;
  curedCases: number;
  symptoms: string[];
  description: string;
  lastUpdated: string;
  color: string;
  source: EpiSource;
}

export interface HotspotApiResponse {
  success: true;
  count: number;
  generatedAt: string;
  promedEnabled: boolean;
  sources: { who: string; ecdc: string; promed: string };
  data: DiseaseHotspot[];
}

export interface HotspotsQueryParams {
  disease?: string;
  source?: EpiSource;
  minCases?: number;
}
