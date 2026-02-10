import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getClientVouchers,
  getClientDiscounts,
} from '@/application/services/client';
import {
  ClientDto,
  VoucherDto,
  ClientDiscountDto,
} from '@/application/models/client';

interface ClientContextType {
  totalPendingBalance: number;
  setClientVouchers: React.Dispatch<React.SetStateAction<VoucherDto[]>>;
  clientDiscounts: ClientDiscountDto | null;
  loadClientDiscounts: (clientNumber: number) => Promise<void>;
  isLoadingDiscounts: boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clientVouchers, setClientVouchers] = useState<VoucherDto[]>([]);
  const [clientDiscounts, setClientDiscounts] =
    useState<ClientDiscountDto | null>(() => {
      // Cargar desde localStorage al inicializar
      if (typeof window !== 'undefined') {
        const storedDiscounts = localStorage.getItem('clientDiscounts');
        return storedDiscounts ? JSON.parse(storedDiscounts) : null;
      }
      return null;
    });
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);

  const totalPendingBalance = clientVouchers.reduce(
    (sum, voucher) => sum + voucher.SALDO,
    0
  );

  const loadClientDiscounts = async (clientNumber: number) => {
    setIsLoadingDiscounts(true);
    try {
      const discounts = await getClientDiscounts(clientNumber);
      if (discounts) {
        setClientDiscounts(discounts);
        console.log('discounts', discounts);
        // Guardar en localStorage
        localStorage.setItem('clientDiscounts', JSON.stringify(discounts));
      }
    } catch (error) {
      // Silenciar errores de red - la app puede funcionar sin descuentos
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error loading client discounts (non-critical):', error);
      }
    } finally {
      setIsLoadingDiscounts(false);
    }
  };

  // Cargar automáticamente los descuentos cuando hay un cliente en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const clientData = localStorage.getItem('client');
      if (clientData) {
        try {
          const parsedClient = JSON.parse(clientData);
          const clientNumber = parsedClient.clientId;

          if (clientNumber) {
            // Verificar si ya hay descuentos en localStorage
            const storedDiscounts = localStorage.getItem('clientDiscounts');
            if (!storedDiscounts || storedDiscounts === 'null') {
              console.log('Loading discounts for client:', clientNumber);
              loadClientDiscounts(clientNumber);
            } else {
              // Asegurarse de que los descuentos estén en el estado
              try {
                const parsed = JSON.parse(storedDiscounts);
                if (parsed && !clientDiscounts) {
                  setClientDiscounts(parsed);
                }
              } catch (e) {
                console.warn('Error parsing stored discounts, reloading...', e);
                loadClientDiscounts(clientNumber);
              }
            }
          }
        } catch (error) {
          console.error('Error parsing client data for discounts:', error);
        }
      }
    }
  }, []); // Solo ejecutar una vez al montar el componente

  // Guardar en localStorage cuando cambien los descuentos
  useEffect(() => {
    if (clientDiscounts && typeof window !== 'undefined') {
      localStorage.setItem('clientDiscounts', JSON.stringify(clientDiscounts));
    }
  }, [clientDiscounts]);

  return (
    <ClientContext.Provider
      value={{
        totalPendingBalance,
        setClientVouchers,
        clientDiscounts,
        loadClientDiscounts,
        isLoadingDiscounts,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};
