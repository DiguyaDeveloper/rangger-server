import 'reflect-metadata';

import { install as installSourceMapSupport } from 'source-map-support';

import { connect as connectDb } from './config/database.config';
import { DATA_DIR, NODE_ENV } from './config/env.config';
import { start as startHttpServer } from './config/httpServer.config';
import { getLogger } from './config/logger.config';

const logger = getLogger(__filename);

installSourceMapSupport();
process.on('uncaughtException', err => {
  logger.error(err);
  process.exit(1);
});

process.on('exit', code => {
  logger.log(code === 0 ? 'info' : 'error', `Exiting with code ${code}`);
});

process.on('SIGINT', () => {
  logger.info('Shutting down manually');
});

async function start() {
  logger.info(`Starting server - mode ${NODE_ENV}`);
  logger.info(`Data directory: ${DATA_DIR}`);
  await connectDb();
  await startHttpServer();
}

start()
  .then(() => {
    logger.info('Server ready');
  })
  .catch(err => {
    logger.error(err);
    process.exit(1);
  });
