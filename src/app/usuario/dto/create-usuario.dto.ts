import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { MessagesHelper } from '@helpers/messages.helper';
import { RegExHelper } from '@helpers/regex.helper';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(RegExHelper.senha, { message: MessagesHelper.PASSWORD_VALID })
  senha: string;
}
