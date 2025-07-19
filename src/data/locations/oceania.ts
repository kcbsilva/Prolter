// src/data/locations/oceania.ts

export interface Country {
    code: string;
    name: {
      en: string;
      pt: string;
      es: string;
      fr: string;
    };
  }
  
  export const oceanianCountries: Country[] = [
    { code: 'AS', name: { en: 'American Samoa', pt: 'Samoa Americana', es: 'Samoa Americana', fr: 'Samoa américaines' } },
    { code: 'AU', name: { en: 'Australia', pt: 'Austrália', es: 'Australia', fr: 'Australie' } },
    { code: 'CK', name: { en: 'Cook Islands', pt: 'Ilhas Cook', es: 'Islas Cook', fr: 'Îles Cook' } },
    { code: 'FJ', name: { en: 'Fiji', pt: 'Fiji', es: 'Fiyi', fr: 'Fidji' } },
    { code: 'PF', name: { en: 'French Polynesia', pt: 'Polinésia Francesa', es: 'Polinesia Francesa', fr: 'Polynésie française' } },
    { code: 'GU', name: { en: 'Guam', pt: 'Guame', es: 'Guam', fr: 'Guam' } },
    { code: 'KI', name: { en: 'Kiribati', pt: 'Quiribáti', es: 'Kiribati', fr: 'Kiribati' } },
    { code: 'MH', name: { en: 'Marshall Islands', pt: 'Ilhas Marshall', es: 'Islas Marshall', fr: 'Îles Marshall' } },
    { code: 'FM', name: { en: 'Micronesia', pt: 'Micronésia', es: 'Micronesia', fr: 'Micronésie' } },
    { code: 'NR', name: { en: 'Nauru', pt: 'Nauru', es: 'Nauru', fr: 'Nauru' } },
    { code: 'NC', name: { en: 'New Caledonia', pt: 'Nova Caledônia', es: 'Nueva Caledonia', fr: 'Nouvelle-Calédonie' } },
    { code: 'NZ', name: { en: 'New Zealand', pt: 'Nova Zelândia', es: 'Nueva Zelanda', fr: 'Nouvelle-Zélande' } },
    { code: 'NU', name: { en: 'Niue', pt: 'Niue', es: 'Niue', fr: 'Niue' } },
    { code: 'PW', name: { en: 'Palau', pt: 'Palau', es: 'Palaos', fr: 'Palaos' } },
    { code: 'PG', name: { en: 'Papua New Guinea', pt: 'Papua-Nova Guiné', es: 'Papúa Nueva Guinea', fr: 'Papouasie-Nouvelle-Guinée' } },
    { code: 'WS', name: { en: 'Samoa', pt: 'Samoa', es: 'Samoa', fr: 'Samoa' } },
    { code: 'SB', name: { en: 'Solomon Islands', pt: 'Ilhas Salomão', es: 'Islas Salomón', fr: 'Îles Salomon' } },
    { code: 'TO', name: { en: 'Tonga', pt: 'Tonga', es: 'Tonga', fr: 'Tonga' } },
    { code: 'TV', name: { en: 'Tuvalu', pt: 'Tuvalu', es: 'Tuvalu', fr: 'Tuvalu' } },
    { code: 'VU', name: { en: 'Vanuatu', pt: 'Vanuatu', es: 'Vanuatu', fr: 'Vanuatu' } },
  ];
  