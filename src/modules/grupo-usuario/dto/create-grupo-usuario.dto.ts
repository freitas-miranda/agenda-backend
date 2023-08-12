import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGrupoUsuarioDto {
  @IsNotEmpty()
  @MaxLength(250)
  descricao: string;
}
