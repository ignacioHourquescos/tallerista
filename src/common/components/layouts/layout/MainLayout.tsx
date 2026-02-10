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
  width: ${props => props.$isVisible ? (props.$isMobile ? '300px' : '400px') : '0px'};
  height: 100%;
  border-left: ${props => props.$isVisible ? '1px solid black' : 'none'};
  transition: width 0.3s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: white;
  flex-shrink: 0;
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
          <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <Header cartIsVisible={cartIsVisible} />
              <Main
                sx={{
                  flex: 1,
                  transition: 'flex 0.3s ease-in-out',
                  minWidth: 0,
                  overflow: 'auto',
                }}
              >
                <Layout style={{ minHeight: 'calc(100vh - 500px)' }}>
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
            </Box>
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
        <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <Header cartIsVisible={cartIsVisible} />
            <Main
              sx={{
                flex: 1,
                transition: 'flex 0.3s ease-in-out',
                minWidth: 0,
                overflow: 'auto',
                position: 'relative',
                paddingTop: '500px',
              }}
            >
              <Layout>
                <Content.Inner>
                  <Content.Container>{children}</Content.Container>
                </Content.Inner>
              </Layout>
            </Main>
          </Box>
          <CartPanel $isVisible={cartIsVisible} $isMobile={true}>
            <Cart />
          </CartPanel>
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
