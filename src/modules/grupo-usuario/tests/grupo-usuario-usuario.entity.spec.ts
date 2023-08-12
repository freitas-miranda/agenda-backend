import { GrupoUsuarioUsuarioEntity } from '../entities/grupo-usuario-usuario.entity';

const grupoUsuarioId = 1;
const usuarioId = 1;

describe('GrupoUsuarioUsuarioEntity', () => {
  it('deve criar relacionamento entre um usuário e um grupo de usuários', async () => {
    const relacionamento = GrupoUsuarioUsuarioEntity.create(grupoUsuarioId, usuarioId);
    expect(relacionamento.grupoUsuarioId).toEqual(grupoUsuarioId);
    expect(relacionamento.usuarioId).toEqual(usuarioId);
  });
});
