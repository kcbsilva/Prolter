// src/data/locations/south-america/brazil/index.ts

export interface State {
  code: string;
  name: {
    en: string;
    pt: string;
    es: string;
    fr: string;
  };
}

export const brazilStates: State[] = [
  { code: 'AC', name: { en: 'Acre', pt: 'Acre', es: 'Acre', fr: 'Acre' } },
  { code: 'AL', name: { en: 'Alagoas', pt: 'Alagoas', es: 'Alagoas', fr: 'Alagoas' } },
  { code: 'AP', name: { en: 'Amapá', pt: 'Amapá', es: 'Amapá', fr: 'Amapá' } },
  { code: 'AM', name: { en: 'Amazonas', pt: 'Amazonas', es: 'Amazonas', fr: 'Amazonas' } },
  { code: 'BA', name: { en: 'Bahia', pt: 'Bahia', es: 'Bahía', fr: 'Bahia' } },
  { code: 'CE', name: { en: 'Ceará', pt: 'Ceará', es: 'Ceará', fr: 'Ceará' } },
  { code: 'DF', name: { en: 'Federal District', pt: 'Distrito Federal', es: 'Distrito Federal', fr: 'District fédéral' } },
  { code: 'ES', name: { en: 'Espírito Santo', pt: 'Espírito Santo', es: 'Espírito Santo', fr: 'Espírito Santo' } },
  { code: 'GO', name: { en: 'Goiás', pt: 'Goiás', es: 'Goiás', fr: 'Goiás' } },
  { code: 'MA', name: { en: 'Maranhão', pt: 'Maranhão', es: 'Maranhão', fr: 'Maranhão' } },
  { code: 'MT', name: { en: 'Mato Grosso', pt: 'Mato Grosso', es: 'Mato Grosso', fr: 'Mato Grosso' } },
  { code: 'MS', name: { en: 'Mato Grosso do Sul', pt: 'Mato Grosso do Sul', es: 'Mato Grosso del Sur', fr: 'Mato Grosso do Sul' } },
  { code: 'MG', name: { en: 'Minas Gerais', pt: 'Minas Gerais', es: 'Minas Gerais', fr: 'Minas Gerais' } },
  { code: 'PA', name: { en: 'Pará', pt: 'Pará', es: 'Pará', fr: 'Pará' } },
  { code: 'PB', name: { en: 'Paraíba', pt: 'Paraíba', es: 'Paraíba', fr: 'Paraíba' } },
  { code: 'PR', name: { en: 'Paraná', pt: 'Paraná', es: 'Paraná', fr: 'Paraná' } },
  { code: 'PE', name: { en: 'Pernambuco', pt: 'Pernambuco', es: 'Pernambuco', fr: 'Pernambuco' } },
  { code: 'PI', name: { en: 'Piauí', pt: 'Piauí', es: 'Piauí', fr: 'Piauí' } },
  { code: 'RJ', name: { en: 'Rio de Janeiro', pt: 'Rio de Janeiro', es: 'Río de Janeiro', fr: 'Rio de Janeiro' } },
  { code: 'RN', name: { en: 'Rio Grande do Norte', pt: 'Rio Grande do Norte', es: 'Río Grande del Norte', fr: 'Rio Grande do Norte' } },
  { code: 'RS', name: { en: 'Rio Grande do Sul', pt: 'Rio Grande do Sul', es: 'Río Grande del Sur', fr: 'Rio Grande do Sul' } },
  { code: 'RO', name: { en: 'Rondônia', pt: 'Rondônia', es: 'Rondônia', fr: 'Rondônia' } },
  { code: 'RR', name: { en: 'Roraima', pt: 'Roraima', es: 'Roraima', fr: 'Roraima' } },
  { code: 'SC', name: { en: 'Santa Catarina', pt: 'Santa Catarina', es: 'Santa Catarina', fr: 'Santa Catarina' } },
  { code: 'SP', name: { en: 'São Paulo', pt: 'São Paulo', es: 'São Paulo', fr: 'São Paulo' } },
  { code: 'SE', name: { en: 'Sergipe', pt: 'Sergipe', es: 'Sergipe', fr: 'Sergipe' } },
  { code: 'TO', name: { en: 'Tocantins', pt: 'Tocantins', es: 'Tocantins', fr: 'Tocantins' } },
];

// Export each state’s city list
export * from './acre';
export * from './alagoas';
export * from './amapa';
export * from './amazonas';
export * from './bahia';
export * from './ceara';
export * from './distrito-federal';
export * from './espirito-santo';
export * from './goias';
export * from './maranhao';
export * from './mato-grosso';
export * from './mato-grosso-do-sul';
export * from './minas-gerais';
export * from './para';
export * from './paraiba';
export * from './parana';
export * from './pernambuco';
export * from './piaui';
export * from './rio-de-janeiro';
export * from './rio-grande-do-norte';
export * from './rio-grande-do-sul';
export * from './rondonia';
export * from './roraima';
export * from './santa-catarina';
export * from './sao-paulo';
export * from './sergipe';
export * from './tocantins';
