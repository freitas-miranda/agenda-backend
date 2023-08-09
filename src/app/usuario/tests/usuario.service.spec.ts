import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../usuario.service';
import { TestsHelper } from '@helpers/tests.helper';
import { UsuarioEntity } from '../entities/usuario.entity';

describe('UsuarioService', () => {
  let service: UsuarioService;
  const repository = TestsHelper.mockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: 'UsuarioEntityRepository',
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('deve criar um registro', async () => {
    const spy = jest.spyOn(UsuarioEntity, 'create');
    const input = {
      email: 'alan@miranda.com',
      senha: '12345678',
    };
    await service.create(input);
    expect(spy).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
  });

  it('deve listar todos registros', async () => {
    await service.findAll();
    expect(repository.find).toHaveBeenCalled();
  });

  it('deve exibir um registro', async () => {
    const id = 'ABC';
    jest.spyOn(repository, 'findOne').mockResolvedValue({ id });

    const retorno = await service.findOne(id);
    expect(retorno).toBeDefined();
    expect(retorno).toEqual({ id });

    const camposParaRetornar = ['id', 'ativo', 'email'];
    expect(repository.findOne).toHaveBeenCalledWith({
      select: camposParaRetornar,
      where: { id },
    });

    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    try {
      await service.findOne(id);
      throw new Error('Não falhou!');
    } catch (error) {
      expect(error).toHaveProperty('message');
      expect(error.message).toContain('Usuário não encontrado!');
    }
  });

  it('deve alterar um registro', async () => {
    const id = 'ABC';
    const input = { ativo: false };
    await service.update(id, input);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id });
    expect(repository.merge).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
  });

  it('deve deletar um registro', async () => {
    const id = 'ABC';
    service.delete(id);
    expect(repository.softDelete).toHaveBeenCalledWith(id);
  });
});
