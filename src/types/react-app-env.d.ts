declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_USE_TLS: boolean;
    REACT_APP_BACKEND_PORT: string;
    REACT_APP_BACKEND_HOST: string;
  }
}