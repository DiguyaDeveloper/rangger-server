import { Response } from 'express';
import multer from 'multer';
import {
    Body, Delete, Get, JsonController, NotFoundError, Param, Post, Put, UploadedFile
} from 'routing-controllers';

import { User, UserStatus } from '../models/user-models/User.model';
import { UsuarioService } from '../services/UsuarioService';
import { CustomError } from './errors/CustomError';
import { EnumError } from './errors/Error';
import { UsuarioRequest } from './requests/Usuario.request';
import { UsuarioValidateTokenRequest } from './requests/UsuarioValidateToken.request';
import { UserCreateResponse } from './responses/UserCreate.response';

const path = require('path');
const imageFilter = function (req, file, callback) {
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(null, false);
  }
  return callback(null, true);
}

const FILE_UPLOAD_OPTIONS = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', '..', 'data', 'uploads'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const d = new Date();
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
      cb(null, `${req.body.document}-${da}-${mo}-${ye}${ext}`.toLowerCase());
    },
  }),
  fileFilter: imageFilter
}

@JsonController('/usuarios')
export class UserController {

  constructor(
    private userService: UsuarioService
  ) {
  }

  @Post()
  public async create(@UploadedFile("file", { options: FILE_UPLOAD_OPTIONS }) file: any, @Body() usuario: UsuarioRequest) {

    const errors = await this.userService.validateNewUser(usuario, file);

    console.log('errors', errors)

    const newUser = new User(
      usuario.name,
      usuario.lastname,
      usuario.email,
      usuario.password,
      usuario.document,
      UserStatus.New,
      usuario.termsAndConditions,
      1,
    );

    try {
      await this.userService.save(newUser)
    } catch (error) {
      throw new CustomError(402, 'Erro na criação do usuário', { id: EnumError.CRIACAO_USUARIO_FALHA });
    }

    await this.userService.submit_account_code(newUser);

    return new UserCreateResponse(newUser);
  }

  /**
   * Api para editar usuário
   * @param usuario
   */
  @Put('/verificacao')
  public async update_statusAccount_token(@Body() usuario: UsuarioValidateTokenRequest){

    try {
      const user: User = await this.userService.findOne(
        { where : { id: usuario.user_id}}
      );

      if (!user) {
        throw new CustomError(402, 'Usuário não encontrado', { id: EnumError.USUARIO_NAO_ENCONTRADO });
      }

      if (usuario.verify_code !== user.confirmation_code) {
        throw new CustomError(402, 'Código de verificação inválido', { id: EnumError.CODIGO_VERIFICACAO_INVALIDO });
      }

      user.status = UserStatus.Active;
      const { id: _id, ...partial } = user;

      try {
        await this.userService.update(user, partial);
      } catch (e) {
        throw new CustomError(409, 'Erro ao editar usuário' + JSON.stringify(e));
      }
    } catch (err){
      throw new CustomError(402, 'Erro ao ativar o usuário', { id: EnumError.CONFIRMAR_USUARIO });
    }
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() body: User, res: Response): Promise<User> {
    const usuario = await this.userService.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundError();
    }

    const { id: _id, password: _senha, ...partial } = body;

