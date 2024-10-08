import { apiUrl } from '@/const/api';
import axiosInstance, { AxiosResponseProps } from '@/uitls/request';

export const getCommList = (params?: any) => {
	return axiosInstance.post(apiUrl.LngLat_PROXY, params);
};

export const getSearchComm = (params?: any) => {
	return axiosInstance.get(apiUrl.TEST_PROXY, { params: params || {} });
};
