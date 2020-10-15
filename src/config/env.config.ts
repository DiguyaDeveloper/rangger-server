import { config } from 'dotenv';
import { resolve } from 'path';

import { DBTypes, Env, LogLevels } from './constants.config';

config({ path: resolve(__dirname, '../../..', '.env') });

export const NODE_ENV: Env = (process.env.NODE_ENV as Env) || Env.dev;
export const DATA_DIR: string = resolve(process.env.DATA_DIR || __dirname + '/../../data');
export const PORT: number = parseInt(process.env.APP_PORT, 10) || 8080;
export const LOG_LEVEL: LogLevels = (process.env.LOG_LEVEL as LogLevels) || (NODE_ENV === Env.prod ? LogLevels.info : LogLevels.debug);
export const JWT_SECRET: string = process.env.JWT_SECRET || '558d3107264f726bf1c162b12c97b1d88ab3831c2e0905eb2b34095317a02445c30be9ebc572b3dc6e1d3f552bff1a30ddcf346429d279a02356e262edafca58';

// Database configuration
export const DB_TYPE: DBTypes = (process.env.TYPEORM_CONNECTION as DBTypes) || DBTypes.mysql;
export const DB_HOST: string = process.env.TYPEORM_HOST || '127.0.0.1';
export const DB_PORT: string = process.env.TYPEORM_PORT || '3306';
export const DB_USERNAME: string = process.env.TYPEORM_USERNAME || 'root';
export const DB_PASSWORD: string = process.env.TYPEORM_PASSWORD || 'password';
export const DB_NAME: string = process.env.TYPEORM_DATABASE || 'type_orm3';
