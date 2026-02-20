import React, { useEffect, useState, useContext } from 'react';
import { Unstable_NumberInput as BaseNumberInput } from '@mui/base/Unstable_NumberInput';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Styled } from './styles';
import { StyledInputRoot, StyledInput, StyledButton, PresentationButtons } from '@/common/components/ProductCard';
import ProductCard from '@/common/components/ProductCard';
import LubricantMiddleContent from './LubricantMiddleContent';
import { enrichAllLubricantsWithPrices } from '@/application/services/lubricants';
import { LubricantWithPrices } from '@/application/models/lubricants';
import { CartContext } from '@/context/CartContext';
import { useFilter } from '@/context/FilterContext';

export interface ILubricantsList {
  availableArticles: any[];
  showIVA: boolean;
}

const LubricantsList: React.FC<ILubricantsList> = ({
  availableArticles,
  showIVA,
}) => {
  const [lubricantsWithPrices, setLubricantsWithPrices] = useState<LubricantWithPrices[]>([]);
  const [lubricantQuantities, setLubricantQuantities] = useState<Record<string, number>>({});
  const [selectedPresentations, setSelectedPresentations] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { graduationFilter } = useFilter();

  // Marcar como montado después de la hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (availableArticles && availableArticles.length > 0) {
      let enrichedLubricants = enrichAllLubricantsWithPrices(availableArticles, showIVA);
      
      // Filtrar por graduación si hay un filtro activo
      if (graduationFilter && graduationFilter !== 'all') {
        enrichedLubricants = enrichedLubricants.filter(
          (lubricant) => lubricant.graduation?.toLowerCase() === graduationFilter.toLowerCase()
        );
      }
      
      setLubricantsWithPrices(enrichedLubricants);

      // Inicializar cantidades y presentaciones seleccionadas
      const initialQuantities: Record<string, number> = {};
      const initialPresentations: Record<string, string> = {};
      enrichedLubricants.forEach((lubricant) => {
        initialQuantities[lubricant.id] = 1;
        
        // Si tiene presentation como objeto, seleccionar la primera key por defecto
        if (lubricant.presentation && typeof lubricant.presentation === 'object') {
          const keys = Object.keys(lubricant.presentation);
          if (keys.length > 0) {
            initialPresentations[lubricant.id] = keys[0];
          }
        }
      });
      setLubricantQuantities(initialQuantities);
      setSelectedPresentations(initialPresentations);
    }
  }, [availableArticles, showIVA, graduationFilter]);

  const handleAddLubricantToCart = (lubricant: LubricantWithPrices) => {
    if (!lubricant.article) return;

    const quantity = lubricantQuantities[lubricant.id] || 1;
    const article = lubricant.article;

    // Crear el item del lubricante para el carrito
    const lubricantCartItem = {
      id: lubricant.code,
      description: lubricant.description,
      descriptionAditional: '',
      agrupation: '',
      ubication: '',
      priceWithoutVAT: article.priceWithoutVAT,
      priceWithVAT: article.priceWithVAT,
      discountPercentage: article.discount || 0,
      netPriceWithoutVAT: article.netPriceWithoutVAT || article.priceWithoutVAT,
      netPriceWithVAT: article.netPriceWithVAT || article.priceWithVAT,
      stock: article.stock || 0,
      quantity: quantity,
    };

    // Agregar el lubricante al carrito
    addToCart(lubricantCartItem);
  };

  // No renderizar hasta que el componente esté montado (después de la hidratación)
  if (!isMounted || lubricantsWithPrices.length === 0) {
    return null;
  }

  return (
    <Styled.Container>
      <Styled.LubricantsGrid>
        {lubricantsWithPrices.map((lubricant) => {
          const hasPrice = lubricant.article && (lubricant.article.stock || 0) > 0;
          const price = showIVA
            ? (lubricant.article?.netPriceWithVAT || lubricant.article?.priceWithVAT || 0)
            : (lubricant.article?.netPriceWithoutVAT || lubricant.article?.priceWithoutVAT || 0);

          // Verificar si tiene presentation como objeto
          const hasPresentationButtons = 
            lubricant.presentation && 
            typeof lubricant.presentation === 'object' && 
            Object.keys(lubricant.presentation).length > 0;

          const presentationObject = hasPresentationButtons 
            ? lubricant.presentation as Record<string, string>
            : undefined;

          const selectedPresentationKey = selectedPresentations[lubricant.id];

          const footerContent = (
            <>
              <Styled.PriceSection>
                {hasPresentationButtons && presentationObject ? (
                  <PresentationButtons
                    presentation={presentationObject}
                    selectedKey={selectedPresentationKey}
                    onSelect={(key) => {
                      setSelectedPresentations(prev => ({
                        ...prev,
                        [lubricant.id]: key
                      }));
                    }}
                  />
                ) : (
                  <div style={{ 
                    fontSize: '1.2em', 
                    fontWeight: 'bold', 
                    color: '#1a1a1a',
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    {hasPrice ? (
                      <>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(price)}
                        {!showIVA && (
                          <sup style={{ fontSize: '0.7em', marginLeft: 2 }}>+ IVA</sup>
                        )}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </div>
                )}
              </Styled.PriceSection>
              <Styled.QuantityAndButtonContainer>
                <Styled.FirstRow>
                  <Styled.QuantityContainer>
                    <Styled.QuantityInput>
                      <BaseNumberInput
                        onChange={(event, value) => {
                          setLubricantQuantities((prev) => ({
                            ...prev,
                            [lubricant.id]: value || 1,
                          }));
                        }}
                        value={lubricantQuantities[lubricant.id] || 1}
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
                    onClick={() => handleAddLubricantToCart(lubricant)}
                    disabled={!hasPrice}
                    title={!hasPrice ? 'Producto sin stock' : ''}
                  >
                    {!hasPrice ? 'Sin stock' : 'Agregar'}
                  </Styled.AddButton>
                </Styled.FirstRow>
              </Styled.QuantityAndButtonContainer>
            </>
          );

          return (
            <ProductCard
              key={lubricant.id}
              title={lubricant.description}
              subtitle={lubricant.code ? lubricant.code.toUpperCase() : undefined}
              middleContent={<LubricantMiddleContent lubricant={lubricant} />}
              footerContent={footerContent}
            />
          );
        })}
      </Styled.LubricantsGrid>
    </Styled.Container>
  );
};

export default LubricantsList;

