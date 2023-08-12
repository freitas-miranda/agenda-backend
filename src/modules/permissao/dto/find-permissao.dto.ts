import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissaoDto } from './create-permissao.dto';

export class FindPermissaoDto extends PartialType(CreatePermissaoDto) {}
