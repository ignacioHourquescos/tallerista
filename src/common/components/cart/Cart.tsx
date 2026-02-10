import React, { useContext, useState, useMemo } from 'react';
import { Styled } from './styles';
import { CartContext } from '@/context/CartContext';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { OrderDto } from '@/application/models/order';
import { postOrder } from '@/application/services/orders';
import { getFilterKits } from '@/application/services/filter-kits';
import { Article } from '@/application/models/order';
import dayjs from 'dayjs';
import {
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ConfirmationDialog from '../dialogue/Dialogue';
import { Input } from 'antd';
const { TextArea } = Input;

interface GroupedKit {
  kitId: string;
  vehicleName: string;
  description: string;
  imageUrl: string;
  filters: {
    code: string;
    article: Article;
    type: 'oil' | 'air' | 'fuel' | 'cabin';
  }[];
  quantity: number;
  totalPrice: number;
}

const Cart: React.FC = () => {
  const { cartItems, emptyCart, removeFromCart, modifyQuantity, setCartIsVisible } =
    useContext(CartContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [soloFram, setSoloFram] = useState(false);
  const [selectedTypeMostrador, setSelectedTypeMostrador] = useState(false);
  const [observaciones, setObservaciones] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Agrupar artículos por kit
  const groupedKits = useMemo(() => {
    const kits = getFilterKits();
    const grouped: Record<string, GroupedKit> = {};

    cartItems.forEach((article) => {
      // Buscar en qué kit está este código de filtro
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

        // Determinar el tipo de filtro
        let filterType: 'oil' | 'air' | 'fuel' | 'cabin' = 'oil';
        if (kit.oilFilterCode?.toLowerCase() === article.id.toLowerCase()) {
          filterType = 'oil';
        } else if (kit.airFilterCode?.toLowerCase() === article.id.toLowerCase()) {
          filterType = 'air';
        } else if (kit.fuelFilterCode?.toLowerCase() === article.id.toLowerCase()) {
          filterType = 'fuel';
        } else if (kit.cabinFilterCode?.toLowerCase() === article.id.toLowerCase()) {
          filterType = 'cabin';
        }

        // Verificar si ya existe este tipo de filtro en el kit
        const existingFilter = grouped[kitKey].filters.find(f => f.type === filterType);
        if (existingFilter) {
          // Si ya existe, sumar la cantidad
          existingFilter.article.quantity += article.quantity;
        } else {
          grouped[kitKey].filters.push({
            code: article.id,
            article: { ...article },
            type: filterType,
          });
        }

        const itemTotal = (article.netPriceWithVAT || article.priceWithVAT || 0) * article.quantity;
        grouped[kitKey].totalPrice += itemTotal;
      }
    });

    // Calcular la cantidad del kit (mínimo común de todos los filtros)
    Object.values(grouped).forEach((kit) => {
      if (kit.filters.length > 0) {
        // La cantidad del kit es la cantidad mínima de los filtros que tienen la misma cantidad
        // O simplemente usar la cantidad del primer filtro si todos tienen la misma
        const quantities = kit.filters.map(f => f.article.quantity);
        kit.quantity = Math.min(...quantities);
      }
    });

    return Object.values(grouped);
  }, [cartItems]);


  const orderToPost: any[] = cartItems.map(function (row) {
    return {
      id: row.id || '',
      q: row.quantity || 0,
      modifiedId: row.id || '',
      p: row.price || 0,
      d: row.description || '',
      da: row.descriptionAditional || '',
      um: row.ubication || '',
      s: row.stock || 0,
      agru: row.agrupation || '',
      status: '',
    };
  });

  const orderData: OrderDto = {
    cliente: 'Cliente Potencial',
    clientId: 0,
    orderId: `TEMP-${dayjs().unix().toString()}`,
    delivery: '-',
    deliveryResponsable: '-',
    depositoObs: 'PEDIDO INGRESADO DESDE COTIZADOR DE CLIENTES POTENCIALES',
    facturacionObs: 'PEDIDO INGRESADO DESDE COTIZADOR DE CLIENTES POTENCIALES',
    clienteObs: observaciones || '',
    fecha: 2,
    logisticaObs: soloFram
      ? `🤖 SOLO FRAM || PEDIDO EL ${dayjs().format(
          'DD/MM HH:mm:ss'
        )} || CANTIDAD DE ITEMS: ${cartItems.length}`
      : `🤖 PEDIDO EL ${dayjs().format(
          'DD/MM HH:mm:ss'
        )} || CANTIDAD DE ITEMS: ${cartItems.length}`,
    order: orderToPost,
    orderState: selectedTypeMostrador ? 'A preparar' : 'PrePedido',
    responsable: '-',
    semana: 11,
    timestamp: dayjs().unix(),
    type: 'Despacho',
  };

  const submitNewOrder = async () => {
    if (cartItems.length === 0) {
      return false;
    }

    const sanitizedOrderData = {
      ...orderData,
      cliente: orderData.cliente || '-',
      clientId: orderData.clientId || 0,
      orderId: orderData.orderId || `TEMP-${dayjs().unix().toString()}`,
      delivery: orderData.delivery || '-',
      deliveryResponsable: orderData.deliveryResponsable || '-',
      depositoObs: orderData.depositoObs || '',
      facturacionObs: orderData.facturacionObs || '',
      clienteObs: orderData.clienteObs || '',
      logisticaObs: orderData.logisticaObs || '',
      responsable: orderData.responsable || '-',
      orderState: orderData.orderState || 'PrePedido',
      type: orderData.type || 'Despacho',
    };

    try {
      const response = await postOrder(sanitizedOrderData);
      setOpenDialog(true);
      return true;
    } catch (error) {
      console.error('Error posting new order:', error);
      alert('Error al enviar el pedido. Por favor, intente nuevamente.');
    }
  };

  const totalNetWithVAT = cartItems.reduce(
    (sum, item) => sum + (item.netPriceWithVAT || item.priceWithVAT || 0) * (item.quantity || 1),
    0
  );

  const getFilterTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      oil: 'Aceite',
      air: 'Aire',
      fuel: 'Combustible',
      cabin: 'Cabina',
    };
    return labels[type] || type;
  };

  return (
    <Styled.Inner>
      <Styled.Header>
        <Styled.Title>Carrito</Styled.Title>
        <IconButton
          onClick={() => setCartIsVisible(false)}
          size="small"
          sx={{ color: '#666' }}
        >
          <CloseIcon />
        </IconButton>
      </Styled.Header>

      {cartItems?.length === 0 ? (
        <Styled.EmptyCart>CARRITO VACIO!</Styled.EmptyCart>
      ) : (
        <>
          <Styled.Content>
            {groupedKits.map((groupedKit, idx) => (
              <Styled.KitCard key={idx}>
                <Styled.KitHeader>
                  <Styled.KitImage src={groupedKit.imageUrl} alt={groupedKit.vehicleName} />
                  <Styled.KitInfo>
                    <Styled.KitVehicleName>{groupedKit.vehicleName}</Styled.KitVehicleName>
                    <Styled.KitDescription>{groupedKit.description}</Styled.KitDescription>
                    <Styled.KitQuantity>Cantidad: {groupedKit.quantity}</Styled.KitQuantity>
                  </Styled.KitInfo>
                  <IconButton
                    onClick={() => {
                      groupedKit.filters.forEach((filter) => {
                        removeFromCart(filter.code);
                      });
                    }}
                    size="small"
                    sx={{ color: '#d32f2f' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Styled.KitHeader>

                <Styled.FiltersList>
                  {groupedKit.filters.map((filter, filterIdx) => (
                    <Styled.FilterItem key={filterIdx}>
                      <Styled.FilterInfo>
                        <Styled.FilterType>{getFilterTypeLabel(filter.type)}</Styled.FilterType>
                        <Styled.FilterCode>{filter.code}</Styled.FilterCode>
                        <Styled.FilterDescription>
                          {filter.article.description?.substring(0, 40)}...
                        </Styled.FilterDescription>
                      </Styled.FilterInfo>
                      <Styled.FilterPrice>
                        ${((filter.article.netPriceWithVAT || filter.article.priceWithVAT || 0) * filter.article.quantity).toLocaleString('es-AR')}
                      </Styled.FilterPrice>
                    </Styled.FilterItem>
                  ))}
                </Styled.FiltersList>

                <Styled.KitTotal>
                  Total: ${groupedKit.totalPrice.toLocaleString('es-AR')}
                </Styled.KitTotal>
              </Styled.KitCard>
            ))}
          </Styled.Content>

            <Styled.ButtonContainer>
            <Styled.TotalPrice>
              Total: ${totalNetWithVAT.toLocaleString('es-AR')}
            </Styled.TotalPrice>


              <ConfirmationDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                text="¿Está seguro que desea eliminar el pedido?"
              >
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => {
                    emptyCart();
                    setOpenDeleteDialog(false);
                  }}
                >
                Sí, eliminar
                </Button>
                <div onClick={() => setOpenDeleteDialog(false)}>No, cancelar</div>
              </ConfirmationDialog>

              <ConfirmationDialog
                text="Recibimos su pedido con éxito."
                open={openDialog}
              onClose={() => {
                setOpenDialog(false);
                emptyCart();
                setCartIsVisible(false);
              }}
              >
                <Button
                variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    emptyCart();
                    setCartIsVisible(false);
                  setOpenDialog(false);
                  }}
                >
                  OK
                </Button>
              </ConfirmationDialog>
            </Styled.ButtonContainer>
          </>
        )}
      </Styled.Inner>
  );
};

export default Cart;
