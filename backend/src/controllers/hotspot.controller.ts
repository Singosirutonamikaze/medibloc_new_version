import { Request, Response } from "express";
import axios from "axios";
import NodeCache from "node-cache";
import {
  DiseaseHotspot,
  RawHotspot,
  HotspotsQueryParams,
  EpiSource,
  HotspotApiResponse,
} from "../types/epidemio.types";

// ============================================================
// DONNÉES GEO — ISO-3 → { countryFR, city, coordinates }
// ============================================================

interface GeoInfo {
  countryFR: string;
  city: string;
  coordinates: [number, number];
}

const GEO_MAP: Record<string, GeoInfo> = {
  // Afrique de l'Ouest
  TGO: { countryFR: "Togo", city: "Lomé", coordinates: [1.21, 6.14] },
  CIV: {
    countryFR: "Côte d'Ivoire",
    city: "Abidjan",
    coordinates: [-4.01, 5.35],
  },
  SEN: { countryFR: "Sénégal", city: "Dakar", coordinates: [-17.44, 14.69] },
  GHA: { countryFR: "Ghana", city: "Accra", coordinates: [-0.19, 5.55] },
  NGA: { countryFR: "Nigeria", city: "Abuja", coordinates: [7.49, 9.05] },
  MLI: { countryFR: "Mali", city: "Bamako", coordinates: [-7.98, 12.65] },
  BFA: {
    countryFR: "Burkina Faso",
    city: "Ouagadougou",
    coordinates: [-1.52, 12.36],
  },
  GIN: { countryFR: "Guinée", city: "Conakry", coordinates: [-13.57, 9.54] },
  NER: { countryFR: "Niger", city: "Niamey", coordinates: [2.11, 13.51] },
  // Afrique Centrale
  CMR: { countryFR: "Cameroun", city: "Yaoundé", coordinates: [11.51, 3.84] },
  COD: { countryFR: "RD Congo", city: "Kinshasa", coordinates: [15.31, -4.32] },
  COG: { countryFR: "Congo", city: "Brazzaville", coordinates: [15.28, -4.26] },
  AGO: { countryFR: "Angola", city: "Luanda", coordinates: [13.23, -8.83] },
  // Afrique de l'Est
  ETH: {
    countryFR: "Éthiopie",
    city: "Addis-Abeba",
    coordinates: [38.74, 8.99],
  },
  KEN: { countryFR: "Kenya", city: "Nairobi", coordinates: [36.82, -1.28] },
  SDN: { countryFR: "Soudan", city: "Khartoum", coordinates: [32.53, 15.55] },
  TZA: { countryFR: "Tanzanie", city: "Dodoma", coordinates: [35.74, -6.17] },
  UGA: { countryFR: "Ouganda", city: "Kampala", coordinates: [32.58, 0.32] },
  SOM: { countryFR: "Somalie", city: "Mogadiscio", coordinates: [45.34, 2.05] },
  SSD: { countryFR: "Soudan du Sud", city: "Juba", coordinates: [31.58, 4.85] },
  // Afrique Australe
  ZAF: {
    countryFR: "Afrique du Sud",
    city: "Pretoria",
    coordinates: [28.19, -25.74],
  },
  MOZ: {
    countryFR: "Mozambique",
    city: "Maputo",
    coordinates: [32.59, -25.96],
  },
  MDG: {
    countryFR: "Madagascar",
    city: "Antananarivo",
    coordinates: [47.53, -18.91],
  },
  ZWE: { countryFR: "Zimbabwe", city: "Harare", coordinates: [31.05, -17.82] },
  // Afrique du Nord
  EGY: { countryFR: "Égypte", city: "Le Caire", coordinates: [31.24, 30.06] },
  MAR: { countryFR: "Maroc", city: "Rabat", coordinates: [-6.85, 34.01] },
  TUN: { countryFR: "Tunisie", city: "Tunis", coordinates: [10.18, 36.82] },
  DZA: { countryFR: "Algérie", city: "Alger", coordinates: [3.04, 36.74] },
  // Moyen-Orient
  IRQ: { countryFR: "Irak", city: "Bagdad", coordinates: [44.44, 33.34] },
  IRN: { countryFR: "Iran", city: "Téhéran", coordinates: [51.38, 35.69] },
  YEM: { countryFR: "Yémen", city: "Sanaa", coordinates: [44.2, 15.35] },
  SYR: { countryFR: "Syrie", city: "Damas", coordinates: [36.29, 33.51] },
  // Asie du Sud
  AFG: {
    countryFR: "Afghanistan",
    city: "Kaboul",
    coordinates: [69.17, 34.52],
  },
  IND: { countryFR: "Inde", city: "New Delhi", coordinates: [77.21, 28.64] },
  BGD: { countryFR: "Bangladesh", city: "Dhaka", coordinates: [90.41, 23.71] },
  PAK: {
    countryFR: "Pakistan",
    city: "Islamabad",
    coordinates: [73.04, 33.72],
  },
  // Asie du Sud-Est
  THA: {
    countryFR: "Thaïlande",
    city: "Bangkok",
    coordinates: [100.52, 13.75],
  },
  VNM: { countryFR: "Vietnam", city: "Hanoï", coordinates: [105.85, 21.03] },
  PHL: {
    countryFR: "Philippines",
    city: "Manille",
    coordinates: [120.97, 14.59],
  },
  IDN: {
    countryFR: "Indonésie",
    city: "Jakarta",
    coordinates: [106.84, -6.21],
  },
  MMR: { countryFR: "Myanmar", city: "Naypyidaw", coordinates: [96.19, 16.85] },
  // Asie de l'Est
  CHN: { countryFR: "Chine", city: "Pékin", coordinates: [116.4, 39.9] },
  JPN: { countryFR: "Japon", city: "Tokyo", coordinates: [139.69, 35.69] },
  KOR: {
    countryFR: "Corée du Sud",
    city: "Séoul",
    coordinates: [126.98, 37.57],
  },
  PNG: {
    countryFR: "Papouasie-NG",
    city: "Port Moresby",
    coordinates: [147.19, -9.44],
  },
  // Europe
  FRA: { countryFR: "France", city: "Paris", coordinates: [2.35, 48.85] },
  DEU: { countryFR: "Allemagne", city: "Berlin", coordinates: [13.4, 52.52] },
  ITA: { countryFR: "Italie", city: "Rome", coordinates: [12.49, 41.9] },
  ESP: { countryFR: "Espagne", city: "Madrid", coordinates: [-3.7, 40.42] },
  GBR: {
    countryFR: "Royaume-Uni",
    city: "Londres",
    coordinates: [-0.13, 51.51],
  },
  POL: { countryFR: "Pologne", city: "Varsovie", coordinates: [21.01, 52.23] },
  ROU: { countryFR: "Roumanie", city: "Bucarest", coordinates: [26.1, 44.44] },
  UKR: { countryFR: "Ukraine", city: "Kyiv", coordinates: [30.52, 50.45] },
  RUS: { countryFR: "Russie", city: "Moscou", coordinates: [37.62, 55.75] },
  TUR: { countryFR: "Turquie", city: "Ankara", coordinates: [32.86, 39.93] },
  AUT: { countryFR: "Autriche", city: "Vienne", coordinates: [16.37, 48.21] },
  BEL: { countryFR: "Belgique", city: "Bruxelles", coordinates: [4.35, 50.85] },
  BGR: { countryFR: "Bulgarie", city: "Sofia", coordinates: [23.32, 42.7] },
  HRV: { countryFR: "Croatie", city: "Zagreb", coordinates: [15.98, 45.81] },
  CYP: { countryFR: "Chypre", city: "Nicosie", coordinates: [33.37, 35.17] },
  CZE: { countryFR: "Tchéquie", city: "Prague", coordinates: [14.42, 50.09] },
  DNK: {
    countryFR: "Danemark",
    city: "Copenhague",
    coordinates: [12.57, 55.68],
  },
  EST: { countryFR: "Estonie", city: "Tallinn", coordinates: [24.75, 59.44] },
  FIN: { countryFR: "Finlande", city: "Helsinki", coordinates: [24.94, 60.17] },
  GRC: { countryFR: "Grèce", city: "Athènes", coordinates: [23.73, 37.98] },
  HUN: { countryFR: "Hongrie", city: "Budapest", coordinates: [19.04, 47.5] },
  IRL: { countryFR: "Irlande", city: "Dublin", coordinates: [-6.27, 53.33] },
  LVA: { countryFR: "Lettonie", city: "Riga", coordinates: [24.11, 56.95] },
  LTU: { countryFR: "Lituanie", city: "Vilnius", coordinates: [25.28, 54.69] },
  LUX: {
    countryFR: "Luxembourg",
    city: "Luxembourg",
    coordinates: [6.13, 49.61],
  },
  MLT: { countryFR: "Malte", city: "La Valette", coordinates: [14.51, 35.9] },
  NLD: { countryFR: "Pays-Bas", city: "Amsterdam", coordinates: [4.9, 52.37] },
  SVK: {
    countryFR: "Slovaquie",
    city: "Bratislava",
    coordinates: [17.11, 48.15],
  },
  SVN: {
    countryFR: "Slovénie",
    city: "Ljubljana",
    coordinates: [14.51, 46.05],
  },
  SWE: { countryFR: "Suède", city: "Stockholm", coordinates: [18.07, 59.33] },
  ISL: {
    countryFR: "Islande",
    city: "Reykjavik",
    coordinates: [-21.82, 64.13],
  },
  LIE: {
    countryFR: "Liechtenstein",
    city: "Vaduz",
    coordinates: [9.52, 47.14],
  },
  NOR: { countryFR: "Norvège", city: "Oslo", coordinates: [10.74, 59.91] },
  // Amériques
  USA: {
    countryFR: "États-Unis",
    city: "Washington DC",
    coordinates: [-77.04, 38.9],
  },
  MEX: { countryFR: "Mexique", city: "Mexico", coordinates: [-99.13, 19.43] },
  BRA: { countryFR: "Brésil", city: "Brasilia", coordinates: [-47.93, -15.78] },
  COL: { countryFR: "Colombie", city: "Bogotá", coordinates: [-74.07, 4.71] },
  HTI: {
    countryFR: "Haïti",
    city: "Port-au-Prince",
    coordinates: [-72.34, 18.54],
  },
  PER: { countryFR: "Pérou", city: "Lima", coordinates: [-77.04, -12.05] },
  ARG: {
    countryFR: "Argentine",
    city: "Buenos Aires",
    coordinates: [-58.38, -34.6],
  },
  VEN: { countryFR: "Venezuela", city: "Caracas", coordinates: [-66.9, 10.48] },
};

