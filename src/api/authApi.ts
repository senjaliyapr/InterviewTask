import apiClient from './apiClient';

export interface LoginResponse {
  token: string;
}

export const loginApi = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await apiClient.post('/login', {
    username,
    password,
  });

  return response.data;
};