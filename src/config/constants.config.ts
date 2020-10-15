export enum DBTypes {
  mysql = 'mysql',
  mariadb = 'mariadb',
  postgres = 'postgres',
  cockroachdb = 'cockroachdb',
  sqlite = 'sqlite',
  oracle = 'oracle',
  mongodb = 'mongodb',
}

export enum Env {
  dev = 'dev',
  test = 'test',
  prod = 'prod',
}

export enum LogLevels {
  error = 'error',
  warn = 'warn',
  info = 'info',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

export const SALT_OR_ROUNDS = 10;
export const INCLUDE_FILENAME = false;
export const MAX_FILENAME_LENGTH = 20;