/** Mapping nom de pays anglais (lowercase) → ISO-3 */
const COUNTRY_NAME_TO_ISO3: Record<string, string> = {
  togo: "TGO",
  ghana: "GHA",
  nigeria: "NGA",
  mali: "MLI",
  "burkina faso": "BFA",
  "cote d'ivoire": "CIV",
  "ivory coast": "CIV",
  senegal: "SEN",
  guinea: "GIN",
  niger: "NER",
  cameroon: "CMR",
  cameroun: "CMR",
  "democratic republic of the congo": "COD",
  "dr congo": "COD",
  congo: "COG",
  angola: "AGO",
  ethiopia: "ETH",
  kenya: "KEN",
  sudan: "SDN",
  tanzania: "TZA",
  uganda: "UGA",
  somalia: "SOM",
  "south sudan": "SSD",
  "south africa": "ZAF",
  mozambique: "MOZ",
  madagascar: "MDG",
  zimbabwe: "ZWE",
  egypt: "EGY",
  morocco: "MAR",
  tunisia: "TUN",
  algeria: "DZA",
  iraq: "IRQ",
  iran: "IRN",
  yemen: "YEM",
  syria: "SYR",
  afghanistan: "AFG",
  india: "IND",
  bangladesh: "BGD",
  pakistan: "PAK",
  thailand: "THA",
  vietnam: "VNM",
  philippines: "PHL",
  indonesia: "IDN",
  myanmar: "MMR",
  china: "CHN",
  japan: "JPN",
  "south korea": "KOR",
  "papua new guinea": "PNG",
  france: "FRA",
  germany: "DEU",
  italy: "ITA",
  spain: "ESP",
  "united kingdom": "GBR",
  uk: "GBR",
  poland: "POL",
  romania: "ROU",
  ukraine: "UKR",
  russia: "RUS",
  turkey: "TUR",
  "united states": "USA",
  "united states of america": "USA",
  usa: "USA",
  mexico: "MEX",
  brazil: "BRA",
  colombia: "COL",
  haiti: "HTI",
  peru: "PER",
  argentina: "ARG",
  venezuela: "VEN",
};

