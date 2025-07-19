// src/data/locations/europe.ts

export interface Country {
    code: string;
    name: {
      en: string;
      pt: string;
      es: string;
      fr: string;
    };
  }
  
  export const europeanCountries: Country[] = [
    { code: 'AL', name: { en: 'Albania', pt: 'Albânia', es: 'Albania', fr: 'Albanie' } },
    { code: 'AD', name: { en: 'Andorra', pt: 'Andorra', es: 'Andorra', fr: 'Andorre' } },
    { code: 'AM', name: { en: 'Armenia', pt: 'Armênia', es: 'Armenia', fr: 'Arménie' } },
    { code: 'AT', name: { en: 'Austria', pt: 'Áustria', es: 'Austria', fr: 'Autriche' } },
    { code: 'AZ', name: { en: 'Azerbaijan', pt: 'Azerbaijão', es: 'Azerbaiyán', fr: 'Azerbaïdjan' } },
    { code: 'BY', name: { en: 'Belarus', pt: 'Bielorrússia', es: 'Bielorrusia', fr: 'Biélorussie' } },
    { code: 'BE', name: { en: 'Belgium', pt: 'Bélgica', es: 'Bélgica', fr: 'Belgique' } },
    { code: 'BA', name: { en: 'Bosnia and Herzegovina', pt: 'Bósnia e Herzegovina', es: 'Bosnia y Herzegovina', fr: 'Bosnie-Herzégovine' } },
    { code: 'BG', name: { en: 'Bulgaria', pt: 'Bulgária', es: 'Bulgaria', fr: 'Bulgarie' } },
    { code: 'HR', name: { en: 'Croatia', pt: 'Croácia', es: 'Croacia', fr: 'Croatie' } },
    { code: 'CY', name: { en: 'Cyprus', pt: 'Chipre', es: 'Chipre', fr: 'Chypre' } },
    { code: 'CZ', name: { en: 'Czech Republic', pt: 'Tchéquia', es: 'Chequia', fr: 'Tchéquie' } },
    { code: 'DK', name: { en: 'Denmark', pt: 'Dinamarca', es: 'Dinamarca', fr: 'Danemark' } },
    { code: 'EE', name: { en: 'Estonia', pt: 'Estónia', es: 'Estonia', fr: 'Estonie' } },
    { code: 'FI', name: { en: 'Finland', pt: 'Finlândia', es: 'Finlandia', fr: 'Finlande' } },
    { code: 'FR', name: { en: 'France', pt: 'França', es: 'Francia', fr: 'France' } },
    { code: 'GE', name: { en: 'Georgia', pt: 'Geórgia', es: 'Georgia', fr: 'Géorgie' } },
    { code: 'DE', name: { en: 'Germany', pt: 'Alemanha', es: 'Alemania', fr: 'Allemagne' } },
    { code: 'GR', name: { en: 'Greece', pt: 'Grécia', es: 'Grecia', fr: 'Grèce' } },
    { code: 'HU', name: { en: 'Hungary', pt: 'Hungria', es: 'Hungría', fr: 'Hongrie' } },
    { code: 'IS', name: { en: 'Iceland', pt: 'Islândia', es: 'Islandia', fr: 'Islande' } },
    { code: 'IE', name: { en: 'Ireland', pt: 'Irlanda', es: 'Irlanda', fr: 'Irlande' } },
    { code: 'IT', name: { en: 'Italy', pt: 'Itália', es: 'Italia', fr: 'Italie' } },
    { code: 'KZ', name: { en: 'Kazakhstan (part)', pt: 'Cazaquistão (parte)', es: 'Kazajistán (parte)', fr: 'Kazakhstan (partie)' } },
    { code: 'XK', name: { en: 'Kosovo', pt: 'Kosovo', es: 'Kosovo', fr: 'Kosovo' } },
    { code: 'LV', name: { en: 'Latvia', pt: 'Letônia', es: 'Letonia', fr: 'Lettonie' } },
    { code: 'LI', name: { en: 'Liechtenstein', pt: 'Liechtenstein', es: 'Liechtenstein', fr: 'Liechtenstein' } },
    { code: 'LT', name: { en: 'Lithuania', pt: 'Lituânia', es: 'Lituania', fr: 'Lituanie' } },
    { code: 'LU', name: { en: 'Luxembourg', pt: 'Luxemburgo', es: 'Luxemburgo', fr: 'Luxembourg' } },
    { code: 'MT', name: { en: 'Malta', pt: 'Malta', es: 'Malta', fr: 'Malte' } },
    { code: 'MD', name: { en: 'Moldova', pt: 'Moldávia', es: 'Moldavia', fr: 'Moldavie' } },
    { code: 'MC', name: { en: 'Monaco', pt: 'Mônaco', es: 'Mónaco', fr: 'Monaco' } },
    { code: 'ME', name: { en: 'Montenegro', pt: 'Montenegro', es: 'Montenegro', fr: 'Monténégro' } },
    { code: 'NL', name: { en: 'Netherlands', pt: 'Países Baixos', es: 'Países Bajos', fr: 'Pays-Bas' } },
    { code: 'MK', name: { en: 'North Macedonia', pt: 'Macedônia do Norte', es: 'Macedonia del Norte', fr: 'Macédoine du Nord' } },
    { code: 'NO', name: { en: 'Norway', pt: 'Noruega', es: 'Noruega', fr: 'Norvège' } },
    { code: 'PL', name: { en: 'Poland', pt: 'Polônia', es: 'Polonia', fr: 'Pologne' } },
    { code: 'PT', name: { en: 'Portugal', pt: 'Portugal', es: 'Portugal', fr: 'Portugal' } },
    { code: 'RO', name: { en: 'Romania', pt: 'Romênia', es: 'Rumanía', fr: 'Roumanie' } },
    { code: 'RU', name: { en: 'Russia (part)', pt: 'Rússia (parte)', es: 'Rusia (parte)', fr: 'Russie (partie)' } },
    { code: 'SM', name: { en: 'San Marino', pt: 'San Marino', es: 'San Marino', fr: 'Saint-Marin' } },
    { code: 'RS', name: { en: 'Serbia', pt: 'Sérvia', es: 'Serbia', fr: 'Serbie' } },
    { code: 'SK', name: { en: 'Slovakia', pt: 'Eslováquia', es: 'Eslovaquia', fr: 'Slovaquie' } },
    { code: 'SI', name: { en: 'Slovenia', pt: 'Eslovênia', es: 'Eslovenia', fr: 'Slovénie' } },
    { code: 'ES', name: { en: 'Spain', pt: 'Espanha', es: 'España', fr: 'Espagne' } },
    { code: 'SE', name: { en: 'Sweden', pt: 'Suécia', es: 'Suecia', fr: 'Suède' } },
    { code: 'CH', name: { en: 'Switzerland', pt: 'Suíça', es: 'Suiza', fr: 'Suisse' } },
    { code: 'TR', name: { en: 'Turkey (part)', pt: 'Turquia (parte)', es: 'Turquía (parte)', fr: 'Turquie (partie)' } },
    { code: 'UA', name: { en: 'Ukraine', pt: 'Ucrânia', es: 'Ucrania', fr: 'Ukraine' } },
    { code: 'GB', name: { en: 'United Kingdom', pt: 'Reino Unido', es: 'Reino Unido', fr: 'Royaume-Uni' } },
    { code: 'VA', name: { en: 'Vatican City', pt: 'Vaticano', es: 'Ciudad del Vaticano', fr: 'Vatican' } },
  ];
  