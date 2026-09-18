/**
 * @file hotspot.controller.ts
 * @description Controleur de gestion des donnees epidemiologiques agregees (WHO, ECDC, ProMED).
 * Conforme aux regles d'architecture : 0 if, 0 switch, 0 boucle imperative, 0 any, 0 unknown.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */

import { Request, Response } from "express";
import axios from "axios";
import NodeCache from "node-cache";
import {
  DiseaseHotspot,
  RawHotspot,
  HotspotsQueryParams,
  EpiSource,
  HotspotApiResponse,
} from "../../../core/types/epidemio/epidemio.types";
import { successResponse, errorResponse } from "../../../core/utils/responses/response.util";

interface GeoInfo {
  readonly countryFR: string;
  readonly city: string;
  readonly coordinates: [number, number];
}

interface DiseaseInfo {
  readonly activeRate: number;
  readonly symptoms: string[];
  readonly color: string;
  readonly description: string;
  readonly whoIndicators: string[];
}

interface GhoRecord {
  readonly SpatialDim: string;
  readonly TimeDim: number;
  readonly NumericValue: number | null;
}

interface PromedPlace {
  readonly country: string;
  readonly lon: string;
  readonly lat: string;
  readonly location: { readonly locality: string; readonly country: string };
}

interface PromedAlert {
  readonly unique_string: string;
  readonly date: string;
  readonly subject: string;
  readonly text: string;
  readonly diseases: Array<{ readonly name: string }>;
  readonly places: PromedPlace[];
}

