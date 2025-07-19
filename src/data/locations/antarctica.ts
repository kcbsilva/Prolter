// src/data/locations/antarctica.ts

export interface Country {
    code: string;
    name: {
      en: string;
      pt: string;
      es: string;
      fr: string;
    };
  }
  
  export const antarcticTerritories: Country[] = [
    { code: 'AQ', name: { en: 'Antarctica', pt: 'Antártica', es: 'Antártida', fr: 'Antarctique' } },
    { code: 'ATA-AR', name: { en: 'Argentine Antarctica', pt: 'Antártica Argentina', es: 'Antártida Argentina', fr: 'Antarctique argentine' } },
    { code: 'ATA-AU', name: { en: 'Australian Antarctic Territory', pt: 'Território Antártico Australiano', es: 'Territorio Antártico Australiano', fr: 'Territoire antarctique australien' } },
    { code: 'ATA-CH', name: { en: 'Chilean Antarctic Territory', pt: 'Antártica Chilena', es: 'Antártida Chilena', fr: 'Antarctique chilienne' } },
    { code: 'ATA-FR', name: { en: 'Adélie Land (France)', pt: 'Terra Adélia (França)', es: 'Tierra Adelia (Francia)', fr: 'Terre Adélie (France)' } },
    { code: 'ATA-NZ', name: { en: 'Ross Dependency (New Zealand)', pt: 'Dependência de Ross (Nova Zelândia)', es: 'Dependencia de Ross (Nueva Zelanda)', fr: 'Dépendance de Ross (Nouvelle-Zélande)' } },
    { code: 'ATA-NO', name: { en: 'Peter I Island (Norway)', pt: 'Ilha Pedro I (Noruega)', es: 'Isla Pedro I (Noruega)', fr: 'Île Pierre Ier (Norvège)' } },
    { code: 'ATA-UK', name: { en: 'British Antarctic Territory', pt: 'Território Antártico Britânico', es: 'Territorio Antártico Británico', fr: 'Territoire antarctique britannique' } },
  ];
  