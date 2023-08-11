import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissaoDto } from './dto/create-permissao.dto';
import { UpdatePermissaoDto } from './dto/update-permissao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissaoEntity } from './entities/permissao.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissaoService {
  constructor(
    @InjectRepository(PermissaoEntity)
    private readonly permissaoRepository: Repository<PermissaoEntity>
  ) {}

  async create(createPermissaoDto: CreatePermissaoDto) {
    const { key, descricao } = createPermissaoDto;

    const jaExiste = await this.existePermissaoComKey(key);
    if (jaExiste) throw new BadRequestException('Já existe permissão cadastrada com esta key!');

    const permissao = PermissaoEntity.create(key, descricao);
    const criado = await this.permissaoRepository.save(permissao);
    return { id: criado?.id };
  }

  async findAll() {
    return this.permissaoRepository.find({ select: ['id', 'key', 'descricao'] });
  }

  async findOne(id: number) {
    const registro = await this.permissaoRepository.findOne({
      select: ['id', 'key', 'descricao'],
      where: { id },
    });
    if (!registro) throw new NotFoundException('Permissão não encontrada!');
    return registro;
  }

  async update(id: number, updatePermissaoDto: UpdatePermissaoDto) {
    const registro = await this.permissaoRepository.findOneBy({ id });
    if (!registro) throw new NotFoundException('Permissão não encontrada!');

    this.permissaoRepository.merge(registro, updatePermissaoDto);

    await this.permissaoRepository.save(registro);

    return { mensagem: 'Alterado com sucesso!' };
  }

  async remove(id: number) {
    await this.permissaoRepository.softDelete(id);

    return { mensagem: 'Excluído com sucesso!' };
  }

  async existePermissaoComKey(key: string): Promise<boolean> {
    const registros = await this.permissaoRepository.find({
      select: ['id'],
      where: { key },
    });

    return registros?.length > 0;
  }
}
