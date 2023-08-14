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
          useValue: testsHelper.mockService(),
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
});