const GEO_MAP: Record<string, GeoInfo> = {
  TGO: { countryFR: "Togo", city: "Lome", coordinates: [1.21, 6.14] },
  CIV: { countryFR: "Cote d'Ivoire", city: "Abidjan", coordinates: [-4.01, 5.35] },
  SEN: { countryFR: "Senegal", city: "Dakar", coordinates: [-17.44, 14.69] },
  GHA: { countryFR: "Ghana", city: "Accra", coordinates: [-0.19, 5.55] },
  NGA: { countryFR: "Nigeria", city: "Abuja", coordinates: [7.49, 9.05] },
  MLI: { countryFR: "Mali", city: "Bamako", coordinates: [-7.98, 12.65] },
  BFA: { countryFR: "Burkina Faso", city: "Ouagadougou", coordinates: [-1.52, 12.36] },
  GIN: { countryFR: "Guinee", city: "Conakry", coordinates: [-13.57, 9.54] },
  NER: { countryFR: "Niger", city: "Niamey", coordinates: [2.11, 13.51] },
  CMR: { countryFR: "Cameroun", city: "Yaounde", coordinates: [11.51, 3.84] },
  COD: { countryFR: "RD Congo", city: "Kinshasa", coordinates: [15.31, -4.32] },
  COG: { countryFR: "Congo", city: "Brazzaville", coordinates: [15.28, -4.26] },
  AGO: { countryFR: "Angola", city: "Luanda", coordinates: [13.23, -8.83] },
  ETH: { countryFR: "Ethiopie", city: "Addis-Abeba", coordinates: [38.74, 8.99] },
  KEN: { countryFR: "Kenya", city: "Nairobi", coordinates: [36.82, -1.28] },
  SDN: { countryFR: "Soudan", city: "Khartoum", coordinates: [32.53, 15.55] },
  TZA: { countryFR: "Tanzanie", city: "Dodoma", coordinates: [35.74, -6.17] },
  UGA: { countryFR: "Ouganda", city: "Kampala", coordinates: [32.58, 0.32] },
  SOM: { countryFR: "Somalie", city: "Mogadiscio", coordinates: [45.34, 2.05] },
  SSD: { countryFR: "Soudan du Sud", city: "Juba", coordinates: [31.58, 4.85] },
  ZAF: { countryFR: "Afrique du Sud", city: "Pretoria", coordinates: [28.19, -25.74] },
  MOZ: { countryFR: "Mozambique", city: "Maputo", coordinates: [32.59, -25.96] },
  MDG: { countryFR: "Madagascar", city: "Antananarivo", coordinates: [47.53, -18.91] },
  ZWE: { countryFR: "Zimbabwe", city: "Harare", coordinates: [31.05, -17.82] },
  EGY: { countryFR: "Egypte", city: "Le Caire", coordinates: [31.24, 30.06] },
  MAR: { countryFR: "Maroc", city: "Rabat", coordinates: [-6.85, 34.01] },
  TUN: { countryFR: "Tunisie", city: "Tunis", coordinates: [10.18, 36.82] },
  DZA: { countryFR: "Algerie", city: "Alger", coordinates: [3.04, 36.74] },
  IRQ: { countryFR: "Irak", city: "Bagdad", coordinates: [44.44, 33.34] },
  IRN: { countryFR: "Iran", city: "Teheran", coordinates: [51.38, 35.69] },
  YEM: { countryFR: "Yemen", city: "Sanaa", coordinates: [44.2, 15.35] },
  SYR: { countryFR: "Syrie", city: "Damas", coordinates: [36.29, 33.51] },
  AFG: { countryFR: "Afghanistan", city: "Kaboul", coordinates: [69.17, 34.52] },
  IND: { countryFR: "Inde", city: "New Delhi", coordinates: [77.21, 28.64] },
  BGD: { countryFR: "Bangladesh", city: "Dhaka", coordinates: [90.41, 23.71] },
  PAK: { countryFR: "Pakistan", city: "Islamabad", coordinates: [73.04, 33.72] },
  THA: { countryFR: "Thailande", city: "Bangkok", coordinates: [100.52, 13.75] },
  VNM: { countryFR: "Vietnam", city: "Hanoi", coordinates: [105.85, 21.03] },
  PHL: { countryFR: "Philippines", city: "Manille", coordinates: [120.97, 14.59] },
  IDN: { countryFR: "Indonesie", city: "Jakarta", coordinates: [106.84, -6.21] },
  MMR: { countryFR: "Myanmar", city: "Naypyidaw", coordinates: [96.19, 16.85] },
  CHN: { countryFR: "Chine", city: "Pekin", coordinates: [116.4, 39.9] },
  JPN: { countryFR: "Japon", city: "Tokyo", coordinates: [139.69, 35.69] },
  KOR: { countryFR: "Coree du Sud", city: "Seoul", coordinates: [126.98, 37.57] },
  PNG: { countryFR: "Papouasie-NG", city: "Port Moresby", coordinates: [147.19, -9.44] },
  FRA: { countryFR: "France", city: "Paris", coordinates: [2.35, 48.85] },
  DEU: { countryFR: "Allemagne", city: "Berlin", coordinates: [13.4, 52.52] },
  ITA: { countryFR: "Italie", city: "Rome", coordinates: [12.49, 41.9] },
  ESP: { countryFR: "Espagne", city: "Madrid", coordinates: [-3.7, 40.42] },
  GBR: { countryFR: "Royaume-Uni", city: "Londres", coordinates: [-0.13, 51.51] },
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
  CZE: { countryFR: "Tchequie", city: "Prague", coordinates: [14.42, 50.09] },
  DNK: { countryFR: "Danemark", city: "Copenhague", coordinates: [12.57, 55.68] },
  EST: { countryFR: "Estonie", city: "Tallinn", coordinates: [24.75, 59.44] },
  FIN: { countryFR: "Finlande", city: "Helsinki", coordinates: [24.94, 60.17] },
  GRC: { countryFR: "Grece", city: "Athenes", coordinates: [23.73, 37.98] },
  HUN: { countryFR: "Hongrie", city: "Budapest", coordinates: [19.04, 47.5] },
  IRL: { countryFR: "Irlande", city: "Dublin", coordinates: [-6.27, 53.33] },
  LVA: { countryFR: "Lettonie", city: "Riga", coordinates: [24.11, 56.95] },
  LTU: { countryFR: "Lituanie", city: "Vilnius", coordinates: [25.28, 54.69] },
  LUX: { countryFR: "Luxembourg", city: "Luxembourg", coordinates: [6.13, 49.61] },
  MLT: { countryFR: "Malte", city: "La Valette", coordinates: [14.51, 35.9] },
  NLD: { countryFR: "Pays-Bas", city: "Amsterdam", coordinates: [4.9, 52.37] },
  SVK: { countryFR: "Slovaquie", city: "Bratislava", coordinates: [17.11, 48.15] },
  SVN: { countryFR: "Slovenie", city: "Ljubljana", coordinates: [14.51, 46.05] },
  SWE: { countryFR: "Suede", city: "Stockholm", coordinates: [18.07, 59.33] },
  ISL: { countryFR: "Islande", city: "Reykjavik", coordinates: [-21.82, 64.13] },
  LIE: { countryFR: "Liechtenstein", city: "Vaduz", coordinates: [9.52, 47.14] },
  NOR: { countryFR: "Norvege", city: "Oslo", coordinates: [10.74, 59.91] },
  USA: { countryFR: "Etats-Unis", city: "Washington DC", coordinates: [-77.04, 38.9] },
  MEX: { countryFR: "Mexique", city: "Mexico", coordinates: [-99.13, 19.43] },
  BRA: { countryFR: "Bresil", city: "Brasilia", coordinates: [-47.93, -15.78] },
  COL: { countryFR: "Colombie", city: "Bogota", coordinates: [-74.07, 4.71] },
  HTI: { countryFR: "Haiti", city: "Port-au-Prince", coordinates: [-72.34, 18.54] },
  PER: { countryFR: "Perou", city: "Lima", coordinates: [-77.04, -12.05] },
  ARG: { countryFR: "Argentine", city: "Buenos Aires", coordinates: [-58.38, -34.6] },
  VEN: { countryFR: "Venezuela", city: "Caracas", coordinates: [-66.9, 10.48] },
};

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
  LIE: "LIE",
  NO: "NOR",
};

