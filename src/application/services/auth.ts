import { API_URL } from '../../config';
import { AxiosRequest } from '../../lib/axios/Axios';
import { LoginDto, LoginResponseDto } from '../models/login';

export const auth = async (dto: LoginDto): Promise<LoginResponseDto> => {
  const apiUrl = `${API_URL}/generalValidateUser`;

  try {
    const res = await AxiosRequest.post<LoginResponseDto, LoginDto>(
      `${apiUrl}`,
      dto
    );
    console.log(res.data);
    return res.data;
  } catch (err: any) {
    console.error(`Login failed`, err.message);
    throw new Error('Login failed');
  }
};
