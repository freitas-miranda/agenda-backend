import { IsNumber } from 'class-validator';

export class GrupoUsuarioUsuarioDto {
  @IsNumber()
  grupoUsuarioId: number;

  @IsNumber()
  usuarioId: number;
}
