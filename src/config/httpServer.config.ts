import { Express, static as staticMw } from 'express';
import { Action, createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

import { User } from '../api/models/user-models/User.model';
import { SecurityService } from '../api/services/Auth.service';
import { UsuarioService } from '../api/services/UsuarioService';
import { PORT } from './env.config';
import { getLogger } from './logger.config';

const logger = getLogger(__filename);

export async function start() {
  try {
    logger.info('Starting http server');
    useContainer(Container);
    const app = createExpressServer({
      routePrefix: "/rangger",
      controllers: [__dirname + '/../api/controllers/*.controller.ts'],
      middlewares: [__dirname + '/../api/middlewares/*.Middleware.ts'],
      development: false,
      defaultErrorHandler: true,
      validation: true,
      authorizationChecker,
      currentUserChecker
    }) as Express;

    logger.info(__dirname + "/../controllers/*.controller.ts");

    app.use('/', staticMw(__dirname + '/../public'));
    const swaggerUi = require('swagger-ui-express');
    const swaggerJsdoc = require('swagger-jsdoc');

    const options = {
      swaggerDefinition: {
        // Like the one described here: https://swagger.io/specification/#infoObject
        info: {
          description: 'This is server Rangger.',
          version: '1.0.0',
          title: 'Swagger Rangger',
          termsOfService: 'http://swagger.io/terms/',
          contact: {
            email: 'diegoceccon1544@gmail.com'
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          }
        },
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        securityDefinitions: {
          bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description:
              'Enter your bearer token in the format **Bearer &lt;token>**',
            example: 'Bearer adsdsadas'
          }
        },
        externalDocs: {
          description: 'Find out more about Swagger',
          url: 'http://swagger.io'
        },
        tags: [
          {
            name: 'users',
            description: 'Operations about users',
            externalDocs: {
              description: 'Find out more about our store',
              url: 'http://swagger.io'
            }
          },
          {
            name: 'invitations',
            description: 'Operations about invitation',
            externalDocs: {
              description: 'Find out more about our store',
              url: 'http://swagger.io'
            }
          },
          {
            name: 'orders',
            description: 'Operations about order',
            externalDocs: {
              description: 'Find out more about our store',
              url: 'http://swagger.io'
            }
          }
        ],
      },
      apis: ['./src/api/controllers/*.controller.ts'],
      // List of files to be processes. You can also set globs './routes/*.js'
    };

    const specs = swaggerJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    await listen(app);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

async function authorizationChecker(action: Action, roles: string[]): Promise<boolean> {
  const user = await currentUserChecker(action);
  return !!user;
}

async function currentUserChecker(action: Action): Promise<User> {
  const token = action.request.headers['authorization']?.split('Bearer ')[1];
  const securityService = Container.get(SecurityService);
  const userService = Container.get(UsuarioService);
  try {
    const decoded = await securityService.verifyToken(token);
    const user = await userService.findOne({ where: { id: decoded.id }});

    return !!user.token && user.token === token ? user : undefined;
  } catch (e) {
    return undefined;
  }
}

async function listen(app: any): Promise<void> {
  return new Promise(resolve => {
    app.listen(PORT, () => {
      logger.info(`Http server started. Listening on port ${PORT}`);
      resolve();
    });
  });
}
