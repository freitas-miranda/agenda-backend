import { PartialType } from '@nestjs/mapped-types';
import { CreateGrupoUsuarioDto } from './create-grupo-usuario.dto';

export class UpdateGrupoUsuarioDto extends PartialType(CreateGrupoUsuarioDto) {}
