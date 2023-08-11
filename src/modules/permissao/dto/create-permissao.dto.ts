import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePermissaoDto {
  @IsNotEmpty()
  @MaxLength(250)
  key: string;

  @IsNotEmpty()
  @MaxLength(250)
  descricao: string;
}
