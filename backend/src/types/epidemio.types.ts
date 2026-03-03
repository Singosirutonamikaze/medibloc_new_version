// ============================================
// TYPES ÉPI-SURVEILLANCE
// ============================================

export type EpiSource = 'WHO' | 'ECDC' | 'ProMED';

/**
 * Format de sortie unique pour chaque point chaud épidémique.
 * Respecte l'interface DiseaseHotspot du frontend DashboardWorld.
 */
export interface DiseaseHotspot {
  id: string;                        // ex: "who-tgo-paludisme"
  disease: string;                   // Nom FR, ex: "Paludisme"
  city: string;                      // Capitale du pays
  country: string;                   // Nom pays FR
  coordinates: [number, number];     // [longitude, latitude]
  totalCases: number;
  activeCases: number;               // Math.round(totalCases * tauxActif)
  curedCases: number;                // totalCases - activeCases
  symptoms: string[];
  description: string;
  lastUpdated: string;               // ISO 8601
  color: string;                     // Couleur hex
  source: EpiSource;
}

// ---- Réponses API ----

export interface HotspotApiResponse {
  success: true;
  count: number;
  generatedAt: string;
  promedEnabled: boolean;
  sources: {
    who: string;
    ecdc: string;
    promed: string;
  };
  data: DiseaseHotspot[];
}

export interface HotspotsQueryParams {
  disease?: string;
  source?: EpiSource;
  minCases?: string;
}

// ---- Données intermédiaires entre services et agregateur ----

export interface RawHotspot {
  isoAlpha3: string;
  diseaseFR: string;
  totalCases: number;
  lastUpdated: string;
  source: EpiSource;
  /** Coordonnées optionnelles fournies par ProMED */
  coordinates?: [number, number];
}
