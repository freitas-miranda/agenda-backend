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
}
