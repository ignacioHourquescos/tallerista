import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { CartContext } from '@/context/CartContext';
import { getFilterKits } from '@/application/services/filter-kits';
import { Article } from '@/application/models/order';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

/* ── types ── */

interface GroupedKit {
  kitId: string;
  vehicleName: string;
  description: string;
  kitType?: string; // Tipo de kit (Básico, Completo, Full)
  imageUrl: string;
  filters: {
    code: string;
    article: Article;
    type: 'oil' | 'air' | 'fuel' | 'cabin';
  }[];
  quantity: number;
  totalPrice: number;
}

/* ── styled ── */

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 0.9rem;
`;

const KitCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
`;

const KitHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const KitImage = styled.img`
  width: 64px;
  height: 48px;
  object-fit: contain;
  border-radius: 4px;
 
`;

const KitInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const KitName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const KitDesc = styled.div`
  font-size: 0.75rem;
  color: #666;
`;

const KitQty = styled.div`
  font-size: 0.75rem;
  color: #888;
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const FilterLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const FilterType = styled.span`
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  font-weight: 500;
`;

const FilterCode = styled.span`
  font-weight: 600;
  font-size: 0.85rem;
  color: #222;
`;

const FilterPrice = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: #222;
`;

const KitTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.95rem;
  color: #111;
  padding: 8px 12px;
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
`;

const Footer = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

const GrandTotal = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  color: #111;
  text-align: center;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const ClearButton = styled.button`
  margin-top: 12px;
  width: 100%;
  padding: 10px;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b71c1c;
  }
