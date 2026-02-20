import { FilterKit, FilterKitWithPrices, FilterInfoWithPrice } from '../models/filter-kits';
import filterKitsData from '../../data/filter-kits.json';
import { brands } from '../models/brands';

/**
 * Obtiene todos los kits de filtros desde el JSON hardcodeado
 */
export const getFilterKits = (): FilterKit[] => {
  return filterKitsData as FilterKit[];
};

/**
 * Obtiene los descuentos del cliente desde localStorage
 */
const getClientDiscountsArray = () => {
  try {
    const stored = localStorage.getItem('clientDiscounts');
    if (!stored) {
      return [];
    }
    
    const parsed = JSON.parse(stored);
    
    // Si es un objeto ClientDiscountDto con propiedad discounts
    if (parsed && parsed.discounts && Array.isArray(parsed.discounts)) {
      return parsed.discounts;
    }
    
    // Si es un array directo
    if (Array.isArray(parsed)) {
      return parsed;
    }
    
    return [];
  } catch (error) {
    console.error('Error parsing clientDiscounts:', error);
    return [];
  }
};

/**
 * Obtiene el descuento para una marca específica
 */
const getDiscountForBrand = (brandName: any, clientDiscounts: any[]) => {
  if (!brandName || !clientDiscounts || clientDiscounts.length === 0) {
    return 0;
  }
  
  const brandNameUpper = brandName.toUpperCase();
  
  // Buscar por descrip_agru (estructura antigua de la API)
  let discountObj = clientDiscounts.find(
    (d: any) => d.descrip_agru && d.descrip_agru.toUpperCase() === brandNameUpper
  );
  
  if (discountObj) {
    return discountObj.porcen_descuen || 0;
  }
  
  // Buscar por agrupacion (estructura nueva según el modelo)
  discountObj = clientDiscounts.find(
    (d: any) => d.agrupacion && d.agrupacion.toUpperCase() === brandNameUpper
  );
  
  if (discountObj) {
    return discountObj.porcentaje_descuento || 0;
  }
  
  return 0;
};

/**
 * Obtiene un kit de filtros por su ID
 */
export const getFilterKitById = (id: string): FilterKit | undefined => {
  return filterKitsData.find((kit: FilterKit) => kit.id === id) as FilterKit | undefined;
};

/**
 * Cruza los códigos de un kit con los artículos disponibles del endpoint
 * para obtener los precios de cada filtro (considerando descuentos del cliente)
 */
