import axios from 'axios';
import { parse, stringify } from 'qs';
import { AnyObject } from '../../common/types/types';
import { API_URL } from '../../config';

const Axios = axios.create({
  baseURL: API_URL,
});
Axios.defaults.headers.post['Content-Type'] = 'application/json';
Axios.defaults.headers.common['TOKEN_APP'] = '';

class AxiosRequest {
  async get<T, P>(url: string, params?: P, headers?: AnyObject) {
    try {
      const result = await Axios.get<T>(url, {
        params: params,
        headers,
      });
      return result;
    } catch (error: any) {
      if (error.message.includes(412)) window.location.reload();
      throw error;
    }
  }

  async post<T, P>(url: string, data: P, headers?: AnyObject) {
    try {
      const result = await Axios.post<T>(url, data, { headers });

      return result;
    } catch (error: any) {
      if (error.status === 412) window.location.reload();
      console.log(error);
      throw error;
    }
  }

  async put(url: string, data: AnyObject) {
    try {
      const result = await Axios.put(url, data);
      return result;
    } catch (error: any) {
      if (error.status === 412) window.location.reload();
      throw error;
    }
  }

  async delete(url: string, data?: AnyObject) {
    try {
      const result = await Axios.delete(url, { data });
      return result;
    } catch (error: any) {
      if (error.status === 412) window.location.reload();
      throw error;
    }
  }
}

export { Axios };

const i = new AxiosRequest();
export { i as AxiosRequest };
