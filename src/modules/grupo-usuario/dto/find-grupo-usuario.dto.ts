import { IsOptional } from 'class-validator';

export class FindGrupoUsuarioDto {
  @IsOptional()
  descricao: string;
}