/** Mapping alpha-2 EU → ISO-3 (pour ECDC) */
const ECDC_ALPHA2_TO_ISO3: Record<string, string> = {
  AT: "AUT",
  BE: "BEL",
  BG: "BGR",
  HR: "HRV",
  CY: "CYP",
  CZ: "CZE",
  DK: "DNK",
  EE: "EST",
  FI: "FIN",
  FR: "FRA",
  DE: "DEU",
  GR: "GRC",
  HU: "HUN",
  IE: "IRL",
  IT: "ITA",
  LV: "LVA",
  LT: "LTU",
  LU: "LUX",
  MT: "MLT",
  NL: "NLD",
  PL: "POL",
  PT: "PRT",
  RO: "ROU",
  SK: "SVK",
  SI: "SVN",
  ES: "ESP",
  SE: "SWE",
  IS: "ISL",
  LI: "LIE",
  NO: "NOR",
};

// ============================================================
// DONNÉES MALADIES — taux actif, symptômes, couleur, WHO codes
// ============================================================

interface DiseaseInfo {
  activeRate: number;
  symptoms: string[];
  color: string;
  description: string;
  whoIndicators: string[];
}

const DISEASE_INFO: Record<string, DiseaseInfo> = {
  Paludisme: {
    activeRate: 0.4,
    symptoms: ["Fièvre", "Frissons", "Maux de tête", "Vomissements", "Anémie"],
    color: "#e74c3c",
    description:
      "Maladie parasitaire transmise par les moustiques Anophèles, majoritairement en zone tropicale.",
    whoIndicators: ["MALARIA_EST_CASES", "MALARIA_CONF_CASES"],
  },
  Tuberculose: {
    activeRate: 0.38,
    symptoms: [
      "Toux persistante",
      "Fièvre nocturne",
      "Perte de poids",
      "Hémoptysie",
      "Fatigue",
    ],
    color: "#e67e22",
    description:
      "Infection bactérienne pulmonaire chronique causée par Mycobacterium tuberculosis.",
    whoIndicators: ["TB_e_inc_num"],
  },
  Rougeole: {
    activeRate: 0.3,
    symptoms: [
      "Éruption cutanée",
      "Fièvre élevée",
      "Toux",
      "Conjonctivite",
      "Rhinorrhée",
    ],
    color: "#9b59b6",
    description:
      "Maladie virale très contagieuse caractérisée par une éruption maculopapuleuse généralisée.",
    whoIndicators: ["WHS3_62"],
  },
  Dengue: {
    activeRate: 0.35,
    symptoms: [
      "Fièvre brutale",
      "Douleurs articulaires",
      "Céphalées",
      "Éruption",
      "Thrombocytopénie",
    ],
    color: "#f39c12",
    description:
      "Arbovirose transmise par Aedes aegypti, responsable d'épidémies dans les régions tropicales.",
    whoIndicators: [], // WHO GHO ne publie pas les cas dengue — source: ECDC/ProMED uniquement
  },
  Choléra: {
    activeRate: 0.33,
    symptoms: [
      "Diarrhée aqueuse",
      "Vomissements",
      "Déshydratation sévère",
      "Crampes musculaires",
    ],
    color: "#1abc9c",
    description:
      "Infection intestinale aiguë causée par Vibrio cholerae, liée à l'eau contaminée.",
    whoIndicators: ["WHS3_47", "CHOLERA_0000000001"],
  },
  Méningite: {
    activeRate: 0.42,
    symptoms: [
      "Raideur de la nuque",
      "Fièvre",
      "Photophobie",
      "Céphalées sévères",
      "Purpura",
    ],
    color: "#c0392b",
    description:
      "Inflammation des méninges d'origine bactérienne ou virale, urgence médicale absolue.",
    whoIndicators: [],
  },
  Mpox: {
    activeRate: 0.45,
    symptoms: [
      "Éruption vésiculaire",
      "Fièvre",
      "Ganglions enflés",
      "Douleurs musculaires",
      "Fatigue",
    ],
    color: "#8e44ad",
    description:
      "Maladie virale émergente causée par le virus Monkeypox, zoonose d'origine africaine.",
    whoIndicators: [],
  },
  Grippe: {
    activeRate: 0.25,
    symptoms: ["Fièvre", "Toux sèche", "Myalgies", "Céphalées", "Asthénie"],
    color: "#3498db",
    description:
      "Infection respiratoire virale saisonnière causée par les virus Influenza A et B.",
    whoIndicators: [],
  },
  Covid19: {
    activeRate: 0.28,
    symptoms: ["Toux", "Fièvre", "Dyspnée", "Perte d'odorat", "Asthénie"],
    color: "#2980b9",
    description:
      "Maladie respiratoire causée par le SARS-CoV-2, responsable de la pandémie mondiale de 2020.",
    whoIndicators: [],
  },
  Typhoïde: {
    activeRate: 0.32,
    symptoms: [
      "Fièvre en plateau",
      "Douleurs abdominales",
      "Céphalées",
      "Roséoles",
      "Splénomégalie",
    ],
    color: "#d35400",
    description:
      "Fièvre entérique causée par Salmonella typhi, liée à l'eau et aux aliments contaminés.",
    whoIndicators: [],
  },
};

