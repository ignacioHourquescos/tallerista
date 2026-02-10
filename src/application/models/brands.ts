interface Brand {
  id: string;
  name: string;
  category: string;
  logo: string;
  active: boolean;
  erp_original_name: string;
}

type Brands = {
  [key: string]: Brand;
};

export const brands: Brands = {
  12: {
    id: '12',
    name: 'motul',
    category: 'Aceites',
    logo: './motul_logo.png',
    active: true,
    erp_original_name: 'MOTUL',
  },
  15: {
    id: '15',
    name: 'mahle',
    category: 'Filtros',
    logo: './mahle_logo.png',
    active: true,
    erp_original_name: 'MAHLE',
  },
  1: {
    id: '1',
    name: 'fram',
    category: 'Filtros',
    logo: './fram_logo.png',
    active: true,
    erp_original_name: 'FRAM',
  },
  5: {
    id: '5',
    name: 'total',
    category: 'Aceites',
    logo: './total_logo.png',
    active: true,
    erp_original_name: 'TOTAL',
  },
  316: {
    id: '316',
    name: 'petronas',
    category: 'Aceites',
    logo: './petronas_logo.png',
    active: true,
    erp_original_name: 'PETRONAS',
  },
  27: {
    id: '27',
    name: 'puma',
    category: 'Aceites',
    logo: './puma_logo.png',
    active: true,
    erp_original_name: 'PUMA',
  },
  3: {
    id: '3',
    name: 'valvoline',
    category: 'Aceites',
    logo: './valvoline_logo.png',
    active: true,
    erp_original_name: 'VALVOLINE',
  },
  48: {
    id: '48',
    name: 'eam',
    category: 'Filtros',
    logo: './alternativo_logo.png',
    active: true,
    erp_original_name: 'EAM',
  },
  17: {
    id: '17',
    name: 'hs',
    category: 'Filtros',
    logo: './alternativo_logo.png',
    active: false,
    erp_original_name: 'HS',
  },
  29: {
    id: '29',
    name: 'karbon',
    category: 'Filtros',
    logo: './alternativo_logo.png',
    active: true,
    erp_original_name: 'KARBON',
  },
  9: {
    id: '9',
    name: 'mann',
    category: 'Filtros',
    logo: './mann_logo.png',
    active: true,
    erp_original_name: 'MANN',
  },
  10: {
    id: '10',
    name: 'tecneco',
    category: 'Filtros',
    logo: './tecneco_logo.png',
    active: true,
    erp_original_name: 'TECNECO',
  },
  23: {
    id: '23',
    name: 'ofertas_fram',
    category: 'Filtros',
    logo: './ofertas_fram_logo.png',
    active: false,
    erp_original_name: 'OFERTAS FRAM',
  },
  16: {
    id: '16',
    name: 'ofertas_kits',
    category: 'Filtros',
    logo: './ofertas_kits_logo.png',
    active: false,
    erp_original_name: 'OFERTAS KITS',
  },
  8: {
    id: '8',
    name: 'rama',
    category: 'Filtros',
    logo: './rama_logo.png',
    active: true,
    erp_original_name: 'RAMA',
  },
  22: {
    id: '22',
    name: 'sakura',
    category: 'Filtros',
    logo: './sakura_logo.png',
    active: false,
    erp_original_name: 'SAKURA',
  },
  6: {
    id: '6',
    name: 'union_filter',
    category: 'Filtros',
    logo: './union_filter_logo.png',
    active: false,
    erp_original_name: 'UNION FILTER',
  },
  7: {
    id: '7',
    name: 'union_japan',
    category: 'Filtros',
    logo: './union_japan_logo.png',
    active: false,
    erp_original_name: 'UNION JAPAN',
  },
  26: {
    id: '26',
    name: 'wega',
    category: 'Filtros',
    logo: './wega_logo.png',
    active: true,
    erp_original_name: 'WEGA',
  },
  14: {
    id: '14',
    name: 'Locx',
    category: 'Otros',
    logo: './locx_logo.png',
    active: true,
    erp_original_name: 'LOCX',
  },
  11: {
    id: '11',
    name: 'Wagner Lockheed',
    category: 'Otros',
    logo: './wl_logo.png',
    active: true,
    erp_original_name: 'WAGNER LOCKHEED',
  },
  28: {
    id: '28',
    name: 'shell',
    category: 'Aceites',
    logo: './shell_logo.png',
    active: true,
    erp_original_name: 'SHELL',
  },
  30: {
    id: '30',
    name: 'VW',
    category: 'Filtros',
    logo: './vw_logo.png',
    active: true,
    erp_original_name: 'VW',
  },
  32: {
    id: '32',
    name: 'Fiat',
    category: 'Filtros',
    logo: './fiat_logo.png',
    active: true,
    erp_original_name: 'ORIGINALES',
  },
  36: {
    id: '36',
    name: 'Renault',
    category: 'Filtros',
    logo: './renault_logo.png',
    active: true,
    erp_original_name: 'RENAULT',
  },
  35: {
    id: '35',
    name: 'GM',
    category: 'Filtros',
    logo: './gm_logo.png',
    active: true,
    erp_original_name: 'GM',
  },
};

export const codeToNameMapping: { [code: string]: string } = Object.keys(
  brands
).reduce((acc, key) => {
  acc[key] = brands[key].name;
  return acc;
}, {} as { [code: string]: string });

export const availableBrands = Object.keys(brands);
