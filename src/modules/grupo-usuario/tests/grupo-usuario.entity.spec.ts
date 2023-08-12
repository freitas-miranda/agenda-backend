import { GrupoUsuarioEntity } from '../entities/grupo-usuario.entity';

const descricao = 'alan@miranda.com';

describe('GrupoUsuarioEntity', () => {
  it('deve criar um novo grupo de usuário', async () => {
    const usuario = GrupoUsuarioEntity.create(descricao);
    expect(usuario.descricao).toEqual(descricao);
  });
});
