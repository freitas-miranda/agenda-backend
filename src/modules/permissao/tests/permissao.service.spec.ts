import { Test, TestingModule } from '@nestjs/testing';
import { PermissaoService } from '../permissao.service';
import { TestsHelper } from '@helpers/tests.helper';
import { PermissaoEntity } from '../entities/permissao.entity';

describe('PermissaoService', () => {
  const id = 123;
  const key = 'admin';
  const descricao = 'Descricação da permissão';

  let service: PermissaoService;
  const repository = TestsHelper.mockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissaoService,
        {
          provide: 'PermissaoEntityRepository',
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<PermissaoService>(PermissaoService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('deve criar um registro', async () => {
      const spyCreate = jest.spyOn(PermissaoEntity, 'create');
      const spyExiste = jest.spyOn(service, 'existePermissaoComKey').mockResolvedValue(false);

      const input = { key, descricao };
      await service.create(input);
      expect(spyCreate).toHaveBeenCalled();
      expect(spyExiste).toHaveBeenCalledWith(input.key);
      expect(repository.save).toHaveBeenCalled();
    });

    it('não deve permitir criar mais de uma permissão com a mesma key', async () => {
      const input = { key, descricao };

      jest.spyOn(service, 'existePermissaoComKey').mockResolvedValue(true);
      try {
        await service.create(input);
        throw new Error('Não falhou!');
      } catch (error) {
        expect(error).toHaveProperty('message');
        expect(error.message).toContain('Já existe permissão cadastrada com esta key!');
      }
    });
  });

  describe('findAll', () => {
    it('deve listar todos registros', async () => {
      await service.findAll();
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve exibir um registro', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({ id });

      const retorno = await service.findOne(id);
      expect(retorno).toBeDefined();
      expect(retorno).toEqual({ id });

      const camposParaRetornar = ['id', 'key', 'descricao'];
      expect(repository.findOne).toHaveBeenCalledWith({
        select: camposParaRetornar,
        where: { id },
      });
    });

    it('deve levantar uma exceção quando registro não exisitir ao exibir', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      try {
        await service.findOne(123);
        throw new Error('Não falhou!');
      } catch (error) {
        expect(error).toHaveProperty('message');
        expect(error.message).toContain('Permissão não encontrada!');
      }
    });
  });

  describe('update', () => {
    it('deve alterar um registro', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue({ id });
      const input = { key, descricao };
      await service.update(id, input);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.merge).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve levantar uma exceção quando registro não exisitir ao editar', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      try {
        const input = { key, descricao };
        await service.update(id, input);
        throw new Error('Não falhou!');
      } catch (error) {
        expect(error).toHaveProperty('message');
        expect(error.message).toContain('Permissão não encontrada!');
      }
    });
  });

  describe('remove', () => {
    it('deve remover um registro', async () => {
      service.remove(id);
      expect(repository.softDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('existePermissaoComKey', () => {
    it('deve retornar true quando a key já existir no banco', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([{ id }]);
      const retorno = await service.existePermissaoComKey(key);
      expect(retorno).toBe(true);
    });

    it('deve retornar false quando a key não existir no banco', async () => {
      const spy = jest.spyOn(repository, 'find').mockResolvedValue([]);
      const retorno = await service.existePermissaoComKey(key);
      expect(retorno).toBe(false);
      expect(spy).toHaveBeenCalledWith({ select: ['id'], where: { key } });
    });
  });
});