/** Mapping nom maladie anglais (lowercase) → FR */
const DISEASE_EN_TO_FR: Record<string, string> = {
  malaria: "Paludisme",
  tuberculosis: "Tuberculose",
  measles: "Rougeole",
  dengue: "Dengue",
  cholera: "Choléra",
  meningitis: "Méningite",
  mpox: "Mpox",
  monkeypox: "Mpox",
  influenza: "Grippe",
  flu: "Grippe",
  "covid-19": "Covid19",
  covid19: "Covid19",
  typhoid: "Typhoïde",
};

// ============================================================
// CACHES
// ============================================================
const whoCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const ecdcCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const promedCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
const aggregatorCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// ============================================================
// UTILITAIRES
// ============================================================

function computeCases(
  diseaseFR: string,
  totalCases: number,
): { activeCases: number; curedCases: number } {
  const rate = DISEASE_INFO[diseaseFR]?.activeRate ?? 0.35;
  const activeCases = Math.round(totalCases * rate);
  return { activeCases, curedCases: totalCases - activeCases };
}

function toHotspot(raw: RawHotspot): DiseaseHotspot | null {
  const geo = GEO_MAP[raw.isoAlpha3];
  if (!geo) return null;

  const info = DISEASE_INFO[raw.diseaseFR];
  const { activeCases, curedCases } = computeCases(
    raw.diseaseFR,
    raw.totalCases,
  );
  const coordinates: [number, number] = raw.coordinates ?? geo.coordinates;
  const id = `${raw.source.toLowerCase()}-${raw.isoAlpha3.toLowerCase()}-${raw.diseaseFR.toLowerCase().replaceAll(/\s+/gu, "-")}`;

  return {
    id,
    disease: raw.diseaseFR,
    city: geo.city,
    country: geo.countryFR,
    coordinates,
    totalCases: raw.totalCases,
    activeCases,
    curedCases,
    symptoms: info?.symptoms ?? ["À préciser"],
    description:
      info?.description ??
      `Surveillance ${raw.diseaseFR} — source ${raw.source}.`,
    lastUpdated: raw.lastUpdated,
    color: info?.color ?? "#95a5a6",
    source: raw.source,
  };
}

