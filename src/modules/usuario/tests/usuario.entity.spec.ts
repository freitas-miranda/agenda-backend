import { UsuarioEntity } from '../entities/usuario.entity';

const id = 123;
const email = 'alan@miranda.com';
const senhaAberta = '12345678';
const senhaHash = 'H12345678';
const senhaSalt = 'S12345678';
const ativo = true;

describe('UsuarioEntity', () => {
  it('deve criar um novo usuário', async () => {
    const usuario = UsuarioEntity.create(email, senhaAberta);

    expect(usuario.ativo).toEqual(ativo);
    expect(usuario.email).toEqual(email);
    expect(usuario.senhaHash).not.toEqual(senhaAberta);
    expect(usuario.senhaSalt).toBeDefined();
  });

  it('deve instanciar um usuário já criado', async () => {
    const usuario = new UsuarioEntity({ id, ativo, email, senhaHash, senhaSalt });

    expect(usuario.id).toEqual(id);
    expect(usuario.ativo).toEqual(ativo);
    expect(usuario.email).toEqual(email);
    expect(usuario.senhaHash).toEqual(senhaHash);
    expect(usuario.senhaSalt).toEqual(senhaSalt);
  });
});
