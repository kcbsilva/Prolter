// src/data/locations/south-america.ts

export interface Country {
    code: string;
    name: {
      en: string;
      pt: string;
      es: string;
      fr: string;
    };
  }
  
  export const southAmericanCountries: Country[] = [
    { code: 'AR', name: { en: 'Argentina', pt: 'Argentina', es: 'Argentina', fr: 'Argentine' } },
    { code: 'BO', name: { en: 'Bolivia', pt: 'Bolívia', es: 'Bolivia', fr: 'Bolivie' } },
    { code: 'BR', name: { en: 'Brazil', pt: 'Brasil', es: 'Brasil', fr: 'Brésil' } },
    { code: 'CL', name: { en: 'Chile', pt: 'Chile', es: 'Chile', fr: 'Chili' } },
    { code: 'CO', name: { en: 'Colombia', pt: 'Colômbia', es: 'Colombia', fr: 'Colombie' } },
    { code: 'EC', name: { en: 'Ecuador', pt: 'Equador', es: 'Ecuador', fr: 'Équateur' } },
    { code: 'GY', name: { en: 'Guyana', pt: 'Guiana', es: 'Guyana', fr: 'Guyana' } },
    { code: 'PY', name: { en: 'Paraguay', pt: 'Paraguai', es: 'Paraguay', fr: 'Paraguay' } },
    { code: 'PE', name: { en: 'Peru', pt: 'Peru', es: 'Perú', fr: 'Pérou' } },
    { code: 'SR', name: { en: 'Suriname', pt: 'Suriname', es: 'Surinam', fr: 'Suriname' } },
    { code: 'UY', name: { en: 'Uruguay', pt: 'Uruguai', es: 'Uruguay', fr: 'Uruguay' } },
    { code: 'VE', name: { en: 'Venezuela', pt: 'Venezuela', es: 'Venezuela', fr: 'Venezuela' } },
  ];
  