// ============================================================
// SOURCE 1 — WHO GHO
// ============================================================

const WHO_BASE = "https://ghoapi.azureedge.net/api/";
const WHO_TIMEOUT = 8_000;
const WHO_YEARS = [2023, 2022, 2021, 2020, 2019];

const WHO_DISEASES = Object.entries(DISEASE_INFO)
  .filter(([, info]) => info.whoIndicators.length > 0)
  .map(([diseaseFR, info]) => ({ diseaseFR, indicators: info.whoIndicators }));

interface GhoRecord {
  SpatialDim: string;
  TimeDim: number;
  NumericValue: number | null;
}

async function fetchWHOIndicatorYear(
  indicator: string,
  year: number,
): Promise<GhoRecord[]> {
  const response = await axios.get<{ value: GhoRecord[] }>(
    `${WHO_BASE}${indicator}`,
    {
      params: {
        $filter: `TimeDim eq ${year} and SpatialDimType eq 'COUNTRY'`,
        $select: "SpatialDim,TimeDim,NumericValue",
        $top: 300,
      },
      timeout: WHO_TIMEOUT,
    },
  );
  return (response.data?.value ?? []).filter(
    (r) => r.NumericValue != null && r.NumericValue > 0,
  );
}

async function findWHORecords(indicators: string[]): Promise<GhoRecord[]> {
  const attempts = indicators.flatMap((indicator) =>
    WHO_YEARS.map((year) =>
      fetchWHOIndicatorYear(indicator, year).then(
        (data) => (data.length > 0 ? data : Promise.reject(new Error("empty"))),
        (err: Error) => {
          console.warn(`[WHO] Échec ${indicator} ${year}:`, err.message);
          throw err;
        },
      ),
    ),
  );
  return Promise.any(attempts).catch(() => []);
}

async function fetchWHO(): Promise<RawHotspot[]> {
  const cacheKey = "who_all";
  const cached = whoCache.get<RawHotspot[]>(cacheKey);
  if (cached) return cached;

  const now = new Date().toISOString();

  // Toutes les maladies WHO en parallèle (au lieu d'un for-await séquentiel)
  const perDisease = await Promise.all(
    WHO_DISEASES.map(async ({ diseaseFR, indicators }) => {
      const records = await findWHORecords(indicators);
      return records.map<RawHotspot>((record) => ({
        isoAlpha3: record.SpatialDim,
        diseaseFR,
        totalCases: Math.round(record.NumericValue!),
        lastUpdated: now,
        source: "WHO",
      }));
    }),
  );

  const results = perDisease.flat();
  whoCache.set(cacheKey, results);
  console.log(`[WHO] ${results.length} entrées chargées`);
  return results;
}

// ============================================================
// SOURCE 2 — ECDC Open Data
// ============================================================

const ECDC_TIMEOUT = 15_000;

