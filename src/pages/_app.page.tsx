import '@/styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ClientProvider } from '@/context/ClientContext';
import { FilterProvider } from '@/context/FilterContext';
import { ViewProvider } from '@/context/ViewContext';

function App({ Component, pageProps }: AppProps) {
  return (
    <ClientProvider>
      <AuthProvider>
        <CartProvider>
          <FilterProvider>
            <ViewProvider>
              <Component {...pageProps} />
            </ViewProvider>
          </FilterProvider>
        </CartProvider>
      </AuthProvider>
    </ClientProvider>
  );
}

export default App;
