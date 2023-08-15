import { IsOptional } from 'class-validator';

export class FindUsuarioDto {
  @IsOptional()
  ativo: number;

  @IsOptional()
  email: string;
}
