import { IsNumber } from 'class-validator';

export class GrupoUsuarioPermissaoDto {
  @IsNumber()
  grupoUsuarioId: number;

  @IsNumber()
  permissaoId: number;
}
