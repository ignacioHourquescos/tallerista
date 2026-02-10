import { API_URL } from '../../config';
import { AxiosRequest } from '../../lib/axios/Axios';
import { Article } from '../models/order';

export const getArticles = async (): Promise<any> => {
  const apiUrl = `${API_URL}/obtenerListadoArticulos`;

  try {
    const res = await AxiosRequest.get<Article[], undefined>(`${apiUrl}`);
    console.log('aca data', res.data);
    return res.data;
  } catch (err: any) {
    console.error(`Login failed`, err.message);
    throw new Error('Login failed');
  }
};

export const getArticlesByListCode = async (listCode: string): Promise<any> => {
  const apiUrl = `${API_URL}/api/articles/prices/list/${listCode}`;

  try {
    const res = await AxiosRequest.get<Article[], undefined>(`${apiUrl}`);
    console.log('Articles by list code:', res.data);
    return res.data;
  } catch (err: any) {
    console.error(`Failed to get articles by list code`, err.message);
    throw new Error('Failed to get articles by list code');
  }
};
