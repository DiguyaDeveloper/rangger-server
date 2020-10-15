import { IsNotEmpty } from 'class-validator';

export class UsuarioValidateTokenRequest {

  @IsNotEmpty({ message: "Informe o id do usuário" })
  user_id: number;

  @IsNotEmpty({ message: "Informe código de verificação" })
  verify_code: number;
}
