import React, { useContext, useState, useCallback } from 'react';
import Head from 'next/head';
import styled, { css } from 'styled-components';
import FilterListIcon from '@mui/icons-material/FilterList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartContext } from '@/context/CartContext';
import { useView, ViewMode } from '@/context/ViewContext';
import OrderPanel from './OrderPanel';
import FiltersPanel from './FiltersPanel';

/* ── styled components ── */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const TopRow = styled.div`
  display: flex;
  flex-shrink: 0;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background-color: #f5f5f5;
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 100%;
  padding-bottom: 0;
  padding-top: 1rem;
`;

const BrandTitle = styled.h1`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  padding-top:1rem;
  letter-spacing: 0.3em;
  color: #1a1a1a;
  text-transform: uppercase;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.2;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e0e0e0;
  position: relative;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 10px 24px;
  border: none;
  background: none;
  font-size: 0.85rem;
  font-weight: ${(p) => (p.$active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  color: ${(p) => (p.$active ? '#1a1a1a' : '#666')};
  position: relative;
  border-bottom: 3px solid ${(p) => (p.$active ? '#1a1a1a' : 'transparent')};
  margin-bottom: -2px;
  z-index: 2;

  &:hover {
    color: #1a1a1a;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(p) => (p.$active ? '#1a1a1a' : '#333')};
  padding: 8px 12px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${(p) => (p.$active ? '#1a1a1a' : 'transparent')};
    transition: background-color 0.2s;
  }

  &:hover {
    color: #1a1a1a;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.2em;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  visibility: ${(p) => (p.$visible ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
`;

interface SidePanelProps {
  $open: boolean;
  $side: 'left' | 'right';
}

const SidePanel = styled.aside<SidePanelProps>`
  position: fixed;
  top: 64px;
  ${(p) => (p.$side === 'left' ? 'left: 0' : 'right: 0')};
  width: ${(p) => (p.$open ? '350px' : '0')};
  height: calc(100vh - 64px);
  flex-shrink: 0;
  border-left: ${(p) => (p.$side === 'right' && p.$open ? '1px solid #e0e0e0' : 'none')};
  border-right: ${(p) => (p.$side === 'left' && p.$open ? '1px solid #e0e0e0' : 'none')};
  overflow: hidden;
  transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: ${(p) => (p.$open && p.$side === 'left' ? '2px 0 8px rgba(0, 0, 0, 0.15)' : p.$open && p.$side === 'right' ? '-2px 0 8px rgba(0, 0, 0, 0.15)' : 'none')};
  transform: ${(p) => {
    if (!p.$open) {
      return p.$side === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
    }
    return 'translateX(0)';
  }};

  @media (max-width: 768px) {
    width: ${(p) => (p.$open ? '280px' : '0')};
  }
`;

interface MainContentProps {
  $panelOpen: boolean;
}

const MainContent = styled.main<MainContentProps>`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  background-color: #fafafa;
  width: 100%;
  position: relative;
  z-index: 1;
`;

/* ── component ── */

export interface IMainLayout {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<IMainLayout> = ({ children, title = 'Renova - Cotizador' }) => {
  const { cartIsVisible, setCartIsVisible, cartItems } = useContext(CartContext);
  const { activeView, setActiveView } = useView();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const itemPrice = item.netPriceWithVAT || item.priceWithVAT || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const handleToggleFilters = useCallback(() => {
    if (!filtersOpen) {
      // Abrir filtros → cerrar pedido
      setCartIsVisible(false);
      setFiltersOpen(true);
    } else {
      setFiltersOpen(false);
    }
  }, [filtersOpen, setCartIsVisible]);

  const handleToggleOrder = useCallback(() => {
    if (!cartIsVisible) {
      // Abrir pedido → cerrar filtros
      setFiltersOpen(false);
      setCartIsVisible(true);
    } else {
      setCartIsVisible(false);
    }
  }, [cartIsVisible, setCartIsVisible]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" key="desc" content="Cotizador de productos Renova" />
      </Head>

      <PageWrapper>
        {/* Fila superior */}
        <TopRow>
          <Header>
            <HeaderLeft>
              <ToggleButton $active={filtersOpen} onClick={handleToggleFilters}>
                <IconWrapper>
                  <FilterListIcon fontSize="small" />
                </IconWrapper>
                {filtersOpen ? 'Filtros abiertos' : 'Filtros de búsqueda'}
              </ToggleButton>
            </HeaderLeft>
            <HeaderCenter>
              <BrandTitle>Tallerista</BrandTitle>
              <TabsContainer>
                <TabButton
                  $active={activeView === 'kits'}
                  onClick={() => setActiveView('kits')}
                >
                  Kits
                </TabButton>
                <TabButton
                  $active={activeView === 'lubricantes'}
                  onClick={() => setActiveView('lubricantes')}
                >
                  Lubricantes
                </TabButton>
              </TabsContainer>
            </HeaderCenter>
            <HeaderRight>
              <ToggleButton $active={cartIsVisible} onClick={handleToggleOrder}>
                <IconWrapper>
                  <ShoppingCartIcon fontSize="small" />
                </IconWrapper>
                {cartIsVisible ? 'Pedido abierto' : 'Mi pedido'}
                {totalItems > 0 && (
                  <>
                    {' '}({totalItems})
                    {totalPrice > 0 && ` - $${totalPrice.toLocaleString('es-AR')}`}
                  </>
                )}
              </ToggleButton>
            </HeaderRight>
          </Header>
        </TopRow>

        {/* Fila inferior */}
        <Body>
          <Overlay 
            $visible={filtersOpen || cartIsVisible}
            onClick={() => {
              if (filtersOpen) setFiltersOpen(false);
              if (cartIsVisible) setCartIsVisible(false);
            }}
          />
          
          <SidePanel $open={filtersOpen} $side="left">
            <FiltersPanel />
          </SidePanel>

          <MainContent $panelOpen={filtersOpen || cartIsVisible}>
            {children}
          </MainContent>

          <SidePanel $open={cartIsVisible} $side="right">
            <OrderPanel />
          </SidePanel>
        </Body>
      </PageWrapper>
    </>
  );
};

export default MainLayout;
