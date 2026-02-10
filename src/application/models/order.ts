export interface OrderDto {
  cliente: string;
  clientId?: number;
  orderId?: string;
  delivery: string;
  deliveryResponsable: string;
  depositoObs: string | null;
  clienteObs: string | null;
  facturacionObs: string;
  fecha: number;
  logisticaObs: string | null;
  orderState: string;
  order: OrderDetail[];
  responsable: string;
  semana: number;
  timestamp: number;
  type: string;
}

export interface OrderDetail {
  id: string;
  q: number;
  modifiedId?: string;
  p?: number;
  da?: string;
  d?: string;
  um?: string;
  s?: number;
  agru: string;
  status?: string;
  logo: string;
}

export interface Article {
  readonly id: string;
  readonly lastModificationDate?: string;
  readonly discount?: number;
  readonly descriptionAditional?: string;
  readonly description?: string;
  readonly agrupation?: string;
  readonly ubication?: string;
  readonly price?: number;
  readonly stock?: number;
  readonly quantity: number;
  readonly priceWithVAT?: number | null;
  readonly netPriceWithoutVAT?: number | null;
  readonly netPriceWithVAT?: number | null;
  readonly subtotalWithoutVAT?: number | null;
  readonly subtotalWithVAT?: number | null;
}
