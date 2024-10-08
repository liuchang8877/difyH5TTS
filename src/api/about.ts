import { apiUrl } from '@/const/api';
import axiosInstance, { AxiosResponseProps } from '@/uitls/request';

export const getInfo = (params?: any,headers?: any) => {
	return axiosInstance.post(apiUrl.MAIN_SERVER+'/prod-api/applet/getInfo', params  ,{ headers: headers || {} });
};
