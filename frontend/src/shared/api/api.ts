import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

import { API_BASE_URL, API_ENDPOINTS } from "@/shared/config";

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    this.instance.interceptors.request.use((config) => {
      // Для FormData не задаём Content-Type — браузер подставит multipart/form-data с boundary
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }
      // Токен передаётся ко ВСЕМ запросам (Authorization или cookie access_token)
      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("access_token") ?? localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;

        if (typeof window === "undefined") {
          return Promise.reject(error);
        }

        if (status === 401) {
          try {
            const refreshResponse = await axios.post(
              `${baseURL}${API_ENDPOINTS.AUTH.REFRESH}`,
              {},
              { withCredentials: true },
            );
            const newToken = refreshResponse.data.access_token as string;
            sessionStorage.setItem("access_token", newToken);
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return this.instance.request(error.config);
          } catch {
            this.clearSessionAndRedirect();
          }
        }

        if (status === 403 && !sessionStorage.getItem("access_token")) {
          this.clearSessionAndRedirect();
        }

        return Promise.reject(error);
      },
    );
  }

  private clearSessionAndRedirect(): void {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    document.cookie = "has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  async post<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await this.instance.post(url, data, config);
    return response.data;
  }

  async put<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
