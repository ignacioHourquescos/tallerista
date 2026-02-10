import { useEffect } from 'react';

interface HotjarProps {
  hotjarId: string;
}

const Hotjar: React.FC<HotjarProps> = ({ hotjarId }) => {
  useEffect(() => {
    // Verificar si Hotjar ya está cargado
    if (typeof window !== 'undefined' && !window.hj) {
      (function (h: any, o: any, t: any, j: any, a?: any, r?: any) {
        h.hj =
          h.hj ||
          function () {
            (h.hj.q = h.hj.q || []).push(arguments);
          };
        h._hjSettings = { hjid: hotjarId, hjsv: 6 };
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script');
        r.async = 1;
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
        a.appendChild(r);
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }
  }, [hotjarId]);

  return null;
};

export default Hotjar;
