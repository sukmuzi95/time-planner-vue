import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error';
import router from '@/router';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const errorStore = useErrorStore();
    const auth = useAuthStore();
    const original = error.config || {};

    const status = error.response.status;
    const shouldRefresh = (status === 401 || status === 419) && !original._retry;

    if (shouldRefresh) {
      try {
        original._retry = true;
        const newAccessToken = await auth.refresh(); // 쿠키 기반 refresh
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (e) {
        await auth.logout();
        return Promise.reject(e);
      }
    }

    const msg =
      error.response?.data?.message ||
      (error.response?.status === 403
        ? '권한이 없습니다.'
        : error.response?.status === 404
          ? '리소스를 찾을 수 없습니다.'
          : error.response?.status === 500
            ? '서버 오류입니다. 잠시 후 다시 시도해주세요.'
            : '알 수 없는 오류가 발생했습니다.');

    errorStore.set(msg);

    return Promise.reject(error);
  }
);

export default api;
