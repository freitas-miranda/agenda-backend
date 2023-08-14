import { Test, TestingModule } from '@nestjs/testing';
import { GrupoUsuarioService } from '../grupo-usuario.service';
import { TestsHelper } from '@helpers/tests.helper';
import { GrupoUsuarioEntity } from '../entities/grupo-usuario.entity';
import { GrupoUsuarioUsuarioEntity } from '../entities/grupo-usuario-usuario.entity';

describe('GrupoUsuarioService', () => {
  const id = 123;
  const descricao = 'Administradores';

  const testsHelper = new TestsHelper();

  let service: GrupoUsuarioService;
  const grupoUsuarioRepository = testsHelper.mockRepository();
  const grupoUsuarioUsuarioRepository = testsHelper.mockRepository();
  const grupoUsuarioPermissaoRepository = testsHelper.mockRepository();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrupoUsuarioService,
        {
          provide: 'GrupoUsuarioEntityRepository',
          useValue: grupoUsuarioRepository,
        },
        {
          provide: 'GrupoUsuarioUsuarioEntityRepository',
          useValue: grupoUsuarioUsuarioRepository,
        },
        {
          provide: 'GrupoUsuarioPermissaoEntityRepository',
          useValue: grupoUsuarioPermissaoRepository,
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
      expect(grupoUsuarioRepository.save).toHaveBeenCalled();
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
      expect(grupoUsuarioRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve exibir um registro', async () => {
      jest.spyOn(grupoUsuarioRepository, 'findOne').mockResolvedValue({ id });

      const retorno = await service.findOne(id);
      expect(retorno).toBeDefined();
      expect(retorno).toEqual({ id });

      const camposParaRetornar = ['id', 'descricao'];
      expect(grupoUsuarioRepository.findOne).toHaveBeenCalledWith({
        select: camposParaRetornar,
        where: { id },
      });
    });

    it('deve levantar uma exceção quando registro não exisitir ao exibir', async () => {
      jest.spyOn(grupoUsuarioRepository, 'findOne').mockResolvedValue(null);
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
      jest.spyOn(grupoUsuarioRepository, 'findOneBy').mockResolvedValue({ id });
      const input = { descricao: 'Nova descrição' };

      const retorno = await service.update(id, input);
      expect(retorno).toBeDefined();
      expect(retorno.mensagem).toEqual('Alterado com sucesso!');

      expect(grupoUsuarioRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(grupoUsuarioRepository.merge).toHaveBeenCalled();
      expect(grupoUsuarioRepository.save).toHaveBeenCalled();
    });

    it('deve levantar uma exceção quando registro não exisitir ao editar', async () => {
      jest.spyOn(grupoUsuarioRepository, 'findOneBy').mockResolvedValue(null);
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

      expect(grupoUsuarioRepository.softDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('grupo x usuário', () => {
    it('deve adicionar um usuário ao grupo', async () => {
      const spyRelacionamento = jest.spyOn(GrupoUsuarioUsuarioEntity, 'create');
      const input = {
        grupoUsuarioId: 1,
        usuarioId: 1,
      };

      const retorno = await service.adicionarUsuario(input);
      expect(retorno).toBeDefined();
      expect(retorno.mensagem).toContain('Usuário adicionado ao grupo!');
      expect(retorno).toHaveProperty('id');

      expect(spyRelacionamento).toHaveBeenCalled();
      expect(grupoUsuarioUsuarioRepository.save).toHaveBeenCalled();
    });

    it('deve remover um usuário do grupo', async () => {
      const input = {
        grupoUsuarioId: 1,
        usuarioId: 1,
      };

      const retorno = await service.removerUsuario(input);
      expect(retorno).toBeDefined();
      expect(retorno.mensagem).toContain('Usuário removido do grupo!');

      expect(grupoUsuarioUsuarioRepository.softDelete).toHaveBeenCalled();
    });
  });

  describe('existeGrupoUsuarioComDescricao', () => {
    it('deve retornar true quando a descrição já existir no banco', async () => {
      jest.spyOn(grupoUsuarioRepository, 'find').mockResolvedValue([{ id }]);
      const retorno = await service.existeGrupoUsuarioComDescricao(descricao);
      expect(retorno).toBe(true);
    });

    it('deve retornar false quando a descrição não existir no banco', async () => {
      const spy = jest.spyOn(grupoUsuarioRepository, 'find').mockResolvedValue([]);
      const retorno = await service.existeGrupoUsuarioComDescricao(descricao);
      expect(retorno).toBe(false);
      expect(spy).toHaveBeenCalledWith({ select: ['id'], where: { descricao } });
    });
  });
});
