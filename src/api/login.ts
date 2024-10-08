import { apiUrl } from '@/const/api';
import axiosInstance, { AxiosResponseProps } from '@/uitls/request';

export const getLogin = (params?: any) => {
	return axiosInstance.post(apiUrl.MAIN_SERVER+'/prod-api/applet/login', params);
};
