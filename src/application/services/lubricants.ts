import { Lubricant, LubricantWithPrices, LubricantInfoWithPrice } from '../models/lubricants';
import lubricantsData from '../../data/lubricants.json';
import { brands } from '../models/brands';

/**
 * Obtiene todos los lubricantes desde el JSON hardcodeado
 */
export const getLubricants = (): Lubricant[] => {
  return lubricantsData as Lubricant[];
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
 * Obtiene un lubricante por su ID
 */
export const getLubricantById = (id: string): Lubricant | undefined => {
  return lubricantsData.find((lubricant: Lubricant) => lubricant.id === id) as Lubricant | undefined;
};

/**
 * Cruza el código de un lubricante con los artículos disponibles del endpoint
 * para obtener el precio (considerando descuentos del cliente)
 */
export const enrichLubricantWithPrices = (
  lubricant: Lubricant,
  availableArticles: any[],
  showIVA: boolean = true
): LubricantWithPrices => {
  const enrichedLubricant: LubricantWithPrices = {
    ...lubricant,
  };

  // Obtener descuentos del cliente
  const clientDiscounts = typeof window !== 'undefined' ? getClientDiscountsArray() : [];

  // Buscar el artículo del lubricante por código
  const lubricantArticle = availableArticles.find(
    (article: any) => article.id?.toLowerCase() === lubricant.code.toLowerCase()
  );

  if (lubricantArticle) {
    const brand = brands[lubricantArticle.agru];
    const erpOriginalName = brand?.erp_original_name;
    let discount = Number(getDiscountForBrand(erpOriginalName, clientDiscounts));
    const noDiscount = lubricantArticle.kg_por_unidad >= 15;
    if (noDiscount) discount = 0;

    const priceWithoutVAT = Number(lubricantArticle.pr) || 0;
    const priceWithVAT = Math.round(priceWithoutVAT * 1.21);
    const netPriceWithoutVAT = Math.round(priceWithoutVAT * (1 - discount / 100));
    const netPriceWithVAT = Math.round(netPriceWithoutVAT * 1.21);

    const lubricantInfo: LubricantInfoWithPrice = {
      code: lubricant.code,
      description: lubricantArticle.d,
      priceWithoutVAT,
      priceWithVAT,
      stock: lubricantArticle.s,
      discount: noDiscount ? 0 : discount,
      netPriceWithoutVAT,
      netPriceWithVAT,
    };

    enrichedLubricant.article = lubricantInfo;
    enrichedLubricant.priceWithoutVAT = priceWithoutVAT;
    enrichedLubricant.priceWithVAT = priceWithVAT;
    enrichedLubricant.netPriceWithoutVAT = netPriceWithoutVAT;
    enrichedLubricant.netPriceWithVAT = netPriceWithVAT;
  }

  return enrichedLubricant;
};

/**
 * Enriquece todos los lubricantes con los precios obtenidos del endpoint
 */
export const enrichAllLubricantsWithPrices = (
  availableArticles: any[],
  showIVA: boolean = true
): LubricantWithPrices[] => {
  const lubricants = getLubricants();
  return lubricants.map((lubricant) => enrichLubricantWithPrices(lubricant, availableArticles, showIVA));
};