    try {
      const updated = await this.userService.update(usuario, partial);
      return updated;
    } catch (e) {
      throw new CustomError(409, 'Erro ao editar usuário' + JSON.stringify(e));
    }
  }

  @Delete('/:id')
  public delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }

  @Get('/listar')
  public get(): Promise<User[]> {
    return this.userService.find();
  }

  unlinkFile(file: string) {
    const fs = require("fs")
    fs.unlinkSync(file);
  }

  /**
   * @swagger
   * definitions:
   *  UserResponse:
   *    type: object
   *    properties:
   *      _id:
   *        type: string
   *      username:
   *        type: string
   */

  /**
   * @swagger
   * definitions:
   *  CreateUser:
   *    type: object
   *    properties:
   *      name:
   *        type: string
   *        example: lorem
   *      email:
   *        type: string
   *        example: lorem@ipsun.com
   *      lastname:
   *        type: string
   *        example: lorem
   *      document:
   *        type: string
   *        example: '10553173928'
   *      password:
   *        type: string
   *        example: lorem
   *      termsAndConditions:
   *        type: string
   *        example: '1'
   *      file:
   *        type: string
   *        example: local
   * 		required:
   *      - name
   *      - email
   *      - lastname
   *      - password
   *      - termsAndConditions
   *      - picture
   *      - roleId
   *      - status
   */

  /**
   * @swagger
   * definitions:
   *  LoginUser:
   *    type: object
   *    properties:
   *      username:
   *        type: string
   *        example: chnirt
   *      password:
   *        type: string
   *        example: "0"
   * 		required:
   *      - username
   *      - password
   */

  /**
   * @swagger
   * definitions:
   *  ErrorResponse:
   *    type: object
   *    properties:
   *      message:
   *        type: string
   *      status:
   *        type: number
   *      property:
   *        type: any
   */

  /**
   * @swagger
   * definitions:
   *  ValidateErrorResponse:
   *    type: object
   *    properties:
   *      errors:
   *        type: array
   *        items:
   *            $ref: "#/definitions/UserResponse"
   */

  /**
   * @swagger
   * /rangger/usuarios/listar:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *     - users
   *     summary: Get users 👻
   *     description: Ok
   *     consumes:
   *     - application/json
   *     produces:
   *     - application/json
   *     responses:
   *       200:
   *         description: Get users successful
   *         schema:
   *            type: array
   *            items:
   *                $ref: "#/definitions/UserResponse"
   *       401:
   *         description: Token is invalid
   *         schema:
   *            $ref: "#/definitions/ErrorResponse"
   */

  /**
  * @swagger
  * /rangger/usuarios:
  *   delete:
  *     tags:
  *     - users
  *     summary: Delete user 👻
  *     description: Exclusão de usuário
  *     consumes:
  *     - application/json
  *     produces:
  *     - application/json
  *     parameters:
  *     - in: Param
  *       name: Param
  *       description: Update user object
  *       required: true
  *       schema:
  *         $ref: "id"
  *     responses:
  *       201:
  *         description: Updated successful
  *       403:
  *         description: Sem acesso ao usuário
  *         schema:
  *            $ref: "#/definitions/ErrorResponse"
  *       422:
  *         description: Validate Error
  *         schema:
  *            $ref: "#/definitions/ValidateErrorResponse"
  *       500:
  *         description: Error
  *         schema:
  *            $ref: "#/definitions/ErrorResponse"
  */

  /**
* @swagger
* /rangger/usuarios:
*   put:
*     tags:
*     - users
*     summary: Update user 👻
*     description: Alteração de usuário
*     consumes:
*     - application/json
*     produces:
*     - application/json
*     parameters:
*     - in: body
*       name: body
*       description: Update user object
*       required: true
*       schema:
*         $ref: "#/definitions/CreateUser"
*     responses:
*       201:
*         description: Updated successful
*         schema:
*            $ref: "#/definitions/UserResponse"
*       403:
*         description: Sem acesso ao usuário
*         schema:
*            $ref: "#/definitions/ErrorResponse"
*       422:
*         description: Validate Error
*         schema:
*            $ref: "#/definitions/ValidateErrorResponse"
*       500:
*         description: Error
*         schema:
*            $ref: "#/definitions/ErrorResponse"
*/


  /**
   * @swagger
   * /rangger/usuarios:
   *   post:
   *     tags:
   *     - users
   *     summary: Create user 👻
   *     description: Give me the f**king your information to create
   *     consumes:
   *     - application/json
   *     produces:
   *     - application/json
   *     parameters:
   *     - in: body
   *       name: body
   *       description: Created user object
   *       required: true
   *       schema:
   *         $ref: "#/definitions/CreateUser"
   *     responses:
   *       201:
   *         description: Registered successful
   *         schema:
   *            $ref: "#/definitions/UserResponse"
   *       403:
   *         description: Username is existed
   *         schema:
   *            $ref: "#/definitions/ErrorResponse"
   *       422:
   *         description: Validate Error
   *         schema:
   *            $ref: "#/definitions/ValidateErrorResponse"
   *       500:
   *         description: Error
   *         schema:
   *            $ref: "#/definitions/ErrorResponse"
   */

}
