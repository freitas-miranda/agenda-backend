import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGrupoUsuarioDto } from './dto/create-grupo-usuario.dto';
import { FindGrupoUsuarioDto } from './dto/find-grupo-usuario.dto';
import { GrupoUsuarioEntity } from './entities/grupo-usuario.entity';
import { GrupoUsuarioPermissaoEntity } from './entities/grupo-usuario-permissao.entity';
import { GrupoUsuarioUsuarioDto } from './dto/grupo-usuario-usuario.dto';
import { GrupoUsuarioUsuarioEntity } from './entities/grupo-usuario-usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UpdateGrupoUsuarioDto } from './dto/update-grupo-usuario.dto';
import { GrupoUsuarioPermissaoDto } from './dto/grupo-usuario-permissao.dto';

@Injectable()
export class GrupoUsuarioService {
  constructor(
    @InjectRepository(GrupoUsuarioEntity)
    private readonly grupoUsuarioRepository: Repository<GrupoUsuarioEntity>,

    @InjectRepository(GrupoUsuarioUsuarioEntity)
    private readonly grupoUsuarioUsuarioRepository: Repository<GrupoUsuarioUsuarioEntity>,

    @InjectRepository(GrupoUsuarioPermissaoEntity)
    private readonly grupoUsuarioPermissaoRepository: Repository<GrupoUsuarioPermissaoEntity>
  ) {}

  async create(dto: CreateGrupoUsuarioDto) {
    const { descricao } = dto;

    const jaExiste = await this.existeGrupoUsuarioComDescricao(descricao);
    if (jaExiste) throw new BadRequestException('Já existe grupo de usuário cadastrado com esta descrição!');

    const usuario = GrupoUsuarioEntity.create(descricao);
    const criado = await this.grupoUsuarioRepository.save(usuario);
    return { id: criado?.id };
  }

  async findAll(dto: FindGrupoUsuarioDto) {
    const where: any = {};

    if (dto.hasOwnProperty('descricao')) {
      where.descricao = Like(`%${dto.descricao}%`);
    }

    return this.grupoUsuarioRepository.find({
      select: ['id', 'descricao'],
      where,
    });
  }

  async findOne(id: number) {
    const registro = await this.grupoUsuarioRepository.findOne({
      select: ['id', 'descricao'],
      where: { id },
    });
    if (!registro) throw new NotFoundException('Grupo de usuário não encontrado!');
    return registro;
  }

  async update(id: number, dto: UpdateGrupoUsuarioDto) {
    const registro = await this.grupoUsuarioRepository.findOneBy({ id });
    if (!registro) throw new NotFoundException('Grupo de usuário não encontrado!');

    this.grupoUsuarioRepository.merge(registro, dto);

    await this.grupoUsuarioRepository.save(registro);

    return { mensagem: 'Alterado com sucesso!' };
  }

  async remove(id: number) {
    await this.grupoUsuarioRepository.softDelete(id);

    return { mensagem: 'Excluído com sucesso!' };
  }

  async adicionarUsuario(dto: GrupoUsuarioUsuarioDto) {
    const { grupoUsuarioId, usuarioId } = dto;

    const relacionamento = GrupoUsuarioUsuarioEntity.create(grupoUsuarioId, usuarioId);
    const criado = await this.grupoUsuarioUsuarioRepository.save(relacionamento);

    return {
      mensagem: 'Usuário adicionado ao grupo!',
      id: criado?.id,
    };
  }

  async removerUsuario(dto: GrupoUsuarioUsuarioDto) {
    const { grupoUsuarioId, usuarioId } = dto;

    await this.grupoUsuarioUsuarioRepository.softDelete({ grupoUsuarioId, usuarioId });

    return { mensagem: 'Usuário removido do grupo!' };
  }

  async adicionarPermissao(dto: GrupoUsuarioPermissaoDto) {
    const { grupoUsuarioId, permissaoId } = dto;

    const relacionamento = GrupoUsuarioPermissaoEntity.create(grupoUsuarioId, permissaoId);
    const criado = await this.grupoUsuarioPermissaoRepository.save(relacionamento);

    return {
      mensagem: 'Permissão adicionada ao grupo!',
      id: criado?.id,
    };
  }

  async removerPermissao(dto: GrupoUsuarioPermissaoDto) {
    const { grupoUsuarioId, permissaoId } = dto;

    await this.grupoUsuarioPermissaoRepository.softDelete({ grupoUsuarioId, permissaoId });

    return { mensagem: 'Permissão removida do grupo!' };
  }

  async existeGrupoUsuarioComDescricao(descricao: string): Promise<boolean> {
    const registros = await this.grupoUsuarioRepository.find({
      select: ['id'],
      where: { descricao },
    });

    return registros?.length > 0;
  }
}
