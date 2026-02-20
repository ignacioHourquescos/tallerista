import React, { useEffect, useState, useContext } from 'react';
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Styled } from './styles';
import { Styled as ProductCardStyled, StyledInputRoot, StyledInput, StyledButton } from '@/common/components/ProductCard';
import ProductCard from '@/common/components/ProductCard';
import KitMiddleContent from './KitMiddleContent';
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
            
            const middleContent = (
              <KitMiddleContent
                kit={kit}
                images={images}
                currentIndex={currentIdx}
                onIndexChange={(newIdx) => {
                  setCurrentImageIndex(prev => ({
                    ...prev,
                    [kit.id]: newIdx
                  }));
                }}
              />
            );
            
            const footerContent = (
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
              <ProductCardStyled.QuantityAndButtonContainer>
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
                    <ProductCardStyled.FirstRow>
                        <ProductCardStyled.QuantityContainer>
                          <ProductCardStyled.QuantityInput>
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
                          </ProductCardStyled.QuantityInput>
                        </ProductCardStyled.QuantityContainer>
                        <ProductCardStyled.AddButton
                          onClick={() => handleAddKitToCart(kit)}
                          disabled={isDisabled}
                          title={isDisabled ? 'Seleccionar al menos 2 filtros por auto' : ''}
                        >
                          {isDisabled ? 'Seleccionar al menos 2 filtros' : 'Agregar'}
                        </ProductCardStyled.AddButton>
                      </ProductCardStyled.FirstRow>
                  );
                })()}
              </ProductCardStyled.QuantityAndButtonContainer>
              </Styled.BottomSection>
            );
            
            return (
              <ProductCard
                key={kit.id}
                title={kit.vehicleName}
                subtitle={kit.description}
                middleContent={middleContent}
                footerContent={footerContent}
              />
            );
          })}
      </Styled.KitsGrid>
    </Styled.Container>
  );
};

export default FilterKitsList;
