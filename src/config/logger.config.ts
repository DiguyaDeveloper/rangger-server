import { createLogger, format, Logger as WinstonLogger, LoggerOptions, transports } from 'winston';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { basename } from 'path';
import { DATA_DIR, LOG_LEVEL, NODE_ENV } from './env.config';
import { Env, INCLUDE_FILENAME, MAX_FILENAME_LENGTH } from './constants.config';

const { combine, errors, timestamp, printf, colorize } = format;

export function getLogger(filePath: string): WinstonLogger {
  let fileName = basename(filePath);
  fileName = fileName.length > MAX_FILENAME_LENGTH ?
    fileName.slice(0, MAX_FILENAME_LENGTH) :
    fileName.padEnd(MAX_FILENAME_LENGTH, ' ');

  const customFormat = printf(info => {
    const level = `[${info.level.toUpperCase()}]`.padEnd(9, ' ');
    const source = INCLUDE_FILENAME ? fileName + ' ' : '';
    const log = `${info.timestamp} ${source}${level}${info.message}`;
    return info.stack ? `${log}\n${info.stack}` : log;
  });

  const options: LoggerOptions = {
    level: LOG_LEVEL,
    format: combine(errors({ stack: true }), timestamp()),
  };

  if (NODE_ENV !== Env.test) {
    options.transports = [
      new transports.File({ filename: DATA_DIR + '/logs/server.log', maxsize: 10000000, format: customFormat }),
      new transports.Console({ format: combine(customFormat, colorize({ all: true })) }),
    ];
  }

  return createLogger(options);
}

export class CustomTypeOrmLogger implements TypeOrmLogger {
  private logger = getLogger('TypeOrm');

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
    this.logger.log(level, message);
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.debug(`Query: ${query}`);
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.warn(`The query "${query}" executed slowly in ${time}ms`);
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    let message = error;
    message += `\n\tWith query: ${query}`;
    if (parameters && parameters.length > 0) {
      message += `\n\tWith params: ${parameters}`;
    }
    this.logger.error(message);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    this.logger.info(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    this.logger.info(message);
  }
}