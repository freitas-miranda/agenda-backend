import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = UsuarioEntity.create(createUsuarioDto.email, createUsuarioDto.senha);
    return this.usuarioRepository.save(usuario);
  }

  async findAll() {
    return this.usuarioRepository.find({ select: ['id', 'ativo', 'email'] });
  }

  async findOne(id: string) {
    const usuario = await this.usuarioRepository.findOne({
      select: ['id', 'ativo', 'email'],
      where: { id },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado!');
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    this.usuarioRepository.merge(usuario, updateUsuarioDto);
    await this.usuarioRepository.save(usuario);
  }

  async delete(id: string) {
    await this.usuarioRepository.softDelete(id);
  }
}
