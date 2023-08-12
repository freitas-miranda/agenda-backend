import { Test, TestingModule } from '@nestjs/testing';
import { GrupoUsuarioService } from '../grupo-usuario.service';
import { TestsHelper } from '@helpers/tests.helper';
import { GrupoUsuarioEntity } from '../entities/grupo-usuario.entity';

describe('GrupoUsuarioService', () => {
  const id = 123;
  const descricao = 'Administradores';

  let service: GrupoUsuarioService;
  const repository = TestsHelper.mockRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrupoUsuarioService,
        {
          provide: 'GrupoUsuarioEntityRepository',
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<GrupoUsuarioService>(GrupoUsuarioService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('deve criar um registro', async () => {
      const spyCreate = jest.spyOn(GrupoUsuarioEntity, 'create');
      const spyExiste = jest.spyOn(service, 'existeGrupoUsuarioComDescricao').mockResolvedValue(false);

      const input = { descricao };
      await service.create(input);
      expect(spyCreate).toHaveBeenCalled();
      expect(spyExiste).toHaveBeenCalledWith(input.descricao);
      expect(repository.save).toHaveBeenCalled();
    });

    it('não deve permitir criar mais de um grupo de usuario com mesma decrição', async () => {
      const input = { descricao };

      jest.spyOn(service, 'existeGrupoUsuarioComDescricao').mockResolvedValue(true);
      try {
        await service.create(input);
        throw new Error('Não falhou!');
      } catch (error) {
        expect(error).toHaveProperty('message');
        expect(error.message).toContain('Já existe grupo de usuário cadastrado com esta descrição!');
      }
    });
  });

  describe('findAll', () => {
    it('deve listar todos registros', async () => {
      const paramsFilter: any = {};
      await service.findAll(paramsFilter);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve exibir um registro', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({ id });

      const retorno = await service.findOne(id);
      expect(retorno).toBeDefined();
      expect(retorno).toEqual({ id });

      const camposParaRetornar = ['id', 'descricao'];
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
        expect(error.message).toContain('Grupo de usuário não encontrado!');
      }
    });
  });

  describe('update', () => {
    it('deve alterar um registro', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue({ id });
      const input = { descricao: 'Nova descrição' };

      const retorno = await service.update(id, input);
      expect(retorno).toBeDefined();
      expect(retorno.mensagem).toEqual('Alterado com sucesso!');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.merge).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve levantar uma exceção quando registro não exisitir ao editar', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      try {
        const input = { descricao: 'Nova descrição' };
        await service.update(id, input);
        throw new Error('Não falhou!');
      } catch (error) {
        expect(error).toHaveProperty('message');
        expect(error.message).toContain('Grupo de usuário não encontrado!');
      }
    });
  });

  describe('remove', () => {
    it('deve remover um registro', async () => {
      const retorno = await service.remove(id);
      expect(retorno).toBeDefined();
      expect(retorno.mensagem).toEqual('Excluído com sucesso!');

      expect(repository.softDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('existeGrupoUsuarioComDescricao', () => {
    it('deve retornar true quando a descrição já existir no banco', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([{ id }]);
      const retorno = await service.existeGrupoUsuarioComDescricao(descricao);
      expect(retorno).toBe(true);
    });

    it('deve retornar false quando a descrição não existir no banco', async () => {
      const spy = jest.spyOn(repository, 'find').mockResolvedValue([]);
      const retorno = await service.existeGrupoUsuarioComDescricao(descricao);
      expect(retorno).toBe(false);
      expect(spy).toHaveBeenCalledWith({ select: ['id'], where: { descricao } });
    });
  });
});
