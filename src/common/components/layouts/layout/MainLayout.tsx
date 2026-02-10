import Head from 'next/head';
import React, { useContext } from 'react';
import { Content } from './styles';
import { Layout } from 'antd';
import { isMobile } from 'react-device-detect';
import Header from '../header/Header';
import Cart from '../../cart/Cart';
import { CartContext } from '@/context/CartContext';
import styled from 'styled-components';

import { styled as muiStyled } from '@mui/material/styles';
import Box from '@mui/material/Box';

export interface IMainLayout extends React.ComponentPropsWithoutRef<'div'> {
  title?: 'string';
  goBack?: string;
  type?: string;
}

const Main = muiStyled('main')(({ theme }) => ({
  width: '100% !important',
  minHeight: '100vh',
  position: 'relative',
  zIndex: 1,
}));

interface CartPanelProps {
  $isVisible: boolean;
  $isMobile?: boolean;
}

const CartPanel = styled.div<CartPanelProps>`
  position: fixed;
  top: 64px;
  right: 0;
  width: ${props => props.$isMobile ? '300px' : '400px'};
  height: calc(100vh - 64px);
  border-left: 1px solid black;
  transform: ${props => props.$isVisible ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MainLayout: React.FC<IMainLayout> = ({
  title,
  children,
  goBack,
  type,
  ...rest
}) => {
  const { cartIsVisible } = useContext(CartContext);

  // Desktop layout
  if (!isMobile) {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content="" key="desc" />
          <meta property="og:title" content="" />
          <meta property="og:description" content="" />
          <meta name="robots" content="" />
        </Head>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <Header />
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
            <Main
              sx={{
                flex: 1,
                transition: 'width 0.3s ease-in-out',
                width: cartIsVisible ? 'calc(100% - 400px)' : '100%',
              }}
            >
              <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Layout>
                  {type === 'home' ? (
                    <>{children}</>
                  ) : (
                    <Content.Inner>
                      <Content.Container>{children}</Content.Container>
                    </Content.Inner>
                  )}
                </Layout>
              </Layout>
            </Main>
            <CartPanel $isVisible={cartIsVisible}>
              <Cart />
            </CartPanel>
          </Box>
        </Box>
      </>
    );
  }

  // Mobile layout
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="" key="desc" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta name="robots" content="" />
      </Head>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header />
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          <Main
            sx={{
              flex: 1,
              transition: 'width 0.3s ease-in-out',
              width: cartIsVisible ? 'calc(100% - 300px)' : '100%',
              position: 'relative',
              paddingTop: '64px',
            }}
          >
            <Layout>
              <Content.Inner>
                <Content.Container>{children}</Content.Container>
              </Content.Inner>
            </Layout>
          </Main>
          <CartPanel $isVisible={cartIsVisible} $isMobile={true}>
            <Cart />
          </CartPanel>
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
