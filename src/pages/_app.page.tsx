import '@/styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { NextPageWithLayout } from '../common/types/page';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ClientProvider } from '@/context/ClientContext';
import { FilterProvider } from '@/context/FilterContext';
import Hotjar from '@/components/Hotjar';

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
}

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ClientProvider>
      <AuthProvider>
        <CartProvider>
          <FilterProvider>
            {getLayout(<Component {...pageProps} />)}
            <Hotjar hotjarId={process.env.NEXT_PUBLIC_HOTJAR_ID || ''} />
          </FilterProvider>
        </CartProvider>
      </AuthProvider>
    </ClientProvider>
  );
}

export default App;
