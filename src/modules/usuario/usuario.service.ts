import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
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
    const { email, senha } = createUsuarioDto;

    const jaExiste = await this.existeUsuarioComEmail(email);
    if (jaExiste) throw new BadRequestException('Já existe usuário cadastrado com este e-mail!');

    const usuario = UsuarioEntity.create(email, senha);
    const { id } = await this.usuarioRepository.save(usuario);
    return { id };
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
    if (!usuario) throw new NotFoundException('Usuário não encontrado!');

    this.usuarioRepository.merge(usuario, updateUsuarioDto);

    await this.usuarioRepository.save(usuario);
  }

  async delete(id: string) {
    await this.usuarioRepository.softDelete(id);
  }

  async existeUsuarioComEmail(email: string): Promise<boolean> {
    const usuarios = await this.usuarioRepository.find({
      select: ['id'],
      where: { email },
    });

    return usuarios?.length > 0;
  }
}
