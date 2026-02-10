import React, { useEffect, useState, useContext } from 'react';
import { Checkbox } from '@mui/material';
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Styled } from './styles';
import { enrichAllFilterKitsWithPrices } from '@/application/services/filter-kits';
import { FilterKitWithPrices } from '@/application/models/filter-kits';
import { CartContext } from '@/context/CartContext';
import { useFilter } from '@/context/FilterContext';
import { getFilterImageUrl } from '@/application/services/filters';

// Estilos personalizados para checkboxes más compactos
const CompactCheckbox = styled(Checkbox)`
  padding: 2px !important;
  margin: 0 !important;
  & .MuiSvgIcon-root {
    font-size: 1rem;
  }
`;

export interface IFilterKitsList {
  availableArticles: any[];
  showIVA: boolean;
}

const FilterKitsList: React.FC<IFilterKitsList> = ({
  availableArticles,
  showIVA,
}) => {
  const { brandFilter } = useFilter();
  const [kitsWithPrices, setKitsWithPrices] = useState<FilterKitWithPrices[]>([]);
  const [includeOilFilterByKit, setIncludeOilFilterByKit] = useState<
    Record<string, boolean>
  >({});
  const [includeAirFilterByKit, setIncludeAirFilterByKit] = useState<
    Record<string, boolean>
  >({});
  const [includeFuelFilterByKit, setIncludeFuelFilterByKit] = useState<
    Record<string, boolean>
  >({});
  const [includeCabinFilterByKit, setIncludeCabinFilterByKit] = useState<
    Record<string, boolean>
  >({});
  const [kitQuantities, setKitQuantities] = useState<Record<string, number>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [isMounted, setIsMounted] = useState(false);
  const { addToCart } = useContext(CartContext);

  // Marcar como montado después de la hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (availableArticles && availableArticles.length > 0) {
      let enrichedKits = enrichAllFilterKitsWithPrices(availableArticles, showIVA);
      
      // Filtrar por marca si hay un filtro activo
      if (brandFilter && brandFilter !== 'all') {
        enrichedKits = enrichedKits.filter(
          (kit) => kit.vehicleBrand?.toLowerCase() === brandFilter.toLowerCase()
        );
      }
      
      setKitsWithPrices(enrichedKits);

      // Por defecto: aceite y aire marcados, combustible y cabina NO marcados
      const initialOil: Record<string, boolean> = {};
      const initialAir: Record<string, boolean> = {};
      const initialFuel: Record<string, boolean> = {};
      const initialCabin: Record<string, boolean> = {};
      const initialQuantities: Record<string, number> = {};
      const initialImageIndex: Record<string, number> = {};
      enrichedKits.forEach((kit) => {
        initialOil[kit.id] = true; // Aceite marcado por defecto
        initialAir[kit.id] = true; // Aire marcado por defecto
        initialFuel[kit.id] = false; // Combustible NO marcado por defecto
        initialCabin[kit.id] = false; // Cabina NO marcado por defecto
        initialQuantities[kit.id] = 1;
        initialImageIndex[kit.id] = 0; // Siempre empezar con la imagen del vehículo (índice 0)
      });
      setIncludeOilFilterByKit(initialOil);
      setIncludeAirFilterByKit(initialAir);
      setIncludeFuelFilterByKit(initialFuel);
      setIncludeCabinFilterByKit(initialCabin);
      setKitQuantities(initialQuantities);
      setCurrentImageIndex(initialImageIndex);
    }
  }, [availableArticles, showIVA, brandFilter]);

  // Calcular el descuento basado en la cantidad de filtros seleccionados
  const getFilterQuantityDiscount = (
    includeOil: boolean,
    includeAir: boolean,
    includeFuel: boolean,
    includeCabin: boolean
  ): number => {
    const selectedCount = [includeOil, includeAir, includeFuel, includeCabin].filter(Boolean).length;
    
    // Solo 5% de descuento cuando se completen los 4 filtros
    if (selectedCount === 4) return 5;
    return 0;
  };

  // Función para obtener las imágenes del kit (vehículo + filtros)
  const getKitImages = (kit: FilterKitWithPrices): Array<{ url: string; label: string; type?: 'oil' | 'air' | 'fuel' | 'cabin' }> => {
    const images: Array<{ url: string; label: string; type?: 'oil' | 'air' | 'fuel' | 'cabin' }> = [];
    
    // Imagen del vehículo (siempre primera, índice 0)
    if (kit.imageUrl) {
      images.push({ url: kit.imageUrl, label: kit.vehicleName });
    }
    
    // Imágenes de filtros desde el JSON centralizado
    // Índice 1: Aceite
    if (kit.oilFilterCode) {
      const imageUrl = getFilterImageUrl(kit.oilFilterCode);
      if (imageUrl) {
        images.push({ url: imageUrl, label: 'Filtro de Aceite', type: 'oil' });
      }
    }
    // Índice 2: Aire
    if (kit.airFilterCode) {
      const imageUrl = getFilterImageUrl(kit.airFilterCode);
      if (imageUrl) {
        images.push({ url: imageUrl, label: 'Filtro de Aire', type: 'air' });
      }
    }
    // Índice 3: Combustible
    if (kit.fuelFilterCode) {
      const imageUrl = getFilterImageUrl(kit.fuelFilterCode);
      if (imageUrl) {
        images.push({ url: imageUrl, label: 'Filtro de Combustible', type: 'fuel' });
      }
    }
    // Índice 4: Cabina
    if (kit.cabinFilterCode) {
      const imageUrl = getFilterImageUrl(kit.cabinFilterCode);
      if (imageUrl) {
        images.push({ url: imageUrl, label: 'Filtro de Cabina', type: 'cabin' });
      }
    }
    
    return images;
  };

  const handleAddKitToCart = (kit: FilterKitWithPrices) => {
    const includeOil = includeOilFilterByKit[kit.id];
    const includeAir = includeAirFilterByKit[kit.id];
    const includeFuel = includeFuelFilterByKit[kit.id];
    const includeCabin = includeCabinFilterByKit[kit.id];
    const quantity = kitQuantities[kit.id] || 1;

    // Calcular descuento por cantidad de filtros seleccionados
    const quantityDiscount = getFilterQuantityDiscount(includeOil, includeAir, includeFuel, includeCabin);

    // Función auxiliar para crear el item del carrito desde un artículo
    const createCartItem = (filterCode: string, filterInfo: any, qty: number, additionalDiscount: number = 0) => {
      // Buscar el artículo completo en availableArticles
      const article = availableArticles.find(
        (art: any) => art.id?.toLowerCase() === filterCode.toLowerCase()
      );

      const basePriceWithoutVAT = filterInfo?.priceWithoutVAT || article?.pr || 0;
      const basePriceWithVAT = filterInfo?.priceWithVAT || Math.round(basePriceWithoutVAT * 1.21);
      const existingDiscount = filterInfo?.discount || 0;
      
      // Aplicar el descuento por cantidad sobre el precio base
      // Si hay un descuento individual mayor, usar ese; si no, usar el descuento por cantidad
      const totalDiscount = existingDiscount > additionalDiscount ? existingDiscount : additionalDiscount;
      
      // Calcular precios netos con el descuento aplicado
      const netPriceWithoutVAT = Math.round(basePriceWithoutVAT * (1 - totalDiscount / 100));
      const netPriceWithVAT = Math.round(netPriceWithoutVAT * 1.21);

      return {
        id: filterCode,
        descriptionAditional: article?.da || '',
        description: filterInfo?.description || article?.d || `Filtro ${filterCode}`,
        agrupation: article?.agru || '',
        ubication: article?.UM || '',
        priceWithoutVAT: basePriceWithoutVAT,
        priceWithVAT: basePriceWithVAT,
        discountPercentage: totalDiscount,
        netPriceWithoutVAT: netPriceWithoutVAT,
        netPriceWithVAT: netPriceWithVAT,
        stock: filterInfo?.stock || article?.s || 0,
        quantity: qty,
      };
    };

    // Agregar cada filtro del kit al carrito con la cantidad especificada
    for (let i = 0; i < quantity; i++) {
      if (includeOil && kit.oilFilter) {
        const oilFilterItem = createCartItem(kit.oilFilterCode, kit.oilFilter, 1, quantityDiscount);
        addToCart(oilFilterItem);
      }

      if (includeAir && kit.airFilter) {
        const airFilterItem = createCartItem(kit.airFilterCode, kit.airFilter, 1, quantityDiscount);
        addToCart(airFilterItem);
      }

      if (includeFuel && kit.fuelFilter && kit.fuelFilterCode) {
        const fuelFilterItem = createCartItem(kit.fuelFilterCode, kit.fuelFilter, 1, quantityDiscount);
        addToCart(fuelFilterItem);
      }

      if (includeCabin && kit.cabinFilterCode) {
        // Si hay información del filtro, usarla; si no, crear item básico con el código
        const cabinFilterItem = createCartItem(kit.cabinFilterCode, kit.cabinFilter || null, 1, quantityDiscount);
        addToCart(cabinFilterItem);
      }
    }
  };

  // No renderizar hasta que el componente esté montado (después de la hidratación)
  if (!isMounted || kitsWithPrices.length === 0) {
    return null;
  }

  return (
    <Styled.Container>
      <Styled.KitsGrid>
        {kitsWithPrices.map((kit) => {
            const images = getKitImages(kit);
            const currentIdx = currentImageIndex[kit.id] || 0;
            
            return (
            <Styled.KitCard key={kit.id}>
              <Styled.KitContent>
                <Styled.KitVehicleName>{kit.vehicleName}</Styled.KitVehicleName>
                <Styled.KitDescription>{kit.description}</Styled.KitDescription>
              </Styled.KitContent>
              <Styled.KitImageContainer>
                {images.length <= 1 ? (
                  // Si solo hay una imagen, mostrar sin carrusel
                  <Styled.KitImage
                    src={images[0]?.url || kit.imageUrl || '/placeholder.jpg'}
                    alt={images[0]?.label || kit.vehicleName}
                    onError={(e: any) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                ) : (
                  // Carrusel con múltiples imágenes
                  <>
                    <Styled.CarouselImage
                      src={images[currentIdx]?.url || '/placeholder.jpg'}
                      alt={images[currentIdx]?.label || kit.vehicleName}
                      onError={(e: any) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    {currentIdx > 0 && images[currentIdx]?.type && (
                      <Styled.FilterCodeBadge>
                        {images[currentIdx].type === 'oil' && kit.oilFilterCode}
                        {images[currentIdx].type === 'air' && kit.airFilterCode}
                        {images[currentIdx].type === 'fuel' && kit.fuelFilterCode}
                        {images[currentIdx].type === 'cabin' && kit.cabinFilterCode}
                      </Styled.FilterCodeBadge>
                    )}
                  </>
                )}
              </Styled.KitImageContainer>
              {images.length > 1 && (
                <Styled.CarouselControls>
                  <Styled.CarouselButton
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIdx = (currentIdx - 1 + images.length) % images.length;
                      setCurrentImageIndex(prev => ({
                        ...prev,
                        [kit.id]: newIdx
                      }));
                    }}
                  >
                    ←
                  </Styled.CarouselButton>
                  <Styled.CarouselCheckboxes>
                    {/* Selector de imagen del auto (índice 0) */}
                    <Styled.CarouselVehicleSelector
                      $active={currentIdx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(prev => ({ ...prev, [kit.id]: 0 }));
                      }}
                    >
                      <DirectionsCarIcon fontSize="small" />
                    </Styled.CarouselVehicleSelector>
                    {images.map((image, idx) => {
                      // Índice 0 es el auto, ya lo mostramos arriba
                      if (idx === 0) return null;
                      
                      const isActive = idx === currentIdx;
                      let checked = false;
                      let label = '';
                      if (image.type === 'oil') {
                        checked = !!includeOilFilterByKit[kit.id];
                        label = 'Aceite';
                      } else if (image.type === 'air') {
                        checked = !!includeAirFilterByKit[kit.id];
                        label = 'Aire';
                      } else if (image.type === 'fuel') {
                        checked = !!includeFuelFilterByKit[kit.id];
                        label = 'COMB';
                      } else if (image.type === 'cabin') {
                        checked = !!includeCabinFilterByKit[kit.id];
                        label = 'Cabina';
                      }
                      
                      return (
                        <Styled.CarouselCheckboxWrapper key={idx} $active={isActive}>
                          <Styled.CarouselCheckboxContainer>
                            <CompactCheckbox
                              size="small"
                              checked={checked}
                              disabled={false}
                              onChange={(e) => {
                                e.stopPropagation();
                                // Cambiar imagen del carrusel
                                setCurrentImageIndex(prev => ({ ...prev, [kit.id]: idx }));
                                // Actualizar checkbox correspondiente
                                if (image.type === 'oil') {
                                  setIncludeOilFilterByKit(prev => ({ ...prev, [kit.id]: e.target.checked }));
                                } else if (image.type === 'air') {
                                  setIncludeAirFilterByKit(prev => ({ ...prev, [kit.id]: e.target.checked }));
                                } else if (image.type === 'fuel') {
                                  setIncludeFuelFilterByKit(prev => ({ ...prev, [kit.id]: e.target.checked }));
                                } else if (image.type === 'cabin') {
                                  setIncludeCabinFilterByKit(prev => ({ ...prev, [kit.id]: e.target.checked }));
                                }
                              }}
                            />
                            <Styled.CarouselCheckboxLabel>{label}</Styled.CarouselCheckboxLabel>
                          </Styled.CarouselCheckboxContainer>
                        </Styled.CarouselCheckboxWrapper>
                      );
                    })}
                  </Styled.CarouselCheckboxes>
                  <Styled.CarouselButton
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIdx = (currentIdx + 1) % images.length;
                      setCurrentImageIndex(prev => ({
                        ...prev,
                        [kit.id]: newIdx
                      }));
                    }}
                  >
                    →
                  </Styled.CarouselButton>
                </Styled.CarouselControls>
              )}
            <Styled.KitContent>

              <Styled.QuantityAndButtonContainer>
                <Styled.FirstRow>
                  <Styled.QuantityContainer>
                    <Styled.QuantityInput>
                      <BaseNumberInput
                        onChange={(event, value) => {
                          setKitQuantities((prev) => ({
                            ...prev,
                            [kit.id]: value || 1,
                          }));
                        }}
                        value={kitQuantities[kit.id] || 1}
                        min={1}
                        max={99}
                        slots={{
                          root: StyledInputRoot,
                          input: StyledInput,
                          incrementButton: StyledButton,
                          decrementButton: StyledButton,
                        }}
                        slotProps={{
                          incrementButton: {
                            children: <AddIcon fontSize="small" />,
                            className: 'increment',
                          },
                          decrementButton: {
                            children: <RemoveIcon fontSize="small" />,
                          },
                        }}
                      />
                    </Styled.QuantityInput>
                  </Styled.QuantityContainer>
                  <Styled.PriceSection>
                    {(() => {
                      // Calcular precio según checkboxes marcados
                      let subtotal = 0;
                      
                      const includeOil = includeOilFilterByKit[kit.id];
                      const includeAir = includeAirFilterByKit[kit.id];
                      const includeFuel = includeFuelFilterByKit[kit.id];
                      const includeCabin = includeCabinFilterByKit[kit.id];

                      if (includeOil && kit.oilFilter) {
                        subtotal += showIVA
                          ? kit.oilFilter.priceWithVAT
                          : kit.oilFilter.priceWithoutVAT;
                      }

                      if (includeAir && kit.airFilter) {
                        subtotal += showIVA
                          ? kit.airFilter.priceWithVAT
                          : kit.airFilter.priceWithoutVAT;
                      }

                      if (includeFuel && kit.fuelFilter) {
                        subtotal += showIVA
                          ? kit.fuelFilter.priceWithVAT
                          : kit.fuelFilter.priceWithoutVAT;
                      }

                      if (includeCabin && kit.cabinFilter) {
                        subtotal += showIVA
                          ? kit.cabinFilter.priceWithVAT
                          : kit.cabinFilter.priceWithoutVAT;
                      }

                      // Calcular descuento por cantidad de filtros
                      const quantityDiscount = getFilterQuantityDiscount(includeOil, includeAir, includeFuel, includeCabin);
                      const discountAmount = subtotal * (quantityDiscount / 100);
                      const total = Math.round(subtotal - discountAmount);
                      const hasDiscount = quantityDiscount > 0;

                      // Formatear precios de manera consistente
                      const formatPrice = (price: number) => {
                        if (price <= 0) return 'N/A';
                        return new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(price);
                      };

                      return (
                        <Styled.PriceContainer>
                          {hasDiscount ? (
                            <>
                              <Styled.OriginalPrice>
                                {formatPrice(subtotal)}
                                {!showIVA && (
                                  <sup style={{ fontSize: '0.7em', marginLeft: 2 }}>+ IVA</sup>
                                )}
                              </Styled.OriginalPrice>
                              <Styled.FinalPrice>
                                {formatPrice(total)}
                                {!showIVA && (
                                  <sup style={{ fontSize: '0.7em', marginLeft: 2 }}>+ IVA</sup>
                                )}
                              </Styled.FinalPrice>
                            </>
                          ) : (
                            <Styled.TotalPrice>
                              {formatPrice(total)}
                              {!showIVA && (
                                <sup style={{ fontSize: '0.7em', marginLeft: 2 }}>+ IVA</sup>
                              )}
                            </Styled.TotalPrice>
                          )}
                        </Styled.PriceContainer>
                      );
                    })()}
                  </Styled.PriceSection>
                </Styled.FirstRow>
                {(() => {
                  const includeOil = includeOilFilterByKit[kit.id];
                  const includeAir = includeAirFilterByKit[kit.id];
                  const includeFuel = includeFuelFilterByKit[kit.id];
                  const includeCabin = includeCabinFilterByKit[kit.id];
                  
                  // Calcular subtotal y descuento para el mensaje de bonificación
                  let subtotalForDiscount = 0;
                  
                  if (includeOil && kit.oilFilter) {
                    subtotalForDiscount += showIVA
                      ? kit.oilFilter.priceWithVAT
                      : kit.oilFilter.priceWithoutVAT;
                  }
                  if (includeAir && kit.airFilter) {
                    subtotalForDiscount += showIVA
                      ? kit.airFilter.priceWithVAT
                      : kit.airFilter.priceWithoutVAT;
                  }
                  if (includeFuel && kit.fuelFilter) {
                    subtotalForDiscount += showIVA
                      ? kit.fuelFilter.priceWithVAT
                      : kit.fuelFilter.priceWithoutVAT;
                  }
                  if (includeCabin && kit.cabinFilter) {
                    subtotalForDiscount += showIVA
                      ? kit.cabinFilter.priceWithVAT
                      : kit.cabinFilter.priceWithoutVAT;
                  }
                  
                  const quantityDiscount = getFilterQuantityDiscount(includeOil, includeAir, includeFuel, includeCabin);
                  const discountAmount = Math.round(subtotalForDiscount * (quantityDiscount / 100));
                  const allFiltersSelected = includeOil && includeAir && includeFuel && includeCabin;
                  
                  // Contar filtros seleccionados
                  const selectedCount = [
                    includeOil && kit.oilFilter && (kit.oilFilter.stock || 0) > 0,
                    includeAir && kit.airFilter && (kit.airFilter.stock || 0) > 0,
                    includeFuel && kit.fuelFilter && kit.fuelFilterCode && (kit.fuelFilter.stock || 0) > 0,
                    includeCabin && kit.cabinFilterCode && (kit.cabinFilter?.stock || 0) > 0,
                  ].filter(Boolean).length;
                  
                  const isDisabled = selectedCount < 2;
                  
                  return (
                    <>
                      {allFiltersSelected && quantityDiscount > 0 && (
                        <Styled.DiscountMessage>
                          Bonificación del 5% por kit completo
                        </Styled.DiscountMessage>
                      )}
                      <Styled.AddButton
                        onClick={() => handleAddKitToCart(kit)}
                        disabled={isDisabled}
                        title={isDisabled ? 'Seleccionar al menos 2 filtros por auto' : ''}
                      >
                        {isDisabled ? 'Seleccionar al menos 2 filtros' : 'Agregar'}
                      </Styled.AddButton>
                    </>
                  );
                })()}
              </Styled.QuantityAndButtonContainer>
            </Styled.KitContent>
          </Styled.KitCard>
          );
        })}
      </Styled.KitsGrid>
    </Styled.Container>
  );
};

export default FilterKitsList;

// Estilos para el NumberInput (similar a QuantityInput)
const blue = {
  100: '#daecff',
  200: '#b6daff',
  300: '#66b2ff',
  400: '#3399ff',
  500: '#007fff',
  600: '#0072e5',
  700: '#0059B2',
  800: '#004c99',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')`
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  color: ${grey[500]};
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled('input')`
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.375;
  color: ${grey[900]};
  background: #fff;
  border: 1px solid ${grey[200]};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin: 0 2px;
  padding: 6px 8px;
  outline: 0;
  min-width: 0;
  width: 3rem;
  text-align: center;

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${blue[200]};
  }

  &:focus-visible {
    outline: 0;
  }
`;

const StyledButton = styled('button')`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  line-height: 1.5;
  border: 1px solid;
  border-radius: 999px;
  border-color: ${grey[200]};
  background: ${grey[50]};
  color: ${grey[900]};
  width: 25px;
  height: 25px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    cursor: pointer;
    background: ${blue[500]};
    border-color: ${blue[400]};
    color: ${grey[50]};
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: 1;
  }
`;

