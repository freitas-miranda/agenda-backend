import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissaoDto } from './dto/create-permissao.dto';
import { UpdatePermissaoDto } from './dto/update-permissao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissaoEntity } from './entities/permissao.entity';
import { Like, Repository } from 'typeorm';
import { FindPermissaoDto } from './dto/find-permissao.dto';

@Injectable()
export class PermissaoService {
  constructor(
    @InjectRepository(PermissaoEntity)
    private readonly repository: Repository<PermissaoEntity>
  ) {}

  async create(createPermissaoDto: CreatePermissaoDto) {
    const { key, descricao } = createPermissaoDto;

    const jaExiste = await this.existePermissaoComKey(key);
    if (jaExiste) throw new BadRequestException('Já existe permissão cadastrada com esta key!');

    const permissao = PermissaoEntity.create(key, descricao);
    const criado = await this.repository.save(permissao);
    return { id: criado?.id };
  }

  async findAll(dto: FindPermissaoDto) {
    const where: any = {};

    if (dto.hasOwnProperty('key')) {
      where.key = dto.key;
    }

    if (dto.hasOwnProperty('descricao')) {
      where.descricao = Like(`%${dto.descricao}%`);
    }

    return this.repository.find({
      select: ['id', 'key', 'descricao'],
      where,
    });
  }

  async findOne(id: number) {
    const registro = await this.repository.findOne({
      select: ['id', 'key', 'descricao'],
      where: { id },
    });
    if (!registro) throw new NotFoundException('Permissão não encontrada!');
    return registro;
  }

  async update(id: number, updatePermissaoDto: UpdatePermissaoDto) {
    const registro = await this.repository.findOneBy({ id });
    if (!registro) throw new NotFoundException('Permissão não encontrada!');

    this.repository.merge(registro, updatePermissaoDto);

    await this.repository.save(registro);

    return { mensagem: 'Alterado com sucesso!' };
  }

  async remove(id: number) {
    await this.repository.softDelete(id);

    return { mensagem: 'Excluído com sucesso!' };
  }

  async existePermissaoComKey(key: string): Promise<boolean> {
    const registros = await this.repository.find({
      select: ['id'],
      where: { key },
    });

    return registros?.length > 0;
  }
}
