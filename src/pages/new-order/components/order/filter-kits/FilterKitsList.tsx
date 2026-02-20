import React, { useEffect, useState, useContext } from 'react';
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import AirIcon from '@mui/icons-material/Air';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Styled } from './styles';
import { enrichAllFilterKitsWithPrices } from '@/application/services/filter-kits';
import { FilterKitWithPrices } from '@/application/models/filter-kits';
import { CartContext } from '@/context/CartContext';
import { useFilter } from '@/context/FilterContext';
import { getFilterImageUrl } from '@/application/services/filters';

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
  const [selectedKitType, setSelectedKitType] = useState<Record<string, 'basic' | 'complete' | 'full'>>({});
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
      const initialSelectedKitType: Record<string, 'basic' | 'complete' | 'full'> = {};
      enrichedKits.forEach((kit) => {
        initialOil[kit.id] = true; // Aceite marcado por defecto
        initialAir[kit.id] = true; // Aire marcado por defecto
        initialFuel[kit.id] = false; // Combustible NO marcado por defecto
        initialCabin[kit.id] = false; // Cabina NO marcado por defecto
        initialQuantities[kit.id] = 1;
        initialImageIndex[kit.id] = 0; // Siempre empezar con la imagen del vehículo (índice 0)
        initialSelectedKitType[kit.id] = 'complete'; // Kit completo seleccionado por defecto
      });
      setIncludeOilFilterByKit(initialOil);
      setIncludeAirFilterByKit(initialAir);
      setIncludeFuelFilterByKit(initialFuel);
      setIncludeCabinFilterByKit(initialCabin);
      setKitQuantities(initialQuantities);
      setCurrentImageIndex(initialImageIndex);
      setSelectedKitType(initialSelectedKitType);
    }
  }, [availableArticles, showIVA, brandFilter]);


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
    const kitType = selectedKitType[kit.id] || 'complete';
    const quantity = kitQuantities[kit.id] || 1;

    // Determinar el nombre del tipo de kit
    let kitTypeName = '';
    if (kitType === 'basic') {
      kitTypeName = 'Básico';
    } else if (kitType === 'complete') {
      kitTypeName = 'Completo';
    } else if (kitType === 'full') {
      kitTypeName = 'Full';
    }

    // Calcular el precio total del kit según el tipo seleccionado
    let totalPriceWithoutVAT = 0;
    let totalPriceWithVAT = 0;

    // Kit Básico: Aceite + Aire
    if (kitType === 'basic') {
      if (kit.oilFilter) {
        totalPriceWithoutVAT += kit.oilFilter.priceWithoutVAT || 0;
        totalPriceWithVAT += kit.oilFilter.priceWithVAT || 0;
      }
      if (kit.airFilter) {
        totalPriceWithoutVAT += kit.airFilter.priceWithoutVAT || 0;
        totalPriceWithVAT += kit.airFilter.priceWithVAT || 0;
      }
    }
    // Kit Completo: Aceite + Aire + Comb
    else if (kitType === 'complete') {
      if (kit.oilFilter) {
        totalPriceWithoutVAT += kit.oilFilter.priceWithoutVAT || 0;
        totalPriceWithVAT += kit.oilFilter.priceWithVAT || 0;
      }
      if (kit.airFilter) {
        totalPriceWithoutVAT += kit.airFilter.priceWithoutVAT || 0;
        totalPriceWithVAT += kit.airFilter.priceWithVAT || 0;
      }
      if (kit.fuelFilter) {
        totalPriceWithoutVAT += kit.fuelFilter.priceWithoutVAT || 0;
        totalPriceWithVAT += kit.fuelFilter.priceWithVAT || 0;
      }
    }
    // Kit Full: Aceite + Aire + Comb + Cabina
    else if (kitType === 'full') {
      if (kit.oilFilter) {
        totalPriceWithoutVAT += kit.oilFilter.priceWithoutVAT || 0;
        totalPriceWithVAT += kit.oilFilter.priceWithVAT || 0;
      }
      if (kit.airFilter) {
        totalPriceWithoutVAT += kit.airFilter.priceWithoutVAT || 0;
        totalPriceWithVAT += kit.airFilter.priceWithVAT || 0;
      }
      if (kit.fuelFilter) {
        totalPriceWithoutVAT += kit.fuelFilter.priceWithoutVAT || 0;
        totalPriceWithVAT += kit.fuelFilter.priceWithVAT || 0;
      }
      if (kit.cabinFilter) {
        totalPriceWithoutVAT += kit.cabinFilter.priceWithoutVAT || 0;
        totalPriceWithVAT += kit.cabinFilter.priceWithVAT || 0;
      }
    }

    // Crear el item del kit para el carrito
    const kitCartItem = {
      id: `kit-${kit.id}-${kitType}`, // ID único para el kit
      description: `Kit ${kitTypeName}`, // Solo el tipo de kit
      descriptionAditional: kit.vehicleName, // Nombre del vehículo
      agrupation: '',
      ubication: '',
      priceWithoutVAT: totalPriceWithoutVAT,
      priceWithVAT: totalPriceWithVAT,
      discountPercentage: 0,
      netPriceWithoutVAT: totalPriceWithoutVAT,
      netPriceWithVAT: totalPriceWithVAT,
      stock: 999, // Stock ilimitado para kits
      quantity: quantity,
    };

    // Agregar el kit al carrito
    addToCart(kitCartItem);
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
                      let IconComponent = null;
                      if (image.type === 'oil') {
                        IconComponent = OilBarrelIcon;
                      } else if (image.type === 'air') {
                        IconComponent = AirIcon;
                      } else if (image.type === 'fuel') {
                        IconComponent = LocalGasStationIcon;
                      } else if (image.type === 'cabin') {
                        IconComponent = FilterAltIcon;
                      }
                      
                      if (!IconComponent) return null;
                      
                      return (
                        <Styled.CarouselFilterIcon
                          key={idx}
                          $active={isActive}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => ({ ...prev, [kit.id]: idx }));
                          }}
                        >
                          <IconComponent fontSize="small" />
                        </Styled.CarouselFilterIcon>
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
              {/* Sección inferior: Precios y acciones */}
              <Styled.BottomSection>
              {/* Primera fila: Precios de los 3 kits */}
              <Styled.PriceSection>
                {(() => {
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

                  // Calcular precio Kit Básico (Aceite + Aire)
                  let basicKitPrice = 0;
                  if (kit.oilFilter) {
                    basicKitPrice += showIVA
                      ? kit.oilFilter.priceWithVAT
                      : kit.oilFilter.priceWithoutVAT;
                  }
                  if (kit.airFilter) {
                    basicKitPrice += showIVA
                      ? kit.airFilter.priceWithVAT
                      : kit.airFilter.priceWithoutVAT;
                  }

                  // Calcular precio Kit Completo (Aceite + Aire + Comb)
                  let completeKitPrice = basicKitPrice;
                  if (kit.fuelFilter) {
                    completeKitPrice += showIVA
                      ? kit.fuelFilter.priceWithVAT
                      : kit.fuelFilter.priceWithoutVAT;
                  }

                  // Calcular precio Kit Full (Aceite + Aire + Comb + Cabina) sin descuento
                  let fullKitPrice = completeKitPrice;
                  if (kit.cabinFilter) {
                    fullKitPrice += showIVA
                      ? kit.cabinFilter.priceWithVAT
                      : kit.cabinFilter.priceWithoutVAT;
                  }

                  const currentSelectedType = selectedKitType[kit.id] || 'complete';

                  return (
                    <Styled.PriceContainer>
                      {/* Kit Básico */}
                      <Styled.KitPriceColumn
                        $selected={currentSelectedType === 'basic'}
                        onClick={() => setSelectedKitType(prev => ({ ...prev, [kit.id]: 'basic' }))}
                      >
                        <Styled.KitPriceLabel $selected={currentSelectedType === 'basic'}>Básico</Styled.KitPriceLabel>
                        <Styled.KitPriceValue>
                          {formatPrice(basicKitPrice)}
                          {!showIVA && (
                            <sup style={{ fontSize: '0.7em', marginLeft: 2 }}>+ IVA</sup>
                          )}
                        </Styled.KitPriceValue>
                      </Styled.KitPriceColumn>

                      {/* Kit Completo */}
                      <Styled.KitPriceColumn
                        $selected={currentSelectedType === 'complete'}
                        onClick={() => setSelectedKitType(prev => ({ ...prev, [kit.id]: 'complete' }))}
                      >
                        <Styled.KitPriceLabel $selected={currentSelectedType === 'complete'}>Completo</Styled.KitPriceLabel>
                        <Styled.KitPriceValue>
                          {formatPrice(completeKitPrice)}
                          {!showIVA && (
                            <sup style={{ fontSize: '0.7em', marginLeft: 2 }}>+ IVA</sup>
                          )}
                        </Styled.KitPriceValue>
                      </Styled.KitPriceColumn>

                      {/* Kit Full */}
                      <Styled.KitPriceColumn
                        $selected={currentSelectedType === 'full'}
                        onClick={() => setSelectedKitType(prev => ({ ...prev, [kit.id]: 'full' }))}
                      >
                        <Styled.KitPriceLabel $selected={currentSelectedType === 'full'}>Full</Styled.KitPriceLabel>
                        <Styled.KitPriceValue>
                          {formatPrice(fullKitPrice)}
                          {!showIVA && (
                            <sup style={{ fontSize: '0.7em', marginLeft: 2 }}>+ IVA</sup>
                          )}
                        </Styled.KitPriceValue>
                      </Styled.KitPriceColumn>
                    </Styled.PriceContainer>
                  );
                })()}
              </Styled.PriceSection>

              {/* Segunda fila: Contador y botón de agregar */}
              <Styled.QuantityAndButtonContainer>
                {(() => {
                  const kitType = selectedKitType[kit.id] || 'complete';
                  
                  // Determinar qué filtros incluir según el tipo de kit seleccionado
                  let includeOil = false;
                  let includeAir = false;
                  let includeFuel = false;
                  let includeCabin = false;
                  
                  if (kitType === 'basic') {
                    includeOil = true;
                    includeAir = true;
                  } else if (kitType === 'complete') {
                    includeOil = true;
                    includeAir = true;
                    includeFuel = true;
                  } else if (kitType === 'full') {
                    includeOil = true;
                    includeAir = true;
                    includeFuel = true;
                    includeCabin = true;
                  }
                  
                  // Contar filtros disponibles según el tipo de kit seleccionado
                  const selectedCount = [
                    includeOil && kit.oilFilter && (kit.oilFilter.stock || 0) > 0,
                    includeAir && kit.airFilter && (kit.airFilter.stock || 0) > 0,
                    includeFuel && kit.fuelFilter && kit.fuelFilterCode && (kit.fuelFilter.stock || 0) > 0,
                    includeCabin && kit.cabinFilterCode && (kit.cabinFilter?.stock || 0) > 0,
                  ].filter(Boolean).length;
                  
                  const isDisabled = selectedCount < 2;
                  
                  return (
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
                        <Styled.AddButton
                          onClick={() => handleAddKitToCart(kit)}
                          disabled={isDisabled}
                          title={isDisabled ? 'Seleccionar al menos 2 filtros por auto' : ''}
                        >
                          {isDisabled ? 'Seleccionar al menos 2 filtros' : 'Agregar'}
                        </Styled.AddButton>
                      </Styled.FirstRow>
                  );
                })()}
              </Styled.QuantityAndButtonContainer>
              </Styled.BottomSection>
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
  color: #1a1a1a;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: none;
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
  border-color: #e0e0e0;
  background:rgb(255, 255, 255);
  color:rgb(14, 14, 14);
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
    background: #fff5e6;
    border-color: #FF8C00;
    color: #FF8C00;
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: 1;
  }
`;

