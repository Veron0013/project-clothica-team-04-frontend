import axios from 'axios';

export const GET_MODEL = 'AddressGeneral';
export const GET_CITIES_METHOD = 'getCities';

export const GET_WH_METHOD = 'getWarehouses';

export const API_KEY: string = process.env.NEXT_PUBLIC_NOVA_POST_API || '';

export type ApiParamsNovaPost = {
  apiKey: string;
  modelName: string;
  calledMethod: string;
  methodProperties: CityPropsNP | WarehosePropsNP;
};

export interface CityPropsNP {
  Page: '1';
  Limit: '20';
  Language: 'UA';
  FindByString: string;
}

export interface CityRespNP {
  Description: string;
  Area: string;
  Ref: string;
}

export interface WarehosePropsNP {
  Page: '1';
  Limit: '20';
  Language: 'UA';
  CityRef: string;
  CityName: string;
}

export interface WarehoseRespNP {
  Description: string;
  ShortAddress: string;
  Number: string;
}

export const NovaPostServer = axios.create({
  baseURL: '/api/np',
});

export const searchCities = async (search: string) => {
  const res = await NovaPostServer.post('/cities', {
    FindByString: search,
    Page: '1',
    Limit: '20',
    Language: 'UA',
  });

  return res.data.data;
};

export const searchWarehouses = async (
  CityRef: string,
  FindByString: string
) => {
  const res = await NovaPostServer.post('/warehouses', {
    CityRef,
    FindByString,
    Page: '1',
    Limit: '20',
    Language: 'UA',
  });

  return res.data.data;
};
