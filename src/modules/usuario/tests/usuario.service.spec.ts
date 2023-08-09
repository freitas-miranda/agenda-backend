import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../usuario.service';
import { TestsHelper } from '@helpers/tests.helper';
import { UsuarioEntity } from '../entities/usuario.entity';

describe('UsuarioService', () => {
  const id = 'ABC';
  const email = 'alan@miranda.com';
  const senha = '12345678';

  let service: UsuarioService;
  const repository = TestsHelper.mockRepository;

  beforeAll(async () => {
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    it('deve criar um registro', async () => {
      const spyCreate = jest.spyOn(UsuarioEntity, 'create');
      const spyExiste = jest.spyOn(service, 'existeUsuarioComEmail').mockResolvedValue(false);

      const input = { email, senha };
      await service.create(input);
      expect(spyCreate).toHaveBeenCalled();
      expect(spyExiste).toHaveBeenCalledWith(input.email);
      expect(repository.save).toHaveBeenCalled();
    });

    it('não deve permitir criar mais de um usuario com mesmo e-amil', async () => {
      const input = { email, senha };

      jest.spyOn(service, 'existeUsuarioComEmail').mockResolvedValue(true);
      try {
        await service.create(input);
        throw new Error('Não falhou!');
      } catch (error) {
        expect(error).toHaveProperty('message');
        expect(error.message).toContain('Já existe usuário cadastrado com este e-mail!');
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

      const camposParaRetornar = ['id', 'ativo', 'email'];
      expect(repository.findOne).toHaveBeenCalledWith({
        select: camposParaRetornar,
        where: { id },
      });
    });

    it('deve levantar uma exceção quando registro não exisitir ao exibir', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      try {
        await service.findOne('abc');
        throw new Error('Não falhou!');
      } catch (error) {
        expect(error).toHaveProperty('message');
        expect(error.message).toContain('Usuário não encontrado!');
      }
    });
  });

  describe('update', () => {
    it('deve alterar um registro', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue({ id });
      const input = { ativo: false };
      await service.update(id, input);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      expect(repository.merge).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('deve levantar uma exceção quando registro não exisitir ao editar', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      try {
        const input = { ativo: false };
        await service.update(id, input);
        throw new Error('Não falhou!');
      } catch (error) {
        expect(error).toHaveProperty('message');
        expect(error.message).toContain('Usuário não encontrado!');
      }
    });
  });

  describe('delete', () => {
    it('deve deletar um registro', async () => {
      service.delete(id);
      expect(repository.softDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('existeUsuarioComEmail', () => {
    it('deve retornar true quando o e-mail já existir no banco', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([{ id }]);
      const retorno = await service.existeUsuarioComEmail(email);
      expect(retorno).toBe(true);
    });

    it('deve retornar false quando o e-mail não existir no banco', async () => {
      const spy = jest.spyOn(repository, 'find').mockResolvedValue([]);
      const retorno = await service.existeUsuarioComEmail(email);
      expect(retorno).toBe(false);
      expect(spy).toHaveBeenCalledWith({ select: ['id'], where: { email } });
    });
  });
});
