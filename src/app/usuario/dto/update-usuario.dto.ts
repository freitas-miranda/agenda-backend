import { IsOptional } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  ativo: boolean;
}
