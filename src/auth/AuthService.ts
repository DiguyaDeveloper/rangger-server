import * as express from 'express';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { UserRepository } from '../api/repositories/UserRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';

@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository
    ) { }

    public parseBasicAuthFromRequest(req: express.Request): { username: string, password: string } {
        const authorization = req.header('authorization');

        if (authorization && authorization.split(' ')[0] === 'Basic') {
            this.log.info('Credentials provided by the client');
            const decodedBase64 = Buffer.from(authorization.split(' ')[1], 'base64').toString('ascii');
            const username = decodedBase64.split(':')[0];
            const password = decodedBase64.split(':')[1];
            if (username && password) {
                return { username, password };
            }
        }

        this.log.info('No credentials provided by the client');
        return undefined;
    }
}
