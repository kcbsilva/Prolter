// src/data/locations/africa.ts

export interface Country {
    code: string;
    name: {
      en: string;
      pt: string;
      es: string;
      fr: string;
    };
  }
  
  export const africanCountries: Country[] = [
    { code: 'DZ', name: { en: 'Algeria', pt: 'Argélia', es: 'Argelia', fr: 'Algérie' } },
    { code: 'AO', name: { en: 'Angola', pt: 'Angola', es: 'Angola', fr: 'Angola' } },
    { code: 'BJ', name: { en: 'Benin', pt: 'Benim', es: 'Benín', fr: 'Bénin' } },
    { code: 'BW', name: { en: 'Botswana', pt: 'Botsuana', es: 'Botsuana', fr: 'Botswana' } },
    { code: 'BF', name: { en: 'Burkina Faso', pt: 'Burquina Faso', es: 'Burkina Faso', fr: 'Burkina Faso' } },
    { code: 'BI', name: { en: 'Burundi', pt: 'Burundi', es: 'Burundi', fr: 'Burundi' } },
    { code: 'CM', name: { en: 'Cameroon', pt: 'Camarões', es: 'Camerún', fr: 'Cameroun' } },
    { code: 'CV', name: { en: 'Cape Verde', pt: 'Cabo Verde', es: 'Cabo Verde', fr: 'Cap-Vert' } },
    { code: 'CF', name: { en: 'Central African Republic', pt: 'República Centro-Africana', es: 'República Centroafricana', fr: 'République centrafricaine' } },
    { code: 'TD', name: { en: 'Chad', pt: 'Chade', es: 'Chad', fr: 'Tchad' } },
    { code: 'KM', name: { en: 'Comoros', pt: 'Comores', es: 'Comoras', fr: 'Comores' } },
    { code: 'CD', name: { en: 'Congo (DRC)', pt: 'Congo (RDC)', es: 'Congo (RDC)', fr: 'Congo (RDC)' } },
    { code: 'CG', name: { en: 'Congo (Republic)', pt: 'Congo', es: 'Congo', fr: 'Congo' } },
    { code: 'CI', name: { en: 'Côte d’Ivoire', pt: 'Costa do Marfim', es: 'Costa de Marfil', fr: 'Côte d’Ivoire' } },
    { code: 'DJ', name: { en: 'Djibouti', pt: 'Djibouti', es: 'Yibuti', fr: 'Djibouti' } },
    { code: 'EG', name: { en: 'Egypt', pt: 'Egito', es: 'Egipto', fr: 'Égypte' } },
    { code: 'GQ', name: { en: 'Equatorial Guinea', pt: 'Guiné Equatorial', es: 'Guinea Ecuatorial', fr: 'Guinée équatoriale' } },
    { code: 'ER', name: { en: 'Eritrea', pt: 'Eritreia', es: 'Eritrea', fr: 'Érythrée' } },
    { code: 'SZ', name: { en: 'Eswatini', pt: 'Essuatíni', es: 'Esuatini', fr: 'Eswatini' } },
    { code: 'ET', name: { en: 'Ethiopia', pt: 'Etiópia', es: 'Etiopía', fr: 'Éthiopie' } },
    { code: 'GA', name: { en: 'Gabon', pt: 'Gabão', es: 'Gabón', fr: 'Gabon' } },
    { code: 'GM', name: { en: 'Gambia', pt: 'Gâmbia', es: 'Gambia', fr: 'Gambie' } },
    { code: 'GH', name: { en: 'Ghana', pt: 'Gana', es: 'Ghana', fr: 'Ghana' } },
    { code: 'GN', name: { en: 'Guinea', pt: 'Guiné', es: 'Guinea', fr: 'Guinée' } },
    { code: 'GW', name: { en: 'Guinea-Bissau', pt: 'Guiné-Bissau', es: 'Guinea-Bisáu', fr: 'Guinée-Bissau' } },
    { code: 'KE', name: { en: 'Kenya', pt: 'Quênia', es: 'Kenia', fr: 'Kenya' } },
    { code: 'LS', name: { en: 'Lesotho', pt: 'Lesoto', es: 'Lesoto', fr: 'Lesotho' } },
    { code: 'LR', name: { en: 'Liberia', pt: 'Libéria', es: 'Liberia', fr: 'Libéria' } },
    { code: 'LY', name: { en: 'Libya', pt: 'Líbia', es: 'Libia', fr: 'Libye' } },
    { code: 'MG', name: { en: 'Madagascar', pt: 'Madagáscar', es: 'Madagascar', fr: 'Madagascar' } },
    { code: 'MW', name: { en: 'Malawi', pt: 'Maláui', es: 'Malaui', fr: 'Malawi' } },
    { code: 'ML', name: { en: 'Mali', pt: 'Mali', es: 'Malí', fr: 'Mali' } },
    { code: 'MR', name: { en: 'Mauritania', pt: 'Mauritânia', es: 'Mauritania', fr: 'Mauritanie' } },
    { code: 'MU', name: { en: 'Mauritius', pt: 'Maurícia', es: 'Mauricio', fr: 'Maurice' } },
    { code: 'MA', name: { en: 'Morocco', pt: 'Marrocos', es: 'Marruecos', fr: 'Maroc' } },
    { code: 'MZ', name: { en: 'Mozambique', pt: 'Moçambique', es: 'Mozambique', fr: 'Mozambique' } },
    { code: 'NA', name: { en: 'Namibia', pt: 'Namíbia', es: 'Namibia', fr: 'Namibie' } },
    { code: 'NE', name: { en: 'Niger', pt: 'Níger', es: 'Níger', fr: 'Niger' } },
    { code: 'NG', name: { en: 'Nigeria', pt: 'Nigéria', es: 'Nigeria', fr: 'Nigéria' } },
    { code: 'RW', name: { en: 'Rwanda', pt: 'Ruanda', es: 'Ruanda', fr: 'Rwanda' } },
    { code: 'ST', name: { en: 'São Tomé and Príncipe', pt: 'São Tomé e Príncipe', es: 'Santo Tomé y Príncipe', fr: 'Sao Tomé-et-Principe' } },
    { code: 'SN', name: { en: 'Senegal', pt: 'Senegal', es: 'Senegal', fr: 'Sénégal' } },
    { code: 'SC', name: { en: 'Seychelles', pt: 'Seicheles', es: 'Seychelles', fr: 'Seychelles' } },
    { code: 'SL', name: { en: 'Sierra Leone', pt: 'Serra Leoa', es: 'Sierra Leona', fr: 'Sierra Leone' } },
    { code: 'SO', name: { en: 'Somalia', pt: 'Somália', es: 'Somalia', fr: 'Somalie' } },
    { code: 'ZA', name: { en: 'South Africa', pt: 'África do Sul', es: 'Sudáfrica', fr: 'Afrique du Sud' } },
    { code: 'SS', name: { en: 'South Sudan', pt: 'Sudão do Sul', es: 'Sudán del Sur', fr: 'Soudan du Sud' } },
    { code: 'SD', name: { en: 'Sudan', pt: 'Sudão', es: 'Sudán', fr: 'Soudan' } },
    { code: 'TZ', name: { en: 'Tanzania', pt: 'Tanzânia', es: 'Tanzania', fr: 'Tanzanie' } },
    { code: 'TG', name: { en: 'Togo', pt: 'Togo', es: 'Togo', fr: 'Togo' } },
    { code: 'TN', name: { en: 'Tunisia', pt: 'Tunísia', es: 'Túnez', fr: 'Tunisie' } },
    { code: 'UG', name: { en: 'Uganda', pt: 'Uganda', es: 'Uganda', fr: 'Ouganda' } },
    { code: 'ZM', name: { en: 'Zambia', pt: 'Zâmbia', es: 'Zambia', fr: 'Zambie' } },
    { code: 'ZW', name: { en: 'Zimbabwe', pt: 'Zimbábue', es: 'Zimbabue', fr: 'Zimbabwe' } },
  ];
  