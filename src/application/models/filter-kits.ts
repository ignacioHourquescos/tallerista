/**
 * Modelo para kits de filtros
 * Un kit está compuesto por filtro de aceite, filtro de aire, filtro de combustible (opcional) y filtro de cabina (opcional)
 */

export interface FilterKit {
  /** ID único del kit */
  id: string;
  /** Nombre del vehículo */
  vehicleName: string;
  /** Descripción del kit */
  description: string;
  /** URL de la imagen del kit */
  imageUrl: string;
  /** Código del filtro de aceite (obligatorio) */
  oilFilterCode: string;
  /** Código del filtro de aire (obligatorio) */
  airFilterCode: string;
  /** Código del filtro de combustible (opcional) */
  fuelFilterCode?: string;
  /** Código del filtro de cabina (opcional) */
  cabinFilterCode?: string;
  /** Marca del vehículo (opcional) */
  vehicleBrand?: string;
  /** Modelo del vehículo (opcional) */
  vehicleModel?: string;
  /** Año del vehículo (opcional) */
  vehicleYear?: string;
  /** Tipo de vehículo (opcional) - ej: "auto", "camioneta" */
  type?: string;
}

/**
 * Kit de filtros con información de precios obtenida del endpoint
 */
export interface FilterKitWithPrices extends FilterKit {
  /** Información del filtro de aceite con precio */
  oilFilter?: FilterInfoWithPrice;
  /** Información del filtro de aire con precio */
  airFilter?: FilterInfoWithPrice;
  /** Información del filtro de combustible con precio (opcional) */
  fuelFilter?: FilterInfoWithPrice;
  /** Información del filtro de cabina con precio (opcional) */
  cabinFilter?: FilterInfoWithPrice;
  /** Precio total del kit (suma de todos los filtros) */
  totalPrice?: number;
  /** Precio total del kit con IVA */
  totalPriceWithVAT?: number;
}

/**
 * Información de un filtro con su precio
 */
export interface FilterInfoWithPrice {
  /** Código del filtro */
  code: string;
  /** Descripción del filtro */
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

