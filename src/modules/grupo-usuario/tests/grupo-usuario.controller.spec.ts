import { Test, TestingModule } from '@nestjs/testing';
import { GrupoUsuarioController } from '../grupo-usuario.controller';
import { GrupoUsuarioService } from '../grupo-usuario.service';
import { TestsHelper } from '@helpers/tests.helper';

describe('GrupoUsuarioController', () => {
  let controller: GrupoUsuarioController;
  let service: GrupoUsuarioService;

  const testsHelper = new TestsHelper();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrupoUsuarioController],
      providers: [
        {
          provide: GrupoUsuarioService,
          useValue: testsHelper.mockService({
            adicionarUsuario: jest.fn(),
            removerUsuario: jest.fn(),
            adicionarPermissao: jest.fn(),
            removerPermissao: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<GrupoUsuarioController>(GrupoUsuarioController);
    service = module.get<GrupoUsuarioService>(GrupoUsuarioService);
  });

  it('deve criar um registro', async () => {
    const input = {
      descricao: 'Administradores',
    };
    await controller.create(input);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(input);
  });

  it('deve listar todos registros', async () => {
    const paramsFilter: any = {};
    await controller.findAll(paramsFilter);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('deve exibir um registro', async () => {
    const id = 123;
    await controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('deve alterar um registro', async () => {
    const id = 123;
    const input = {
      descricao: 'Grupo de administradores',
    };
    await controller.update(id, input);
    expect(service.update).toHaveBeenCalledWith(id, input);
  });

  it('deve deletar um registro', async () => {
    const id = 123;
    controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(id);
  });

  it('deve relacionar um usuário ao grupo de usuários', async () => {
    const input = {
      grupoUsuarioId: 1,
      usuarioId: 1,
    };
    await controller.adicionarUsuario(input.grupoUsuarioId, input.usuarioId);
    expect(service.adicionarUsuario).toHaveBeenCalled();
    expect(service.adicionarUsuario).toHaveBeenCalledWith(input);
  });

  it('deve remover um usuário do grupo de usuários', async () => {
    const input = {
      grupoUsuarioId: 1,
      usuarioId: 1,
    };
    await controller.removerUsuario(input.grupoUsuarioId, input.usuarioId);
    expect(service.removerUsuario).toHaveBeenCalled();
    expect(service.removerUsuario).toHaveBeenCalledWith(input);
  });

  it('deve relacionar uma permissao ao grupo de usuários', async () => {
    const input = {
      grupoUsuarioId: 1,
      permissaoId: 1,
    };
    await controller.adicionarPermissao(input.grupoUsuarioId, input.permissaoId);
    expect(service.adicionarPermissao).toHaveBeenCalled();
    expect(service.adicionarPermissao).toHaveBeenCalledWith(input);
  });

  it('deve remover uma permissao do grupo de usuários', async () => {
    const input = {
      grupoUsuarioId: 1,
      permissaoId: 1,
    };
    await controller.removerPermissao(input.grupoUsuarioId, input.permissaoId);
    expect(service.removerPermissao).toHaveBeenCalled();
    expect(service.removerPermissao).toHaveBeenCalledWith(input);
  });
});
