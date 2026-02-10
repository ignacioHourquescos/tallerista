import { useEffect, useState } from 'react';
import Script from 'next/script';

interface HotjarProps {
  hjid: string; // Hotjar Site ID
}

/**
 * Componente que inicializa Hotjar para todos los clientes
 * Hotjar se carga cuando existe un cliente en localStorage
 */
const Hotjar: React.FC<HotjarProps> = ({ hjid }) => {
  const [shouldLoadHotjar, setShouldLoadHotjar] = useState(false);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    const checkClient = () => {
      try {
        const clientJson = localStorage.getItem('client');
        if (!clientJson) {
          setShouldLoadHotjar(false);
          return;
        }

        const clientData = JSON.parse(clientJson);
        const clientId = clientData?.clientId;

        // Cargar Hotjar para todos los clientes que tengan datos en localStorage
        setShouldLoadHotjar(true);

        if (clientId) {
          console.log(`Hotjar habilitado para cliente ${clientId}`);
        }
      } catch (error) {
        console.error('Error al verificar cliente para Hotjar:', error);
        setShouldLoadHotjar(false);
      }
    };

    // Verificar inmediatamente
    checkClient();

    // Escuchar cambios en localStorage entre pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'client') {
        checkClient();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // También escuchar eventos personalizados de storage (para cambios en la misma pestaña)
    // Esto es útil si otras partes de la app disparan eventos cuando cambia el cliente
    const handleCustomStorageChange = () => {
      checkClient();
    };

    window.addEventListener('localStorageChange', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'localStorageChange',
        handleCustomStorageChange
      );
    };
  }, []);

  // No renderizar nada hasta que sepamos si debemos cargar Hotjar
  if (!shouldLoadHotjar) {
    return null;
  }

  return (
    <Script
      id="hotjar-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${hjid},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
      }}
    />
  );
};

export default Hotjar;
