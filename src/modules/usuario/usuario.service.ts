import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUsuarioDto } from './dto/find-usuario.dto';

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
    const criado = await this.usuarioRepository.save(usuario);
    return { id: criado?.id };
  }

  async findAll(dto: FindUsuarioDto) {
    const where: any = {};

    if (dto.hasOwnProperty('email')) {
      where.email = dto.email;
    }

    return this.usuarioRepository.find({
      select: ['id', 'ativo', 'email'],
      where,
    });
  }

  async findOne(id: number) {
    const registro = await this.usuarioRepository.findOne({
      select: ['id', 'ativo', 'email'],
      where: { id },
    });
    if (!registro) throw new NotFoundException('Usuário não encontrado!');
    return registro;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const registro = await this.usuarioRepository.findOneBy({ id });
    if (!registro) throw new NotFoundException('Usuário não encontrado!');

    this.usuarioRepository.merge(registro, updateUsuarioDto);

    await this.usuarioRepository.save(registro);

    return { mensagem: 'Alterado com sucesso!' };
  }

  async remove(id: number) {
    await this.usuarioRepository.softDelete(id);

    return { mensagem: 'Excluído com sucesso!' };
  }

  async existeUsuarioComEmail(email: string): Promise<boolean> {
    const registros = await this.usuarioRepository.find({
      select: ['id'],
      where: { email },
    });

    return registros?.length > 0;
  }
}
