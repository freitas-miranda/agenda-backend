import { IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';
import { MessagesHelper } from '@helpers/messages.helper';
import { RegExHelper } from '@helpers/regex.helper';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(250)
  email: string;

  @IsNotEmpty()
  @Matches(RegExHelper.senha, { message: MessagesHelper.PASSWORD_VALID })
  @MaxLength(250)
  senha: string;
}
