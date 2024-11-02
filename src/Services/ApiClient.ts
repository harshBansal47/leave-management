import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, timeout: number = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(this.handleRequest);
    this.client.interceptors.response.use(this.handleResponse, this.handleError);
  }

  private handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers instanceof AxiosHeaders) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  };

  private handleResponse = (response: AxiosResponse): AxiosResponse => {
    return response;
  };

  private handleError = (error: any): Promise<any> => {
    // Centralized error handling
    console.error('API error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized errors, e.g., refresh token or logout
      console.warn('Unauthorized! Redirecting to login...');
    }
    return Promise.reject(error);
  };

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

const apiClient = new ApiClient(process.env.REACT_APP_API_URL || 'http://localhost:3000');

export default apiClient;
export {};