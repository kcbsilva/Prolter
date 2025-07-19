// src/data/locations/north-america.ts

export interface Country {
    code: string;
    name: {
      en: string;
      pt: string;
      es: string;
      fr: string;
    };
  }
  
  export const northAmericanCountries: Country[] = [
    { code: 'AG', name: { en: 'Antigua and Barbuda', pt: 'Antígua e Barbuda', es: 'Antigua y Barbuda', fr: 'Antigua-et-Barbuda' } },
    { code: 'BS', name: { en: 'Bahamas', pt: 'Bahamas', es: 'Bahamas', fr: 'Bahamas' } },
    { code: 'BB', name: { en: 'Barbados', pt: 'Barbados', es: 'Barbados', fr: 'Barbade' } },
    { code: 'BZ', name: { en: 'Belize', pt: 'Belize', es: 'Belice', fr: 'Belize' } },
    { code: 'CA', name: { en: 'Canada', pt: 'Canadá', es: 'Canadá', fr: 'Canada' } },
    { code: 'CR', name: { en: 'Costa Rica', pt: 'Costa Rica', es: 'Costa Rica', fr: 'Costa Rica' } },
    { code: 'CU', name: { en: 'Cuba', pt: 'Cuba', es: 'Cuba', fr: 'Cuba' } },
    { code: 'DM', name: { en: 'Dominica', pt: 'Dominica', es: 'Dominica', fr: 'Dominique' } },
    { code: 'DO', name: { en: 'Dominican Republic', pt: 'República Dominicana', es: 'República Dominicana', fr: 'République dominicaine' } },
    { code: 'SV', name: { en: 'El Salvador', pt: 'El Salvador', es: 'El Salvador', fr: 'Salvador' } },
    { code: 'GD', name: { en: 'Grenada', pt: 'Granada', es: 'Granada', fr: 'Grenade' } },
    { code: 'GT', name: { en: 'Guatemala', pt: 'Guatemala', es: 'Guatemala', fr: 'Guatemala' } },
    { code: 'HT', name: { en: 'Haiti', pt: 'Haiti', es: 'Haití', fr: 'Haïti' } },
    { code: 'HN', name: { en: 'Honduras', pt: 'Honduras', es: 'Honduras', fr: 'Honduras' } },
    { code: 'JM', name: { en: 'Jamaica', pt: 'Jamaica', es: 'Jamaica', fr: 'Jamaïque' } },
    { code: 'MX', name: { en: 'Mexico', pt: 'México', es: 'México', fr: 'Mexique' } },
    { code: 'NI', name: { en: 'Nicaragua', pt: 'Nicarágua', es: 'Nicaragua', fr: 'Nicaragua' } },
    { code: 'PA', name: { en: 'Panama', pt: 'Panamá', es: 'Panamá', fr: 'Panama' } },
    { code: 'KN', name: { en: 'Saint Kitts and Nevis', pt: 'São Cristóvão e Nevis', es: 'San Cristóbal y Nieves', fr: 'Saint-Christophe-et-Niévès' } },
    { code: 'LC', name: { en: 'Saint Lucia', pt: 'Santa Lúcia', es: 'Santa Lucía', fr: 'Sainte-Lucie' } },
    { code: 'VC', name: { en: 'Saint Vincent and the Grenadines', pt: 'São Vicente e Granadinas', es: 'San Vicente y las Granadinas', fr: 'Saint-Vincent-et-les-Grenadines' } },
    { code: 'TT', name: { en: 'Trinidad and Tobago', pt: 'Trindade e Tobago', es: 'Trinidad y Tobago', fr: 'Trinité-et-Tobago' } },
    { code: 'US', name: { en: 'United States', pt: 'Estados Unidos', es: 'Estados Unidos', fr: 'États-Unis' } },
  ];
  