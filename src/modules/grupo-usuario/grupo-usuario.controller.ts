import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { GrupoUsuarioService } from './grupo-usuario.service';
import { CreateGrupoUsuarioDto } from './dto/create-grupo-usuario.dto';
import { UpdateGrupoUsuarioDto } from './dto/update-grupo-usuario.dto';
import { FindGrupoUsuarioDto } from './dto/find-grupo-usuario.dto';

@Controller('api/v1/grupo-usuario')
export class GrupoUsuarioController {
  constructor(private readonly service: GrupoUsuarioService) {}

  @Post()
  async create(@Body() dto: CreateGrupoUsuarioDto) {
    return this.service.create(dto);
  }

  @Get()
  async findAll(@Query() dto: FindGrupoUsuarioDto) {
    return this.service.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() dto: UpdateGrupoUsuarioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/usuario/:usuarioId')
  async adicionarUsuario(
    @Param('id', new ParseIntPipe()) grupoUsuarioId: number,
    @Param('usuarioId', new ParseIntPipe()) usuarioId: number
  ) {
    return this.service.adicionarUsuario({
      grupoUsuarioId,
      usuarioId,
    });
  }

  @Delete(':id/usuario/:usuarioId')
  async removerUsuario(
    @Param('id', new ParseIntPipe()) grupoUsuarioId: number,
    @Param('usuarioId', new ParseIntPipe()) usuarioId: number
  ) {
    return this.service.removerUsuario({
      grupoUsuarioId,
      usuarioId,
    });
  }

  @Post(':id/permissao/:permissaoId')
  async adicionarPermissao(
    @Param('id', new ParseIntPipe()) grupoUsuarioId: number,
    @Param('permissaoId', new ParseIntPipe()) permissaoId: number
  ) {
    return this.service.adicionarPermissao({
      grupoUsuarioId,
      permissaoId,
    });
  }

  @Delete(':id/permissao/:permissaoId')
  async removerPermissao(
    @Param('id', new ParseIntPipe()) grupoUsuarioId: number,
    @Param('permissaoId', new ParseIntPipe()) permissaoId: number
  ) {
    return this.service.removerPermissao({
      grupoUsuarioId,
      permissaoId,
    });
  }
}
