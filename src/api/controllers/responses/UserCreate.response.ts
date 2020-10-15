import { User, UserStatus } from 'src/api/models/user-models/User.model';

/**
 * @swagger
 * definitions:
 *  UserCreateResponse:
 *    type: object
 *    properties:
 *      errors:
 *        type: Object
 *        items:
 *            $ref: "#/definitions/UserCreateResponse"
 */
export class UserCreateResponse {

  constructor(usuario: User) {
    this.usuario = this.transformUser(usuario);
    this.status = usuario.status;
  }
  usuario: UsuarioResponse;
  status: UserStatus;
  token: string;
  expiresIn: string;

  transformUser(usuario: User): UsuarioResponse {
    return new UsuarioResponse(
      usuario.id,
      usuario.name,
      usuario.email,
      usuario.lastname,
      ''
    )
  }
}

export class UsuarioResponse {

  constructor(
    id: number,
    name: string,
    lastname: string,
    email: string,
    picture: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.lastname = lastname;
    this.picture = this.handleImageUrl(picture);
  }

  id: number
  name: string
  lastname: string;
  email: string
  picture: string;

  handleImageUrl(picture: string) {
    return `http://localhost:8080/${picture}`;
  }
}