`;

/* ── helpers ── */

const FILTER_TYPE_LABELS: Record<string, string> = {
  oil: 'Aceite',
  air: 'Aire',
  fuel: 'Combustible',
  cabin: 'Cabina',
};

/* ── component ── */

const OrderPanel: React.FC = () => {
  const { cartItems, removeFromCart, emptyCart } = useContext(CartContext);

  const groupedKits = useMemo(() => {
    const kits = getFilterKits();
    const grouped: Record<string, GroupedKit> = {};

    cartItems.forEach((article) => {
      // Detectar si es un item de kit (empieza con "kit-")
      if (article.id.startsWith('kit-')) {
        // Extraer kitId y kitType del ID (formato: kit-{kitId}-{kitType})
        const parts = article.id.split('-');
        if (parts.length >= 3) {
          const kitId = parts[1];
          const kitType = parts[2]; // El tipo de kit está en la tercera parte
          const kit = kits.find((k) => k.id.toString() === kitId);
          
          if (kit) {
            // Usar el ID completo como clave para agrupar por tipo de kit
            const kitKey = article.id;
            
            if (!grouped[kitKey]) {
              grouped[kitKey] = {
                kitId: kitKey,
                vehicleName: article.descriptionAditional || kit.vehicleName, // Usar descriptionAditional si está disponible
                description: article.description || `Kit ${kit.vehicleName}`,
                kitType: kitType,
                imageUrl: kit.imageUrl,
                filters: [], // Sin desglose de filtros individuales
                quantity: article.quantity || 1,
                totalPrice: (article.netPriceWithVAT || article.priceWithVAT || 0) * (article.quantity || 1),
              };
            } else {
              grouped[kitKey].quantity += article.quantity || 1;
              grouped[kitKey].totalPrice += (article.netPriceWithVAT || article.priceWithVAT || 0) * (article.quantity || 1);
            }
          }
        }
      } else {
        // Lógica original para filtros individuales
        const kit = kits.find(
          (k) =>
            k.oilFilterCode?.toLowerCase() === article.id.toLowerCase() ||
            k.airFilterCode?.toLowerCase() === article.id.toLowerCase() ||
            k.fuelFilterCode?.toLowerCase() === article.id.toLowerCase() ||
            k.cabinFilterCode?.toLowerCase() === article.id.toLowerCase()
        );

        if (kit) {
          const kitKey = kit.id.toString();

          if (!grouped[kitKey]) {
            grouped[kitKey] = {
              kitId: kit.id.toString(),
              vehicleName: kit.vehicleName,
              description: kit.description,
              imageUrl: kit.imageUrl,
              filters: [],
              quantity: 0,
              totalPrice: 0,
            };
          }

          let filterType: 'oil' | 'air' | 'fuel' | 'cabin' = 'oil';
          if (kit.oilFilterCode?.toLowerCase() === article.id.toLowerCase()) filterType = 'oil';
          else if (kit.airFilterCode?.toLowerCase() === article.id.toLowerCase()) filterType = 'air';
          else if (kit.fuelFilterCode?.toLowerCase() === article.id.toLowerCase()) filterType = 'fuel';
          else if (kit.cabinFilterCode?.toLowerCase() === article.id.toLowerCase()) filterType = 'cabin';

          const existing = grouped[kitKey].filters.find((f) => f.type === filterType);
          if (existing) {
            existing.article = {
              ...existing.article,
              quantity: existing.article.quantity + article.quantity,
            };
          } else {
            grouped[kitKey].filters.push({ code: article.id, article: { ...article }, type: filterType });
          }

          const itemTotal = (article.netPriceWithVAT || article.priceWithVAT || 0) * article.quantity;
          grouped[kitKey].totalPrice += itemTotal;
        }
      }
    });

    Object.values(grouped).forEach((kit) => {
      if (kit.filters.length === 0) {
        // Si no hay filtros (es un kit completo), mantener la cantidad del artículo
        // La cantidad ya está establecida arriba
      } else {
        // Para kits con filtros individuales, calcular cantidad mínima
        const quantities = kit.filters.map((f) => f.article.quantity);
        kit.quantity = Math.min(...quantities);
      }
    });

    return Object.values(grouped);
  }, [cartItems]);

  const totalNetWithVAT = cartItems.reduce(
    (sum, item) => sum + (item.netPriceWithVAT || item.priceWithVAT || 0) * (item.quantity || 1),
    0
  );

  return (
    <Panel>
      {cartItems.length === 0 ? (
        <EmptyMessage>No hay productos en el pedido</EmptyMessage>
      ) : (
        <>
          <Content>
            {groupedKits.map((gk) => (
              <KitCard key={gk.kitId}>
                <KitHeader>
                  <KitImage src={gk.imageUrl} alt={gk.vehicleName} />
                  <KitInfo>
                    <KitName>{gk.quantity} x {gk.description}</KitName>
                    <KitDesc>{gk.vehicleName}</KitDesc>
                  </KitInfo>
                </KitHeader>

                {gk.filters.map((f) => (
                  <FilterRow key={f.code}>
                    <FilterLabel>
                      <FilterType>{FILTER_TYPE_LABELS[f.type] || f.type}</FilterType>
                      <FilterCode>{f.code}</FilterCode>
                    </FilterLabel>
                    <FilterPrice>
                      ${((f.article.netPriceWithVAT || f.article.priceWithVAT || 0) * f.article.quantity).toLocaleString('es-AR')}
                    </FilterPrice>
                  </FilterRow>
                ))}

                <KitTotal>
                  <IconButton
                    size="small"
                    sx={{ color: '#d32f2f' }}
                    onClick={() => {
                      // Si es un kit completo (empieza con "kit-"), eliminar el item de kit
                      if (gk.kitId.startsWith('kit-')) {
                        // El kitId ya es el ID completo del artículo, eliminarlo directamente
                        removeFromCart(gk.kitId);
                      } else {
                        // Eliminar filtros individuales
                        gk.filters.forEach((f) => removeFromCart(f.code));
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <span>${gk.totalPrice.toLocaleString('es-AR')}</span>
                </KitTotal>
              </KitCard>
            ))}
          </Content>

          <Footer>
            <GrandTotal>Total: ${totalNetWithVAT.toLocaleString('es-AR')}</GrandTotal>
            <ClearButton onClick={emptyCart}>Vaciar pedido</ClearButton>
          </Footer>
        </>
      )}
    </Panel>
  );
};

export default OrderPanel;