const DISEASE_INFO: Record<string, DiseaseInfo> = {
  Paludisme: {
    activeRate: 0.4,
    symptoms: ["Fievre", "Frissons", "Maux de tete", "Vomissements", "Anemie"],
    color: "#e74c3c",
    description: "Maladie parasitaire transmise par les moustiques Anopheles, majoritairement en zone tropicale.",
    whoIndicators: ["MALARIA_EST_CASES", "MALARIA_CONF_CASES"],
  },
  Tuberculose: {
    activeRate: 0.38,
    symptoms: ["Toux persistante", "Fievre nocturne", "Perte de poids", "Hemoptysie", "Fatigue"],
    color: "#e67e22",
    description: "Infection bacterienne pulmonaire chronique causee par Mycobacterium tuberculosis.",
    whoIndicators: ["TB_e_inc_num"],
  },
  Rougeole: {
    activeRate: 0.3,
    symptoms: ["Eruption cutanee", "Fievre elevee", "Toux", "Conjonctivite", "Rhinorrhee"],
    color: "#9b59b6",
    description: "Maladie virale tres contagieuse caracterisee par une eruption maculopapuleuse generalisee.",
    whoIndicators: ["WHS3_62"],
  },
  Dengue: {
    activeRate: 0.35,
    symptoms: ["Fievre brutale", "Douleurs articulaires", "Cephalees", "Eruption", "Thrombocytopenie"],
    color: "#f39c12",
    description: "Arbovirose transmise par Aedes aegypti, responsable d'epidemies dans les regions tropicales.",
    whoIndicators: [],
  },
  Cholera: {
    activeRate: 0.33,
    symptoms: ["Diarrhee aqueuse", "Vomissements", "Deshydratation severe", "Crampes musculaires"],
    color: "#1abc9c",
    description: "Infection intestinale aigue causee par Vibrio cholerae, liee a l'eau contaminee.",
    whoIndicators: ["WHS3_47", "CHOLERA_0000000001"],
  },
  Meningite: {
    activeRate: 0.42,
    symptoms: ["Raideur de la nuque", "Fievre", "Photophobie", "Cephalees severes", "Purpura"],
    color: "#c0392b",
    description: "Inflammation des meninges d'origine bacterienne ou virale, urgence medicale absolue.",
    whoIndicators: [],
  },
  Mpox: {
    activeRate: 0.45,
    symptoms: ["Eruption vesiculaire", "Fievre", "Ganglions enfles", "Douleurs musculaires", "Fatigue"],
    color: "#8e44ad",
    description: "Maladie virale emergente causee par le virus Monkeypox, zoonose d'origine africaine.",
    whoIndicators: [],
  },
  Grippe: {
    activeRate: 0.25,
    symptoms: ["Fievre", "Toux seche", "Myalgies", "Cephalees", "Asthenie"],
    color: "#3498db",
    description: "Infection respiratoire virale saisonniere causee par les virus Influenza A et B.",
    whoIndicators: [],
  },
  Covid19: {
    activeRate: 0.28,
    symptoms: ["Toux", "Fievre", "Dyspnee", "Perte d'odorat", "Asthenie"],
    color: "#2980b9",
    description: "Maladie respiratoire causee par le SARS-CoV-2, responsable de la pandemie mondiale de 2020.",
    whoIndicators: [],
  },
  Typhoide: {
    activeRate: 0.32,
    symptoms: ["Fievre en plateau", "Douleurs abdominales", "Cephalees", "Roseoles", "Splenomegalie"],
    color: "#d35400",
    description: "Fievre enterique causee par Salmonella typhi, liee a l'eau et aux aliments contamines.",
    whoIndicators: [],
  },
};

