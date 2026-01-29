import axios from 'axios';
import { ViaCepResponse } from '../types';

export const fetchAddressByCep = async (cep: string): Promise<ViaCepResponse | null> => {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const response = await axios.get<ViaCepResponse>(
      `https://viacep.com.br/ws/${cleanCep}/json/`,
    );

    if (response.data.erro) return null;

    return response.data;
  } catch {
    return null;
  }
};
