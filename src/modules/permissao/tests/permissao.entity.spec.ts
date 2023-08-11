import { PermissaoEntity } from '../entities/permissao.entity';

const key = 'admin';
const descricao = 'Descrição da permissão';

describe('PermissaoEntity', () => {
  it('deve criar uma nova permissão', async () => {
    const permissao = PermissaoEntity.create(key, descricao);

    expect(permissao.key).toEqual(key);
    expect(permissao.descricao).toEqual(descricao);
  });
});