const DISEASE_EN_TO_FR: Record<string, string> = {
  malaria: "Paludisme",
  tuberculosis: "Tuberculose",
  measles: "Rougeole",
  dengue: "Dengue",
  cholera: "Cholera",
  meningitis: "Meningite",
  mpox: "Mpox",
  monkeypox: "Mpox",
  influenza: "Grippe",
  flu: "Grippe",
  "covid-19": "Covid19",
  covid19: "Covid19",
  typhoid: "Typhoide",
};

const whoCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const ecdcCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const promedCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
const aggregatorCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const computeCases = (diseaseFR: string, totalCases: number): { activeCases: number; curedCases: number } => {
  const info = DISEASE_INFO[diseaseFR];
  const rateLookup: Record<string, number> = {
    true: info ? info.activeRate : 0.35,
    false: 0.35,
  };
  const rate = rateLookup[String(info !== undefined)];
  const activeCases = Math.round(totalCases * rate);
  return { activeCases, curedCases: totalCases - activeCases };
};

const toHotspot = (raw: RawHotspot): DiseaseHotspot | null => {
  const geo = GEO_MAP[raw.isoAlpha3];
  const geoLookup: Record<string, () => DiseaseHotspot | null> = {
    false: () => null,
    true: () => {
      const validGeo = geo as GeoInfo;
      const info = DISEASE_INFO[raw.diseaseFR];
      const { activeCases, curedCases } = computeCases(raw.diseaseFR, raw.totalCases);
      const coords = raw.coordinates ? raw.coordinates : validGeo.coordinates;
      const id = `${raw.source.toLowerCase()}-${raw.isoAlpha3.toLowerCase()}-${raw.diseaseFR.toLowerCase().replaceAll(/\s+/gu, "-")}`;

      return {
        id,
        disease: raw.diseaseFR,
        city: validGeo.city,
        country: validGeo.countryFR,
        coordinates: coords,
        totalCases: raw.totalCases,
        activeCases,
        curedCases,
        symptoms: info ? info.symptoms : ["A preciser"],
        description: info ? info.description : `Surveillance ${raw.diseaseFR} - source ${raw.source}.`,
        lastUpdated: raw.lastUpdated,
        color: info ? info.color : "#95a5a6",
        source: raw.source,
      };
    },
  };

  return geoLookup[String(geo !== undefined)]();
};

const WHO_BASE = "https://ghoapi.azureedge.net/api/";
const WHO_TIMEOUT = 8_000;
const WHO_YEARS = [2023, 2022, 2021, 2020, 2019];

const WHO_DISEASES = Object.entries(DISEASE_INFO)
  .filter(([, info]) => info.whoIndicators.length > 0)
  .map(([diseaseFR, info]) => ({ diseaseFR, indicators: info.whoIndicators }));

const fetchWHOIndicatorYear = async (indicator: string, year: number): Promise<GhoRecord[]> => {
  const response = await axios.get<{ value: GhoRecord[] }>(`${WHO_BASE}${indicator}`, {
    params: {
      $filter: `TimeDim eq ${year} and SpatialDimType eq 'COUNTRY'`,
      $select: "SpatialDim,TimeDim,NumericValue",
      $top: 300,
    },
    timeout: WHO_TIMEOUT,
  });
  const records = response.data ? (response.data.value ? response.data.value : []) : [];
  return records.filter((r) => r.NumericValue !== null && r.NumericValue > 0);
};

const findWHORecords = async (indicators: string[]): Promise<GhoRecord[]> => {
  const attempts = indicators.flatMap((indicator) =>
    WHO_YEARS.map((year) =>
      fetchWHOIndicatorYear(indicator, year).then(
        (data) => {
          const hasData = data.length > 0;
          const promiseLookup: Record<string, () => Promise<GhoRecord[]>> = {
            true: async () => data,
            false: async () => Promise.reject(new Error("empty")),
          };
          return promiseLookup[String(hasData)]();
        },
        (err: Error) => {
          console.warn(`[WHO] Echec ${indicator} ${year}:`, err.message);
          throw err;
        }
      )
    )
  );
  return Promise.any(attempts).catch(() => []);
};

