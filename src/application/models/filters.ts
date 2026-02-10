/**
 * Modelo para filtros individuales
 * Cada filtro tiene un código único y puede tener una imagen asociada
 */

export interface Filter {
  /** Código único del filtro */
  code: string;
  /** URL de la imagen del filtro */
  imageUrl?: string;
  /** Descripción del filtro (opcional) */
  description?: string;
  /** Tipo de filtro (opcional): oil, air, fuel, cabin */
  type?: 'oil' | 'air' | 'fuel' | 'cabin';
}

