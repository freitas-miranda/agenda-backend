import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PermissaoService } from './permissao.service';
import { CreatePermissaoDto } from './dto/create-permissao.dto';
import { UpdatePermissaoDto } from './dto/update-permissao.dto';

@Controller('api/v1/permissao')
export class PermissaoController {
  constructor(private readonly permissaoService: PermissaoService) {}

  @Post()
  async create(@Body() createPermissaoDto: CreatePermissaoDto) {
    return this.permissaoService.create(createPermissaoDto);
  }

  @Get()
  async findAll() {
    return this.permissaoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.permissaoService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() updatePermissaoDto: UpdatePermissaoDto) {
    return this.permissaoService.update(id, updatePermissaoDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.permissaoService.remove(id);
  }
}