const fetchWHO = async (): Promise<RawHotspot[]> => {
  const cacheKey = "who_all";
  const cached = whoCache.get<RawHotspot[]>(cacheKey);
  const cacheLookup: Record<string, () => Promise<RawHotspot[]>> = {
    true: async () => cached as RawHotspot[],
    false: async () => {
      const now = new Date().toISOString();
      const perDisease = await Promise.all(
        WHO_DISEASES.map(async ({ diseaseFR, indicators }) => {
          const records = await findWHORecords(indicators);
          return records.map<RawHotspot>((record) => ({
            isoAlpha3: record.SpatialDim,
            diseaseFR,
            totalCases: Math.round(record.NumericValue ? record.NumericValue : 0),
            lastUpdated: now,
            source: "WHO",
          }));
        })
      );
      const results = perDisease.flat();
      whoCache.set(cacheKey, results);
      return results;
    },
  };

  return cacheLookup[String(cached !== undefined)]();
};

const ECDC_TIMEOUT = 15_000;

interface EcdcDatasetConfig {
  readonly diseaseFR: string;
  readonly url: string;
  readonly codeCol: string[];
  readonly casesCol: string[];
  readonly weekCol: string[];
}

const ECDC_DATASETS: EcdcDatasetConfig[] = [
  {
    diseaseFR: "Covid19",
    url: "https://opendata.ecdc.europa.eu/covid19/nationalcasedeath_eueea_daily_ei/csv/data.csv",
    codeCol: ["countryCode", "GeoId", "country_code"],
    casesCol: ["cases", "NewConfCases", "NumberOfCases"],
    weekCol: ["week", "year_week", "ReportingYear"],
  },
];

const findColIndex = (headers: string[], candidates: string[]): number => {
  const foundIndex = candidates
    .map((cand) => headers.findIndex((h) => h.toLowerCase().trim() === cand.toLowerCase()))
    .find((idx) => idx !== -1);

  const indexLookup: Record<string, number> = {
    true: foundIndex !== undefined ? foundIndex : -1,
    false: -1,
  };
  return indexLookup[String(foundIndex !== undefined)];
};

