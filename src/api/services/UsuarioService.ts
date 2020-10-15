import { Authorized, NotFoundError } from 'routing-controllers';
import { getLogger } from 'src/config/logger.config';
import { Service } from 'typedi';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { CustomError } from '../controllers/errors/CustomError';
import { EnumError } from '../controllers/errors/Error';
import UsuarioQueryParams from '../models/queryParameters/UsuarioQueryParams';
import { User, UserStatus } from '../models/user-models/User.model';
import { UserRepository } from '../repositories/UserRepository';
import Mail from '../services/Mail.service';
import { Page } from '../shared/Page';
import { events } from '../subscribers/events';
import cpf from '../validators/cpf';

@Service()
export class UsuarioService {

  constructor(
    @OrmRepository()
    private userRepository: UserRepository,
    @EventDispatcher()
    private eventDispatcher: EventDispatcherInterface,
    @Logger(__filename)
    private log: LoggerInterface
  ) { }

  public logger = getLogger(__filename);
  public async update(
    usuario: User,
    partial: DeepPartial<User>
  ): Promise<User> {
    this.log.info('Update a user');
    this.userRepository.merge(usuario, partial);
    return await this.userRepository.save(usuario);
  }

  public async findByIdAndUpdate(
    usuario: User,
    partial: DeepPartial<User>
  ): Promise<User> {
    this.log.info('Update a user insert code');
    this.userRepository.merge(usuario, partial);
    return await this.userRepository.save(usuario);
  }

  public async save(usuario: User): Promise<User> {
    const newUser = await this.userRepository.save(usuario);
    this.eventDispatcher.dispatch(events.user.created, newUser);
    this.log.info('Create a new user => ', usuario.toString());
    this.logger.info('Init database connection');
    return newUser;
  }

  @Authorized()
  public async delete(id: number): Promise<void> {
    this.log.info('Delete a user');
    await this.userRepository.delete(id);
    return;
  }

  @Authorized()
  public async findAndPaginate(pageable: UsuarioQueryParams): Promise<Page<User>> {
    const options = pageable.getOptions();
    const select = await this.userRepository.findAndCount(options);
    return new Page({ select, pageable });
  }

  @Authorized()
  public async find(options?: FindManyOptions<User>): Promise<User[]> {
    this.log.info('Find all users');
    return this.userRepository.find(options);
  }

  @Authorized()
  public async findOne(options?: FindOneOptions<User>): Promise<User> {
    this.log.info('Find one user');
    return this.userRepository.findOne(options);
  }

  @Authorized()
  public async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }


  public unlinkFile(file: string) {
    const fs = require("fs")
    fs.unlinkSync(file);
  }

  public async validateNewUser(usuario, file): Promise<CustomError> {
    return new Promise(async (resolve, reject) => {
      if (!file || !file.filename) {
        reject(new CustomError(402, 'Imagem inválida', { id: EnumError.IMAGEM_INVALIDA }));
      }

      const userEmail = await this.findOneByEmail(usuario.email);
      if(userEmail && userEmail.status === UserStatus.New) {
        this.unlinkFile(file.path);
        await this.submit_account_code(userEmail);
        reject(new CustomError(402, 'Email já cadastrado, reenviamos o código de verificação', { id: EnumError.REENVIO_CODIGO_VERIFICACAO }));
      }

      if (userEmail) {
        this.unlinkFile(file.path);
        reject(new CustomError(402, 'Email já cadastrado', { id: EnumError.EMAIL_EXISTENTE }));
      }

      if(Number(usuario.termsAndConditions) !== 1) {
        this.unlinkFile(file.path);
        reject( new CustomError(402, 'Aceitar os termos e condições é obrigatório', { id: EnumError.TERMO_CONDICAO }));
      }

      if(usuario.document && cpf.isValid(usuario.document)) {
        this.unlinkFile(file.path);
        reject( new CustomError(402, 'Documento (CPF) informado não é válido', { id: EnumError.CPF_INVALIDO }));
      }

      resolve();
    });
  }

  public async submit_account_code(usuario: User): Promise<CustomError> {
    return new Promise(async (resolve, reject) => {
      // reject(new CustomError(409, 'Erro ao editar usuário'));
      const user = await this.findOne({ where: { id: usuario.id } });

      if (!user) {
        reject(new NotFoundError());
      }

      try {
        const code = Math.floor(100000 + Math.random() * 900000);
        user.confirmation_code = code;
        const { id: _id, ...partial } = user;

        try {
          await this.update(usuario, partial);
        } catch (e) {
          reject(new CustomError(409, 'Erro ao editar usuário' + JSON.stringify(e)));
        }

        try {
          Mail.to = user.email;
          Mail.subject =  "Shawime: Token account verification";
          Mail.message = 'Shawime: Token account verification';
          Mail.template = './submit_account_code';
          Mail.context = { code: user.confirmation_code };

          Mail.sendMail();
        } catch (e) {
          reject(new CustomError(409, 'Erro ao enviar email de confirmacao', { id: EnumError.ENVIO_EMAIL_CONFIRMACAO }));
        }

      } catch (err){
        reject(new CustomError(402, 'It was not possible to send the e-mail with code, please try again', { id: EnumError.IMPOSSIVEL_CRIAR_CODE_AND_USER }));
      }

      resolve();
    });
  }
}
