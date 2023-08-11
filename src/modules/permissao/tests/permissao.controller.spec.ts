import { Test, TestingModule } from '@nestjs/testing';
import { PermissaoController } from '../permissao.controller';
import { PermissaoService } from '../permissao.service';
import { TestsHelper } from '@helpers/tests.helper';

describe('PermissaoController', () => {
  let controller: PermissaoController;
  let service: PermissaoService;

  const id = 123;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissaoController],
      providers: [
        {
          provide: PermissaoService,
          useValue: TestsHelper.mockService,
        },
      ],
    }).compile();

    controller = module.get<PermissaoController>(PermissaoController);
    service = module.get<PermissaoService>(PermissaoService);
  });

  it('deve criar um registro', async () => {
    const input = {
      key: 'admin',
      descricao: 'Permissão para Admin',
    };
    await controller.create(input);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(input);
  });

  it('deve listar todos registros', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('deve exibir um registro', async () => {
    await controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('deve alterar um registro', async () => {
    const input = {
      key: 'admin_all',
      descricao: 'Nova descrição',
    };
    await controller.update(id, input);
    expect(service.update).toHaveBeenCalledWith(id, input);
  });

  it('deve deletar um registro', async () => {
    controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