export const enrichFilterKitWithPrices = (
  kit: FilterKit,
  availableArticles: any[],
  showIVA: boolean = true
): FilterKitWithPrices => {
  const enrichedKit: FilterKitWithPrices = {
    ...kit,
  };

  // Obtener descuentos del cliente
  const clientDiscounts = typeof window !== 'undefined' ? getClientDiscountsArray() : [];

  // Función auxiliar para procesar un filtro
  const processFilter = (article: any, filterCode: string): FilterInfoWithPrice | undefined => {
    if (!article) return undefined;

    const brand = brands[article.agru];
    const erpOriginalName = brand?.erp_original_name;
    let discount = Number(getDiscountForBrand(erpOriginalName, clientDiscounts));
    const noDiscount = article.kg_por_unidad >= 15;
    if (noDiscount) discount = 0;

    const priceWithoutVAT = Number(article.pr) || 0;
    const priceWithVAT = Math.round(priceWithoutVAT * 1.21);
    const netPriceWithoutVAT = Math.round(priceWithoutVAT * (1 - discount / 100));
    const netPriceWithVAT = Math.round(netPriceWithoutVAT * 1.21);

    return {
      code: filterCode,
      description: article.d,
      priceWithoutVAT,
      priceWithVAT,
      stock: article.s,
      discount: noDiscount ? 0 : discount,
      netPriceWithoutVAT,
      netPriceWithVAT,
    };
  };

  // Buscar filtro de aceite
  const oilFilterArticle = availableArticles.find(
    (article: any) => article.id?.toLowerCase() === kit.oilFilterCode.toLowerCase()
  );
  if (oilFilterArticle) {
    const oilFilter = processFilter(oilFilterArticle, kit.oilFilterCode);
    if (oilFilter) {
      enrichedKit.oilFilter = oilFilter;
    }
  }

  // Buscar filtro de aire
  const airFilterArticle = availableArticles.find(
    (article: any) => article.id?.toLowerCase() === kit.airFilterCode.toLowerCase()
  );
  if (airFilterArticle) {
    const airFilter = processFilter(airFilterArticle, kit.airFilterCode);
    if (airFilter) {
      enrichedKit.airFilter = airFilter;
    }
  }

  // Buscar filtro de combustible (opcional)
  if (kit.fuelFilterCode) {
    const fuelFilterArticle = availableArticles.find(
      (article: any) => article.id?.toLowerCase() === kit.fuelFilterCode?.toLowerCase()
    );
    if (fuelFilterArticle) {
      const fuelFilter = processFilter(fuelFilterArticle, kit.fuelFilterCode);
      if (fuelFilter) {
        enrichedKit.fuelFilter = fuelFilter;
      }
    }
  }

  // Buscar filtro de cabina (opcional)
  if (kit.cabinFilterCode) {
    const cabinFilterArticle = availableArticles.find(
      (article: any) => article.id?.toLowerCase() === kit.cabinFilterCode?.toLowerCase()
    );
    if (cabinFilterArticle) {
      const cabinFilter = processFilter(cabinFilterArticle, kit.cabinFilterCode);
      if (cabinFilter) {
        enrichedKit.cabinFilter = cabinFilter;
      }
    }
  }

  // Calcular precio total del kit (usando precios netos si hay descuento)
  let totalPriceWithoutVAT = 0;
  let totalPriceWithVAT = 0;
  let totalNetPriceWithoutVAT = 0;
  let totalNetPriceWithVAT = 0;

  if (enrichedKit.oilFilter) {
    totalPriceWithoutVAT += enrichedKit.oilFilter.priceWithoutVAT;
    totalPriceWithVAT += enrichedKit.oilFilter.priceWithVAT;
    totalNetPriceWithoutVAT += enrichedKit.oilFilter.netPriceWithoutVAT || enrichedKit.oilFilter.priceWithoutVAT;
    totalNetPriceWithVAT += enrichedKit.oilFilter.netPriceWithVAT || enrichedKit.oilFilter.priceWithVAT;
  }
  if (enrichedKit.airFilter) {
    totalPriceWithoutVAT += enrichedKit.airFilter.priceWithoutVAT;
    totalPriceWithVAT += enrichedKit.airFilter.priceWithVAT;
    totalNetPriceWithoutVAT += enrichedKit.airFilter.netPriceWithoutVAT || enrichedKit.airFilter.priceWithoutVAT;
    totalNetPriceWithVAT += enrichedKit.airFilter.netPriceWithVAT || enrichedKit.airFilter.priceWithVAT;
  }
  if (enrichedKit.fuelFilter) {
    totalPriceWithoutVAT += enrichedKit.fuelFilter.priceWithoutVAT;
    totalPriceWithVAT += enrichedKit.fuelFilter.priceWithVAT;
    totalNetPriceWithoutVAT += enrichedKit.fuelFilter.netPriceWithoutVAT || enrichedKit.fuelFilter.priceWithoutVAT;
    totalNetPriceWithVAT += enrichedKit.fuelFilter.netPriceWithVAT || enrichedKit.fuelFilter.priceWithVAT;
  }
  if (enrichedKit.cabinFilter) {
    totalPriceWithoutVAT += enrichedKit.cabinFilter.priceWithoutVAT;
    totalPriceWithVAT += enrichedKit.cabinFilter.priceWithVAT;
    totalNetPriceWithoutVAT += enrichedKit.cabinFilter.netPriceWithoutVAT || enrichedKit.cabinFilter.priceWithoutVAT;
    totalNetPriceWithVAT += enrichedKit.cabinFilter.netPriceWithVAT || enrichedKit.cabinFilter.priceWithVAT;
  }

  // Usar precios netos si hay algún descuento aplicado
  enrichedKit.totalPrice = totalNetPriceWithoutVAT < totalPriceWithoutVAT 
    ? totalNetPriceWithoutVAT 
    : totalPriceWithoutVAT;
  enrichedKit.totalPriceWithVAT = totalNetPriceWithVAT < totalPriceWithVAT 
    ? totalNetPriceWithVAT 
    : totalPriceWithVAT;

  return enrichedKit;
};

/**
 * Enriquece todos los kits con los precios obtenidos del endpoint
 */
export const enrichAllFilterKitsWithPrices = (
  availableArticles: any[],
  showIVA: boolean = true
): FilterKitWithPrices[] => {
  const kits = getFilterKits();
  return kits.map((kit) => enrichFilterKitWithPrices(kit, availableArticles, showIVA));
};

/**
 * Busca kits por código de filtro
 */
export const findKitsByFilterCode = (filterCode: string): FilterKit[] => {
  const code = filterCode.toLowerCase();
  return filterKitsData.filter(
    (kit: FilterKit) =>
      kit.oilFilterCode.toLowerCase() === code ||
      kit.airFilterCode.toLowerCase() === code ||
      kit.fuelFilterCode?.toLowerCase() === code ||
      kit.cabinFilterCode?.toLowerCase() === code
  ) as FilterKit[];
};

/**
 * Busca kits por nombre de vehículo (búsqueda parcial)
 */
export const searchKitsByVehicleName = (searchTerm: string): FilterKit[] => {
  const term = searchTerm.toLowerCase();
  return filterKitsData.filter(
    (kit: FilterKit) =>
      kit.vehicleName.toLowerCase().includes(term) ||
      kit.vehicleBrand?.toLowerCase().includes(term) ||
      kit.vehicleModel?.toLowerCase().includes(term) ||
      kit.description.toLowerCase().includes(term)
  ) as FilterKit[];
};

