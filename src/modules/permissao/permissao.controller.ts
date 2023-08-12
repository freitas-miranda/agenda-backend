import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { PermissaoService } from './permissao.service';
import { CreatePermissaoDto } from './dto/create-permissao.dto';
import { UpdatePermissaoDto } from './dto/update-permissao.dto';
import { FindPermissaoDto } from './dto/find-permissao.dto';

@Controller('api/v1/permissao')
export class PermissaoController {
  constructor(private readonly service: PermissaoService) {}

  @Post()
  async create(@Body() createPermissaoDto: CreatePermissaoDto) {
    return this.service.create(createPermissaoDto);
  }

  @Get()
  async findAll(@Query() dto: FindPermissaoDto) {
    return this.service.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() updatePermissaoDto: UpdatePermissaoDto) {
    return this.service.update(id, updatePermissaoDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.service.remove(id);
  }
}
