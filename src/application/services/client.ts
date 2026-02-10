import { API_URL } from '../../config';
import { AxiosRequest } from '../../lib/axios/Axios';
import { ClientDto, VoucherDto, ClientDiscountDto } from '../models/client';

export const getClient = async (dto: ClientDto): Promise<any> => {
  const apiUrl = `${API_URL}/getClient`;

  try {
    const res = await AxiosRequest.get<any, ClientDto>(`${apiUrl}`, dto);
    console.log('/getClient', res.data);
    return res.data;
  } catch (err: any) {
    console.error(`Login failed`, err.message);
    throw new Error('Login failed');
  }
};

export const getClientVouchers = async (dto: ClientDto): Promise<any> => {
  const apiUrl = `${API_URL}/getClientVouchers`;

  try {
    const res = await AxiosRequest.get<VoucherDto, ClientDto>(`${apiUrl}`, dto);
    console.log(res.data);
    return res.data;
  } catch (err: any) {
    console.error(`Failed to retrieve vouchers`, err.message);
    throw new Error('Failed to retrieve vouchers');
  }
};

export const getClientDiscounts = async (
  clientNumber: number
): Promise<ClientDiscountDto> => {
  const apiUrl = `${API_URL}/api/clients/${clientNumber}/discount`;

  try {
    const res = await AxiosRequest.get<ClientDiscountDto, any>(`${apiUrl}`);
    console.log('Client discounts:', res.data);
    return res.data;
  } catch (err: any) {
    // Solo loggear el error si no es un error de red esperado (ej: API no disponible)
    if (err.message && !err.message.includes('Network Error')) {
      console.error(`Failed to retrieve client discounts:`, err.message);
    }
    // No lanzar error, retornar null para que la app continúe funcionando
    return null as any;
  }
};
