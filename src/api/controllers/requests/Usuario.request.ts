import { IsEmail, IsNotEmpty, IsNumberString, MaxLength, MinLength } from 'class-validator';

export class UsuarioRequest {

  @IsNotEmpty({ message: "Informe Nome" })
  name: string;

  @IsNotEmpty({ message: "Informe Username" })
  lastname: string;

  @IsEmail({ allow_display_name: true }, {
    message: 'The email is not valid'
  })
  @IsNotEmpty({
    message: 'Email is required'
  })
  email: string;

  @IsNotEmpty({ message: "Informe Senha" })
  password: string;

  @IsNotEmpty({ message: "CPF é obrigatório" })
  @MinLength(11, {
    message: "Quantidade de caracteres esperada: 11."
  })
  @MaxLength(11, {
    message: "Quantidade de caracteres esperada: 11."
  })
  document: string;

  @IsNotEmpty({ message: "Informe termsAndConditions" })
  @IsNumberString(
    {}, { message: "Informe termsAndConditions 0 ou 1" })
  termsAndConditions?: number;

}
