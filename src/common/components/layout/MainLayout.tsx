import React, { useContext, useState, useCallback } from 'react';
import Head from 'next/head';
import styled, { css } from 'styled-components';
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
  height: 48px;
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
  align-items: center;
  justify-content: center;
`;

const SegmentedControl = styled.div`
  display: flex;
  background-color: #e0e0e0;
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
`;

const SegmentButton = styled.button<{ $active: boolean }>`
  padding: 6px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  ${(p) =>
    p.$active
      ? css`
          background-color: #1a1a1a;
          color: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        `
      : css`
          background-color: transparent;
          color: #555;

          &:hover {
            background-color: rgba(0, 0, 0, 0.06);
            color: #1a1a1a;
          }
        `}
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

interface SideTitleProps {
  $open: boolean;
  $side: 'left' | 'right';
}

const SideTitle = styled.div<SideTitleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: ${(p) => (p.$open ? '350px' : '0')};
  overflow: hidden;
  flex-shrink: 0;
  border-left: ${(p) => (p.$side === 'right' && p.$open ? '1px solid #e0e0e0' : 'none')};
  border-right: ${(p) => (p.$side === 'left' && p.$open ? '1px solid #e0e0e0' : 'none')};
  background-color: #fff;
  box-sizing: border-box;
  transition: width 0.3s ease-in-out;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;

  @media (max-width: 768px) {
    width: ${(p) => (p.$open ? '280px' : '0')};
  }
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(p) => (p.$active ? '#1a1a1a' : '#333')};
  padding: 8px 0;
  position: relative;

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

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

interface SidePanelProps {
  $open: boolean;
  $side: 'left' | 'right';
}

const SidePanel = styled.aside<SidePanelProps>`
  width: ${(p) => (p.$open ? '350px' : '0')};
  flex-shrink: 0;
  border-left: ${(p) => (p.$side === 'right' && p.$open ? '1px solid #e0e0e0' : 'none')};
  border-right: ${(p) => (p.$side === 'left' && p.$open ? '1px solid #e0e0e0' : 'none')};
  overflow: hidden;
  transition: width 0.3s ease-in-out;
  background-color: #fff;
  display: flex;
  flex-direction: column;

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
  font-size: ${(p) => (p.$panelOpen ? '0.85em' : '1em')};
  transition: font-size 0.3s ease-in-out;
  background-color: #fafafa;
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
          <SideTitle $open={filtersOpen} $side="left">
            Filtros de búsqueda
          </SideTitle>

          <Header>
            <HeaderLeft>
              <ToggleButton $active={filtersOpen} onClick={handleToggleFilters}>
                {filtersOpen ? 'Filtros abiertos' : 'Filtros de búsqueda'}
              </ToggleButton>
            </HeaderLeft>
            <HeaderCenter>
              <SegmentedControl>
                <SegmentButton
                  $active={activeView === 'kits'}
                  onClick={() => setActiveView('kits')}
                >
                  Kits
                </SegmentButton>
                <SegmentButton
                  $active={activeView === 'lubricantes'}
                  onClick={() => setActiveView('lubricantes')}
                >
                  Lubricantes
                </SegmentButton>
              </SegmentedControl>
            </HeaderCenter>
            <HeaderRight>
              <ToggleButton $active={cartIsVisible} onClick={handleToggleOrder}>
                {cartIsVisible ? 'Pedido abierto' : 'Mi pedido'}{totalItems > 0 ? ` (${totalItems})` : ''}
              </ToggleButton>
            </HeaderRight>
          </Header>

          <SideTitle $open={cartIsVisible} $side="right">
            Detalle del pedido
          </SideTitle>
        </TopRow>

        {/* Fila inferior */}
        <Body>
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
