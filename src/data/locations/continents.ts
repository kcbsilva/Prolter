// src/data/locations/continents.ts

export type LanguageCode = 'en' | 'pt' | 'es' | 'fr';

export interface Continent {
  code: string;
  name: Record<LanguageCode, string>;
}

export const continents: Continent[] = [
  {
    code: 'AF',
    name: {
      en: 'Africa',
      pt: 'África',
      es: 'África',
      fr: 'Afrique',
    },
  },
  {
    code: 'AN',
    name: {
      en: 'Antarctica',
      pt: 'Antártida',
      es: 'Antártida',
      fr: 'Antarctique',
    },
  },
  {
    code: 'AS',
    name: {
      en: 'Asia',
      pt: 'Ásia',
      es: 'Asia',
      fr: 'Asie',
    },
  },
  {
    code: 'EU',
    name: {
      en: 'Europe',
      pt: 'Europa',
      es: 'Europa',
      fr: 'Europe',
    },
  },
  {
    code: 'NA',
    name: {
      en: 'North America',
      pt: 'América do Norte',
      es: 'América del Norte',
      fr: 'Amérique du Nord',
    },
  },
  {
    code: 'OC',
    name: {
      en: 'Oceania',
      pt: 'Oceania',
      es: 'Oceanía',
      fr: 'Océanie',
    },
  },
  {
    code: 'SA',
    name: {
      en: 'South America',
      pt: 'América do Sul',
      es: 'América del Sur',
      fr: 'Amérique du Sud',
    },
  },
];
