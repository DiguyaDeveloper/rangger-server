import { Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/env.config';
import { TokenDecoded, TokenPayload } from '../../types';

@Service()
export class SecurityService {
  public async generateToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' }, (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  }

  public async verifyToken(token: string): Promise<TokenDecoded> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, ((err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as TokenDecoded);
        }
      }));
    });
  }
}