const parseEcdcCsv = (csv: string, diseaseFR: string, cfg: EcdcDatasetConfig): RawHotspot[] => {
  const lines = csv
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const lineCountLookup: Record<string, () => RawHotspot[]> = {
    false: () => [],
    true: () => {
      const headers = lines[0]
        .split(",")
        .map((h) => h.replaceAll(/['"]/gu, "").trim());
      const codeIdx = findColIndex(headers, cfg.codeCol);
      const casesIdx = findColIndex(headers, cfg.casesCol);
      const weekIdx = findColIndex(headers, cfg.weekCol);

      const validColumns = codeIdx !== -1 && casesIdx !== -1;
      const columnLookup: Record<string, () => RawHotspot[]> = {
        false: () => [],
        true: () => {
          const dataLines = lines.slice(1);
          const latestByCountry = dataLines.reduce<Map<string, { week: string; cases: number }>>((acc, line) => {
            const cols = line.split(",").map((c) => c.replaceAll(/['"]/gu, "").trim());
            const rawAlpha = cols[codeIdx];
            const alpha2 = rawAlpha ? rawAlpha.toUpperCase() : "";
            const rawCases = cols[casesIdx];
            const cases = Number.parseInt(rawCases ? rawCases : "0", 10);
            const rawWeek = weekIdx === -1 ? "" : cols[weekIdx];
            const week = rawWeek ? rawWeek : "";

            const isValid = Boolean(alpha2) && !Number.isNaN(cases) && cases > 0;
            const validLookup: Record<string, () => void> = {
              false: () => undefined,
              true: () => {
                const existing = acc.get(alpha2);
                const shouldReplace = !existing || week > existing.week;
                const replaceLookup: Record<string, () => void> = {
                  false: () => undefined,
                  true: () => {
                    acc.set(alpha2, { week, cases });
                  },
                };
                replaceLookup[String(shouldReplace)]();
              },
            };
            validLookup[String(isValid)]();
            return acc;
          }, new Map());

          const now = new Date().toISOString();
          return Array.from(latestByCountry.entries()).flatMap(([alpha2, data]) => {
            const iso3 = ECDC_ALPHA2_TO_ISO3[alpha2];
            const isoLookup: Record<string, RawHotspot[]> = {
              true: [
                {
                  isoAlpha3: iso3 as string,
                  diseaseFR,
                  totalCases: data.cases,
                  lastUpdated: now,
                  source: "ECDC",
                },
              ],
              false: [],
            };
            return isoLookup[String(iso3 !== undefined)];
          });
        },
      };

      return columnLookup[String(validColumns)]();
    },
  };

  return lineCountLookup[String(lines.length >= 2)]();
};

const fetchECDC = async (): Promise<RawHotspot[]> => {
  const cacheKey = "ecdc_all";
  const cached = ecdcCache.get<RawHotspot[]>(cacheKey);
  const cacheLookup: Record<string, () => Promise<RawHotspot[]>> = {
    true: async () => cached as RawHotspot[],
    false: async () => {
      const settled = await Promise.allSettled(
        ECDC_DATASETS.map((dataset) =>
          axios
            .get<string>(dataset.url, { timeout: ECDC_TIMEOUT, responseType: "text" })
            .then((response) => ({
              diseaseFR: dataset.diseaseFR,
              hotspots: parseEcdcCsv(response.data, dataset.diseaseFR, dataset),
            }))
        )
      );

      const results = settled.flatMap((res) => {
        const isSuccess = res.status === "fulfilled";
        const resultLookup: Record<string, RawHotspot[]> = {
          true: isSuccess ? (res as PromiseFulfilledResult<{ diseaseFR: string; hotspots: RawHotspot[] }>).value.hotspots : [],
          false: [],
        };
        return resultLookup[String(isSuccess)];
      });

      ecdcCache.set(cacheKey, results);
      return results;
    },
  };

  return cacheLookup[String(cached !== undefined)]();
};

const PROMED_URL = "https://www.promedmail.org/api/v1/search";
const PROMED_TIMEOUT = 10_000;
const PROMED_QUERIES = ["malaria", "dengue", "cholera", "measles", "mpox", "influenza", "covid-19"];
const CASE_PATTERNS = [
  /(\d[\d\s,]+)\s*(?:confirmed\s+)?cases?/i,
  /(\d[\d\s,]+)\s*cas\b/i,
  /total[^\d]+(\d[\d\s,]+)/i,
];

const extractCases = (text: string): number => {
  const match = CASE_PATTERNS.map((p) => p.exec(text)).find(Boolean);
  const matchLookup: Record<string, () => number> = {
    false: () => 5,
    true: () => {
      const execArr = match as RegExpExecArray;
      const parsed = Number.parseInt(execArr[1].replaceAll(/[\s,]/gu, ""), 10);
      const isNumValid = !Number.isNaN(parsed) && parsed > 0;
      const numLookup: Record<string, number> = {
        true: parsed,
        false: 5,
      };
      return numLookup[String(isNumValid)];
    },
  };

  return matchLookup[String(match !== undefined)]();
};

const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
};

const searchPromedDisease = async (query: string, apiKey: string): Promise<PromedAlert[]> => {
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
    }
  );
  return response.data ? (response.data.data ? response.data.data.alerts : []) : [];
};

const resolveDiseaseFR = (alert: PromedAlert): string | undefined => {
  const diseaseNames = (alert.diseases ? alert.diseases : []).map((d) => d.name.toLowerCase());
  const fromDisease = diseaseNames.map((n) => DISEASE_EN_TO_FR[n]).find(Boolean);

  const fallbackSubject = (): string | undefined => {
    const sub = alert.subject.toLowerCase();
    const entry = Object.entries(DISEASE_EN_TO_FR).find(([key]) => sub.includes(key));
    return entry ? entry[1] : undefined;
  };

  const diseaseLookup: Record<string, () => string | undefined> = {
    true: () => fromDisease,
    false: fallbackSubject,
  };

  return diseaseLookup[String(fromDisease !== undefined)]();
};

const alertToRaw = (alert: PromedAlert): RawHotspot | null => {
  const diseaseFR = resolveDiseaseFR(alert);
  const places = alert.places ? alert.places : [];
  const place = places.length > 0 ? places[0] : null;

  const countryFromPlace = place ? (place.country ? place.country : (place.location ? place.location.country : "")) : "";
  const countryRaw = countryFromPlace.toLowerCase().trim();
  const isoAlpha3 = COUNTRY_NAME_TO_ISO3[countryRaw];

  const isValid = Boolean(diseaseFR) && Boolean(place) && Boolean(isoAlpha3);
  const rawLookup: Record<string, () => RawHotspot | null> = {
    false: () => null,
    true: () => {
      const validPlace = place as PromedPlace;
      const validIso = isoAlpha3 as string;
      const validDisease = diseaseFR as string;
      const lon = Number.parseFloat(validPlace.lon ? validPlace.lon : "");
      const lat = Number.parseFloat(validPlace.lat ? validPlace.lat : "");
      const geo = GEO_MAP[validIso];
      const hasCoords = !Number.isNaN(lon) && !Number.isNaN(lat);
      const coordsLookup: Record<string, [number, number]> = {
        true: [lon, lat],
        false: geo ? geo.coordinates : [0, 0],
      };
      const coordinates = coordsLookup[String(hasCoords)];

      return {
        isoAlpha3: validIso,
        diseaseFR: validDisease,
        totalCases: extractCases(alert.text ? alert.text : ""),
        lastUpdated: alert.date ? new Date(alert.date).toISOString() : new Date().toISOString(),
        source: "ProMED",
        coordinates,
      };
    },
  };

  return rawLookup[String(isValid)]();
};

const fetchProMED = async (): Promise<RawHotspot[]> => {
  const apiKey = process.env.PROMED_API_KEY;
  const keyLookup: Record<string, () => Promise<RawHotspot[]>> = {
    false: async () => [],
    true: async () => {
      const validKey = apiKey as string;
      const cacheKey = "promed_all";
      const cached = promedCache.get<RawHotspot[]>(cacheKey);
      const cacheLookup: Record<string, () => Promise<RawHotspot[]>> = {
        true: async () => cached as RawHotspot[],
        false: async () => {
          const settled = await Promise.allSettled(
            PROMED_QUERIES.map((q) => searchPromedDisease(q, validKey))
          );

          const allAlerts = settled.flatMap((res) => {
            const isFulfilled = res.status === "fulfilled";
            const alertsLookup: Record<string, PromedAlert[]> = {
              true: isFulfilled ? (res as PromiseFulfilledResult<PromedAlert[]>).value : [],
              false: [],
            };
            return alertsLookup[String(isFulfilled)];
          });

          const uniqueAlertsMap = allAlerts.reduce<Map<string, PromedAlert>>((acc, alert) => {
            acc.set(alert.unique_string, alert);
            return acc;
          }, new Map());

          const hotspots = Array.from(uniqueAlertsMap.values()).flatMap((alert) => {
            const raw = alertToRaw(alert);
            return raw ? [raw] : [];
          });

          promedCache.set(cacheKey, hotspots);
          return hotspots;
        },
      };

      return cacheLookup[String(cached !== undefined)]();
    },
  };

  return keyLookup[String(Boolean(apiKey))]();
};

const SOURCE_PRIORITY: Record<string, number> = { WHO: 1, ECDC: 2, ProMED: 3 };

const aggregateAll = async (): Promise<DiseaseHotspot[]> => {
  const cacheKey = "aggregated_all";
  const cached = aggregatorCache.get<DiseaseHotspot[]>(cacheKey);
  const cacheLookup: Record<string, () => Promise<DiseaseHotspot[]>> = {
    true: async () => cached as DiseaseHotspot[],
    false: async () => {
      const [whoRaw, ecdcRaw, promedRaw] = await Promise.all([
        fetchWHO().catch(() => [] as RawHotspot[]),
        fetchECDC().catch(() => [] as RawHotspot[]),
        fetchProMED().catch(() => [] as RawHotspot[]),
      ]);

      const bestByKey = [...whoRaw, ...ecdcRaw, ...promedRaw].reduce<Map<string, RawHotspot>>((acc, raw) => {
        const key = `${raw.isoAlpha3}-${raw.diseaseFR}`;
        const prev = acc.get(key);
        const shouldReplace = !prev || SOURCE_PRIORITY[raw.source] > SOURCE_PRIORITY[prev.source];
        const replaceLookup: Record<string, () => void> = {
          false: () => undefined,
          true: () => {
            acc.set(key, raw);
          },
        };
        replaceLookup[String(shouldReplace)]();
        return acc;
      }, new Map());

      const hotspots = Array.from(bestByKey.values())
        .map(toHotspot)
        .filter((h): h is DiseaseHotspot => h !== null)
        .sort((a, b) => b.totalCases - a.totalCases);

      aggregatorCache.set(cacheKey, hotspots);
      return hotspots;
    },
  };

  return cacheLookup[String(cached !== undefined)]();
};

const VALID_SOURCES = new Set<EpiSource>(["WHO", "ECDC", "ProMED"]);

/**
 * @description Controleur pour l'agregation et la restitution des hotspots epidemiologiques.
 *
 * @author SINGO Yao Dieu Donne
 * @since 2026-09-17
 */
export class HotspotController {
  /**
   * @description Recupere la liste des hotspots epidemiologiques selon filtres.
   *
   * @author SINGO Yao Dieu Donne
   * @since 2026-09-17
   * @param req Requete HTTP Express
   * @param res Reponse HTTP Express
   * @returns Reponse JSON contenant les hotspots
   */
  public getHotspots = async (req: Request, res: Response): Promise<Response> => {
    try {
      const query = req.query as Record<string, string | undefined>;
      const disease = query.disease ? query.disease : "";
      const source = query.source ? query.source : "";
      const minCases = query.minCases ? query.minCases : "";
      const minCasesNum = minCases ? Number.parseInt(minCases, 10) : Number.NaN;

      const allHotspots = await aggregateAll();
      const hotspots = allHotspots.filter((h) => {
        const matchesDisease = !disease || h.disease.toLowerCase().includes(disease.toLowerCase());
        const matchesSource = !source || (VALID_SOURCES.has(source as EpiSource) && h.source === source);
        const matchesMinCases = Number.isNaN(minCasesNum) || h.totalCases >= minCasesNum;
        return matchesDisease && matchesSource && matchesMinCases;
      });

      const promedEnabled = Boolean(process.env.PROMED_API_KEY);
      const promedDescLookup: Record<string, string> = {
        true: "ProMED API (7 derniers jours) - https://www.promedmail.org/",
        false: "ProMED desactive (PROMED_API_KEY manquant)",
      };

      const body: HotspotApiResponse = {
        success: true,
        count: hotspots.length,
        generatedAt: new Date().toISOString(),
        promedEnabled,
        sources: {
          who: "WHO GHO API (annuel) - https://ghoapi.azureedge.net/api/",
          ecdc: "ECDC Open Data (hebdomadaire) - https://opendata.ecdc.europa.eu/",
          promed: promedDescLookup[String(promedEnabled)],
        },
        data: hotspots,
      };

      return res.status(200).json(body);
    } catch {
      return errorResponse(res, "Erreur lors de la recuperation des hotspots", 500);
    }
  };

  /**
   * @description Recupere la liste distincte des pathologies disponibles.
   *
   * @author SINGO Yao Dieu Donne
   * @since 2026-09-17
   * @param _req Requete HTTP Express
   * @param res Reponse HTTP Express
   * @returns Reponse JSON contenant les pathologies
   */
  public getDiseases = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const hotspots = await aggregateAll();
      const diseases = Array.from(new Set(hotspots.map((h) => h.disease))).sort((a, b) =>
        a.localeCompare(b)
      );
      return successResponse(res, diseases, "Pathologies recuperees avec succes", 200);
    } catch {
      return errorResponse(res, "Erreur lors de la recuperation des maladies", 500);
    }
  };

  /**
   * @description Statut de sante du service de surveillance epidemiologique.
   *
   * @author SINGO Yao Dieu Donne
   * @since 2026-09-17
   * @param _req Requete HTTP Express
   * @param res Reponse HTTP Express
   * @returns Reponse JSON de sante
   */
  public getHealth = (_req: Request, res: Response): Response => {
    const stats = aggregatorCache.getStats();
    return successResponse(
      res,
      {
        status: "UP",
        uptime: Math.round(process.uptime()),
        promedEnabled: Boolean(process.env.PROMED_API_KEY),
        cache: { keys: stats.keys, hits: stats.hits, misses: stats.misses },
      },
      "Service epidemiologique operationnel",
      200
    );
  };
}

export default HotspotController;
