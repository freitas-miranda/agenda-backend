import { Like, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGrupoUsuarioDto } from './dto/create-grupo-usuario.dto';
import { UpdateGrupoUsuarioDto } from './dto/update-grupo-usuario.dto';
import { GrupoUsuarioEntity } from './entities/grupo-usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindGrupoUsuarioDto } from './dto/find-grupo-usuario.dto';

@Injectable()
export class GrupoUsuarioService {
  constructor(
    @InjectRepository(GrupoUsuarioEntity)
    private readonly repository: Repository<GrupoUsuarioEntity>
  ) {}

  async create(dto: CreateGrupoUsuarioDto) {
    const { descricao } = dto;

    const jaExiste = await this.existeGrupoUsuarioComDescricao(descricao);
    if (jaExiste) throw new BadRequestException('Já existe grupo de usuário cadastrado com esta descrição!');

    const usuario = GrupoUsuarioEntity.create(descricao);
    const criado = await this.repository.save(usuario);
    return { id: criado?.id };
  }

  async findAll(dto: FindGrupoUsuarioDto) {
    const where: any = {};

    if (dto.hasOwnProperty('descricao')) {
      where.descricao = Like(`%${dto.descricao}%`);
    }

    return this.repository.find({
      select: ['id', 'descricao'],
      where,
    });
  }

  async findOne(id: number) {
    const registro = await this.repository.findOne({
      select: ['id', 'descricao'],
      where: { id },
    });
    if (!registro) throw new NotFoundException('Grupo de usuário não encontrado!');
    return registro;
  }

  async update(id: number, dto: UpdateGrupoUsuarioDto) {
    const registro = await this.repository.findOneBy({ id });
    if (!registro) throw new NotFoundException('Grupo de usuário não encontrado!');

    this.repository.merge(registro, dto);

    await this.repository.save(registro);

    return { mensagem: 'Alterado com sucesso!' };
  }

  async remove(id: number) {
    await this.repository.softDelete(id);

    return { mensagem: 'Excluído com sucesso!' };
  }

  async existeGrupoUsuarioComDescricao(descricao: string): Promise<boolean> {
    const registros = await this.repository.find({
      select: ['id'],
      where: { descricao },
    });

    return registros?.length > 0;
  }
}
