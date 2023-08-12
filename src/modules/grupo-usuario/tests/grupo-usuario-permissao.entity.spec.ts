import { GrupoUsuarioPermissaoEntity } from '../entities/grupo-usuario-permissao.entity';

const grupoUsuarioId = 1;
const permissaoId = 1;

describe('GrupoUsuarioPermissaoEntity', () => {
  it('deve criar relacionamento entre uma permissão e um grupo de usuarios', async () => {
    const relacionamento = GrupoUsuarioPermissaoEntity.create(grupoUsuarioId, permissaoId);
    expect(relacionamento.grupoUsuarioId).toEqual(grupoUsuarioId);
    expect(relacionamento.permissaoId).toEqual(permissaoId);
  });
});
