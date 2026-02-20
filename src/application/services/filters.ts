import filtersData from '../../data/filters.json';
import { Filter } from '../models/filters';

/**
 * Obtiene todos los filtros desde el JSON
 */
export const getAllFilters = (): Filter[] => {
  return filtersData as Filter[];
};

/**
 * Obtiene un filtro por su código
 */
export const getFilterByCode = (code: string): Filter | undefined => {
  if (!code) return undefined;
  const filter = filtersData.find(
    (f) => f.code?.toLowerCase() === code.toLowerCase()
  );
  return filter as Filter | undefined;
};

/**
 * Obtiene la URL de la imagen de un filtro por su código
 */
export const getFilterImageUrl = (code: string): string | undefined => {
  const filter = getFilterByCode(code);
  return filter?.imageUrl;
};

/**
 * Obtiene todos los filtros de un tipo específico
 */
export const getFiltersByType = (type: 'oil' | 'air' | 'fuel' | 'cabin'): Filter[] => {
  return filtersData.filter((f) => f.type === type) as Filter[];
};