const ECDC_DATASETS: Array<{
  diseaseFR: string;
  url: string;
  codeCol: string[];
  casesCol: string[];
  weekCol: string[];
}> = [
    // Covid19 — seule source ECDC active (URL stable)
    {
      diseaseFR: "Covid19",
      url: "https://opendata.ecdc.europa.eu/covid19/nationalcasedeath_eueea_daily_ei/csv/data.csv",
      codeCol: ["countryCode", "GeoId", "country_code"],
      casesCol: ["cases", "NewConfCases", "NumberOfCases"],
      weekCol: ["week", "year_week", "ReportingYear"],
    },
    // Grippe (Influenza) — URL à valider sur opendata.ecdc.europa.eu avant de réactiver
    // { diseaseFR: "Grippe", url: "https://opendata.ecdc.europa.eu/influenza/...", ... }
    // Rougeole — Couverte par WHO (WHS3_62), ECDC désactivé jusqu'à URL confirmée
    // { diseaseFR: "Rougeole", url: "https://opendata.ecdc.europa.eu/measles/...", ... }
  ];

function findColIndex(headers: string[], candidates: string[]): number {
  for (const candidate of candidates) {
    const idx = headers.findIndex(
      (h) => h.toLowerCase().trim() === candidate.toLowerCase(),
    );
    if (idx !== -1) return idx;
  }
  return -1;
}

