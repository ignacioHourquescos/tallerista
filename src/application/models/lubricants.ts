/**
 * Modelo para lubricantes
 * Un lubricante es un producto simple sin kit, solo el producto en sí
 */

export interface Lubricant {
  /** ID único del lubricante */
  id: string;
  /** Código del lubricante */
  code: string;
  /** Descripción del lubricante */
  description: string;
  /** Graduación (ej: "5W40") */
  graduation?: string;
  /** Presentación (ej: "200L") o objeto con opciones de presentación (ej: { unit: "0%", box: "10%", promo: "15%" }) */
  presentation?: string | Record<string, string>;
  /** Tipo de lubricante (ej: "mineral") */
  type?: string;
  /** Norma (ej: "API SN") */
  norm?: string;
  /** URL de la imagen del lubricante */
  imageUrl?: string;
}

/**
 * Lubricante con información de precios obtenida del endpoint
 */
export interface LubricantWithPrices extends Lubricant {
  /** Información del lubricante con precio */
  article?: LubricantInfoWithPrice;
  /** Precio sin IVA */
  priceWithoutVAT?: number;
  /** Precio con IVA */
  priceWithVAT?: number;
  /** Precio neto sin IVA (con descuento) */
  netPriceWithoutVAT?: number;
  /** Precio neto con IVA (con descuento) */
  netPriceWithVAT?: number;
}

/**
 * Información de un lubricante con su precio
 */
export interface LubricantInfoWithPrice {
  /** Código del lubricante */
  code: string;
  /** Descripción del lubricante */
  description?: string;
  /** Precio sin IVA */
  priceWithoutVAT: number;
  /** Precio con IVA */
  priceWithVAT: number;
  /** Stock disponible */
  stock?: number;
  /** Descuento aplicado */
  discount?: number;
  /** Precio neto sin IVA (con descuento) */
  netPriceWithoutVAT?: number;
  /** Precio neto con IVA (con descuento) */
  netPriceWithVAT?: number;
}

