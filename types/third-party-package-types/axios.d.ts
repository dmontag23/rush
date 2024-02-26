/* This file creates custom axios types since an interceptor is used
which defaults many of the types to "any". This method also enables correct
typing of requests. */

export * from 'axios';

declare module 'axios' {
  export interface AxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any, R = any>(
      url: string,
      data?: T,
      config?: AxiosRequestConfig
    ): Promise<R>;
    put<T = any, R = any>(
      url: string,
      data?: T,
      config?: AxiosRequestConfig
    ): Promise<R>;
    patch<T = any, R = any>(
      url: string,
      data?: T,
      config?: AxiosRequestConfig
    ): Promise<R>;
  }
}