function parseEcdcCsv(
  csv: string,
  diseaseFR: string,
  cfg: (typeof ECDC_DATASETS)[0],
): RawHotspot[] {
  const lines = csv
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((h) => h.replaceAll(/['"]/gu, "").trim());
  const codeIdx = findColIndex(headers, cfg.codeCol);
  const casesIdx = findColIndex(headers, cfg.casesCol);
  const weekIdx = findColIndex(headers, cfg.weekCol);

  if (codeIdx === -1 || casesIdx === -1) {
    console.warn(
      `[ECDC] Colonnes introuvables pour ${diseaseFR}. Headers:`,
      headers,
    );
    return [];
  }

  const latestByCountry = new Map<string, { week: string; cases: number }>();
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i]
      .split(",")
      .map((c) => c.replaceAll(/['"]/gu, "").trim());
    const alpha2 = cols[codeIdx]?.toUpperCase();
    const cases = Number.parseInt(cols[casesIdx] ?? "0", 10);
    const week = weekIdx === -1 ? "" : (cols[weekIdx] ?? "");
    if (!alpha2 || Number.isNaN(cases) || cases <= 0) continue;
    const existing = latestByCountry.get(alpha2);
    if (!existing || week > existing.week)
      latestByCountry.set(alpha2, { week, cases });
  }

  const now = new Date().toISOString();
  const hotspots: RawHotspot[] = [];
  for (const [alpha2, { cases }] of latestByCountry) {
    const iso3 = ECDC_ALPHA2_TO_ISO3[alpha2];
    if (!iso3) continue;
    hotspots.push({
      isoAlpha3: iso3,
      diseaseFR,
      totalCases: cases,
      lastUpdated: now,
      source: "ECDC",
    });
  }
  return hotspots;
}

async function fetchECDC(): Promise<RawHotspot[]> {
  const cacheKey = "ecdc_all";
  const cached = ecdcCache.get<RawHotspot[]>(cacheKey);
  if (cached) return cached;

  // Tous les datasets ECDC en parallèle
  const settled = await Promise.allSettled(
    ECDC_DATASETS.map((dataset) =>
      axios
        .get<string>(dataset.url, { timeout: ECDC_TIMEOUT, responseType: "text" })
        .then((response) => ({
          diseaseFR: dataset.diseaseFR,
          hotspots: parseEcdcCsv(response.data, dataset.diseaseFR, dataset),
        })),
    ),
  );

  const results = settled.flatMap((res, i) => {
    if (res.status === "rejected") {
      console.error(`[ECDC] Échec ${ECDC_DATASETS[i].diseaseFR}:`, (res.reason as Error).message);
      return [] as RawHotspot[];
    }
    console.log(`[ECDC] ${res.value.diseaseFR}: ${res.value.hotspots.length} entrées`);
    return res.value.hotspots;
  });

  ecdcCache.set(cacheKey, results);
  console.log(`[ECDC] Total ${results.length} entrées chargées`);
  return results;
}

// ============================================================
// SOURCE 3 — ProMED
// ============================================================

const PROMED_URL = "https://www.promedmail.org/api/v1/search";
const PROMED_TIMEOUT = 10_000;
const PROMED_QUERIES = [
  "malaria",
  "dengue",
  "cholera",
  "measles",
  "mpox",
  "influenza",
  "covid-19",
];
const CASE_PATTERNS = [
  /(\d[\d\s,]+)\s*(?:confirmed\s+)?cases?/i,
  /(\d[\d\s,]+)\s*cas\b/i,
  /total[^\d]+(\d[\d\s,]+)/i,
];

function extractCases(text: string): number {
  const match = CASE_PATTERNS.map((p) => p.exec(text)).find(Boolean);
  if (!match) return 5;
  const n = Number.parseInt(match[1].replaceAll(/[\s,]/gu, ""), 10);
  return Number.isNaN(n) || n <= 0 ? 5 : n;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

interface PromedAlert {
  unique_string: string;
  date: string;
  subject: string;
  text: string;
  diseases?: Array<{ name: string }>;
  places?: Array<{
    country?: string;
    lon?: string;
    lat?: string;
    location?: { locality?: string; country?: string };
  }>;
}

async function searchPromedDisease(
  query: string,
  apiKey: string,
): Promise<PromedAlert[]> {
  const response = await axios.post<{ data: { alerts: PromedAlert[] } }>(
    PROMED_URL,
    {
      q: query,
      field: "full_text",
      diseases: [query],
      startDate: daysAgo(7),
      endDate: daysAgo(0),
      network: "ProMED-all",
      page: 1,
      perPage: 20,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: PROMED_TIMEOUT,
    },
  );
  return response.data?.data?.alerts ?? [];
}

function resolveDiseaseFR(alert: PromedAlert): string | undefined {
  const diseaseNames = (alert.diseases ?? []).map((d) => d.name.toLowerCase());
  const fromDisease = diseaseNames
    .map((n) => DISEASE_EN_TO_FR[n])
    .find(Boolean);
  if (fromDisease) return fromDisease;

  const sub = alert.subject.toLowerCase();
  return Object.entries(DISEASE_EN_TO_FR).find(([key]) =>
    sub.includes(key),
  )?.[1];
}

function alertToRaw(alert: PromedAlert): RawHotspot | null {
  const diseaseFR = resolveDiseaseFR(alert);
  const place = alert.places?.[0];
  const countryRaw = (place?.country ?? place?.location?.country ?? "")
    .toLowerCase()
    .trim();
  const isoAlpha3 = COUNTRY_NAME_TO_ISO3[countryRaw];

  if (!diseaseFR || !place || !isoAlpha3) return null;

  const lon = Number.parseFloat(place.lon ?? "");
  const lat = Number.parseFloat(place.lat ?? "");
  const coordinates: [number, number] =
    !Number.isNaN(lon) && !Number.isNaN(lat)
      ? [lon, lat]
      : GEO_MAP[isoAlpha3]?.coordinates;

  return {
    isoAlpha3,
    diseaseFR,
    totalCases: extractCases(alert.text ?? ""),
    lastUpdated: alert.date
      ? new Date(alert.date).toISOString()
      : new Date().toISOString(),
    source: "ProMED",
    coordinates,
  };
}

async function fetchProMED(): Promise<RawHotspot[]> {
  const apiKey = process.env.PROMED_API_KEY;
  if (!apiKey) {
    console.warn("[ProMED] PROMED_API_KEY absent — source désactivée");
    return [];
  }

  const cacheKey = "promed_all";
  const cached = promedCache.get<RawHotspot[]>(cacheKey);
  if (cached) return cached;

  const settled = await Promise.allSettled(
    PROMED_QUERIES.map((q) => searchPromedDisease(q, apiKey)),
  );

  const allAlerts = settled.flatMap((res, i) => {
    if (res.status === "rejected") {
      console.error(
        `[ProMED] Échec "${PROMED_QUERIES[i]}":`,
        res.reason?.message,
      );
      return [] as PromedAlert[];
    }
    console.log(`[ProMED] ${PROMED_QUERIES[i]}: ${res.value.length} alertes`);
    return res.value;
  });

  const uniqueAlerts = [
    ...new Map(allAlerts.map((a) => [a.unique_string, a])).values(),
  ];
  const hotspots = uniqueAlerts.flatMap((alert) => {
    const raw = alertToRaw(alert);
    return raw ? [raw] : [];
  });

  promedCache.set(cacheKey, hotspots);
  console.log(`[ProMED] Total ${hotspots.length} hotspots extraits`);
  return hotspots;
}

// ============================================================
// AGRÉGATEUR
// ============================================================

const SOURCE_PRIORITY: Record<string, number> = { WHO: 1, ECDC: 2, ProMED: 3 };

async function aggregateAll(): Promise<DiseaseHotspot[]> {
  const cacheKey = "aggregated_all";
  const cached = aggregatorCache.get<DiseaseHotspot[]>(cacheKey);
  if (cached) return cached;

  const [whoRaw, ecdcRaw, promedRaw] = await Promise.all([
    fetchWHO().catch((err) => {
      console.error("[AGG] WHO failed:", err.message);
      return [] as RawHotspot[];
    }),
    fetchECDC().catch((err) => {
      console.error("[AGG] ECDC failed:", err.message);
      return [] as RawHotspot[];
    }),
    fetchProMED().catch((err) => {
      console.error("[AGG] ProMED failed:", err.message);
      return [] as RawHotspot[];
    }),
  ]);

  const bestByKey = [...whoRaw, ...ecdcRaw, ...promedRaw].reduce<
    Map<string, RawHotspot>
  >((acc, raw) => {
    const key = `${raw.isoAlpha3}-${raw.diseaseFR}`;
    const prev = acc.get(key);
    if (!prev || SOURCE_PRIORITY[raw.source] > SOURCE_PRIORITY[prev.source])
      acc.set(key, raw);
    return acc;
  }, new Map());

  const hotspots = [...bestByKey.values()]
    .map(toHotspot)
    .filter((h): h is DiseaseHotspot => h !== null)
    .sort((a, b) => b.totalCases - a.totalCases);

  aggregatorCache.set(cacheKey, hotspots);
  console.log(`[AGG] ${hotspots.length} hotspots agrégés`);
  return hotspots;
}

// ============================================================
// CONTROLLER
// ============================================================

const VALID_SOURCES = new Set<EpiSource>(["WHO", "ECDC", "ProMED"]);

/**
 * @openapi
 * components:
 *   schemas:
 *     DiseaseHotspot:
 *       type: object
 *       properties:
 *         id:          { type: string }
 *         disease:     { type: string }
 *         city:        { type: string }
 *         country:     { type: string }
 *         coordinates: { type: array, items: { type: number } }
 *         totalCases:  { type: integer }
 *         activeCases: { type: integer }
 *         curedCases:  { type: integer }
 *         symptoms:    { type: array, items: { type: string } }
 *         description: { type: string }
 *         lastUpdated: { type: string }
 *         color:       { type: string }
 *         source:      { type: string, enum: [WHO, ECDC, ProMED] }
 */
export class HotspotController {
  /**
   * GET /api/v1/hotspots
   * Query params optionnels : disease, source, minCases
   */
  public getHotspots = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const { disease, source, minCases } = req.query as HotspotsQueryParams;
      const minCasesNum = minCases ? Number.parseInt(minCases, 10) : Number.NaN;

      const hotspots = (await aggregateAll()).filter(
        (h) =>
          (!disease ||
            h.disease.toLowerCase().includes(disease.toLowerCase())) &&
          (!source || (VALID_SOURCES.has(source) && h.source === source)) &&
          (Number.isNaN(minCasesNum) || h.totalCases >= minCasesNum),
      );

      const promedEnabled = Boolean(process.env.PROMED_API_KEY);

      const body: HotspotApiResponse = {
        success: true,
        count: hotspots.length,
        generatedAt: new Date().toISOString(),
        promedEnabled,
        sources: {
          who: "WHO GHO API (annuel) — https://ghoapi.azureedge.net/api/",
          ecdc: "ECDC Open Data (hebdomadaire) — https://opendata.ecdc.europa.eu/",
          promed: promedEnabled
            ? "ProMED API (7 derniers jours) — https://www.promedmail.org/"
            : "ProMED désactivé (PROMED_API_KEY manquant)",
        },
        data: hotspots,
      };

      return res.status(200).json(body);
    } catch (err) {
      console.error("[HotspotController] getHotspots error:", err);
      return res
        .status(500)
        .json({
          success: false,
          error: "Erreur lors de la récupération des hotspots",
        });
    }
  };

  /**
   * GET /api/v1/hotspots/diseases
   */
  public getDiseases = async (
    _req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const hotspots = await aggregateAll();
      const diseases = [...new Set(hotspots.map((h) => h.disease))].sort(
        (a, b) => a.localeCompare(b),
      );
      return res.status(200).json({ success: true, data: diseases });
    } catch (err) {
      console.error("[HotspotController] getDiseases error:", err);
      return res
        .status(500)
        .json({
          success: false,
          error: "Erreur lors de la récupération des maladies",
        });
    }
  };

  /**
   * GET /api/v1/hotspots/health
   */
  public getHealth = (_req: Request, res: Response): Response => {
    const stats = aggregatorCache.getStats();
    return res.status(200).json({
      status: "ok",
      uptime: Math.round(process.uptime()),
      promedEnabled: Boolean(process.env.PROMED_API_KEY),
      cache: { keys: stats.keys, hits: stats.hits, misses: stats.misses },
    });
  };
}
