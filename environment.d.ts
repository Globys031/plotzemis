
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'dev' | 'prod';
      Database_URL: string;
      // JWT_secret_key: string;
      frontend_port: string;
      backend_port: string;
      Postgre_port: string;
      Adminer_port: string;
    }
  }
}