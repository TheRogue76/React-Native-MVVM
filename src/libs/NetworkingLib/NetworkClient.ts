import { createToken, singleton } from 'launchpad-dependency-injection';
import { z } from 'zod';
import { container } from '../Core/DI.ts';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface ResponseData<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface RequestInterceptor {
  onRequest(config: RequestConfig): RequestConfig | Promise<RequestConfig>;
}

export interface ResponseInterceptor {
  onResponse<T>(response: ResponseData<T>): ResponseData<T> | Promise<ResponseData<T>>;
  onError(error: Error): Error | Promise<Error>;
}

export interface NetworkClient {
  request<T>(
    url: string,
    method: HttpMethod,
    schema: z.ZodSchema<T>,
    options?: {
      body?: unknown;
      headers?: Record<string, string>;
    },
  ): Promise<T>;

  addRequestInterceptor(interceptor: RequestInterceptor): void;
  addResponseInterceptor(interceptor: ResponseInterceptor): void;
}

@singleton()
export class NetworkClientImpl implements NetworkClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  async request<T>(
    url: string,
    method: HttpMethod,
    schema: z.ZodSchema<T>,
    options?: {
      body?: unknown;
      headers?: Record<string, string>;
    },
  ): Promise<T> {
    let config: RequestConfig = {
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: options?.body,
    };

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor.onRequest(config);
    }

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();

      // Validate response with zod schema
      const validatedData = schema.parse(rawData);

      let responseData: ResponseData<T> = {
        data: validatedData,
        status: response.status,
        headers: response.headers,
      };

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        responseData = await interceptor.onResponse(responseData);
      }

      return responseData.data;
    } catch (error) {
      let processedError = error instanceof Error ? error : new Error(String(error));

      // Apply error interceptors
      for (const interceptor of this.responseInterceptors) {
        processedError = await interceptor.onError(processedError);
      }

      throw processedError;
    }
  }
}

export const networkClientSI = createToken<NetworkClient>('NetworkClient');

container.register(networkClientSI, NetworkClientImpl);
