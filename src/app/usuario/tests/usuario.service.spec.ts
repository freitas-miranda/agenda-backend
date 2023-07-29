import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../usuario.service';
import { TestsHelper } from '@helpers/tests.helper';

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
    const input = {
      email: 'alan@miranda.com',
      senha: '12345678',
    };
    await service.create(input);
    expect(repository.create).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalled();
  });

  it('deve listar todos registros', async () => {
    await service.findAll();
    expect(repository.find).toHaveBeenCalled();
  });

  it('deve exibir um registro', async () => {
    const id = 'ABC';
    jest.spyOn(repository, 'findOneBy').mockResolvedValue({ id });

    const retorno = await service.findOne(id);
    expect(retorno).toBeDefined();
    expect(retorno).toEqual({ id });
    expect(repository.findOneBy).toHaveBeenCalledWith({ id });

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
    try {
      await service.findOne(id);
      throw new Error('Não falhou!');
    } catch (error) {
      expect(error).toHaveProperty('message');
      expect(error.message).toContain('Usuário não encotnrado!');
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
