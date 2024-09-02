export type AtLeastOne<T, U = { [K in keyof T]: Pick<Required<T>, K> }> = Partial<T> & U[keyof U];

export interface EnvVariables {
  NODE_ENV: string;
  TZ: string;

  API_PORT: string;
  API_DNS: string;
  JWT_SECRET: string;

  DB_HOST: string;
  DB_PORT: string;
  DB_DATABASE: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_SCHEMA: string;
  DB_URL: string;

  MAIL_FROM: string;
  MAIL_HOST: string;
  MAIL_PORT: string;
  MAIL_USER: string;
  MAIL_PASS: string;

  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_ENDPOINT: string;
}
