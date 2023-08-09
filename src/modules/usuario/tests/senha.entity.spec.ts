import { Senha } from '../entities/senha.entity';

// Senha criptografada nos parametros desejados para comparação
const senhaHash =
  'ffceffebf6a64cb0d47148d06af60bf8a086d34a17ceffa4b86324a7ad150da143e8e48feddb105808d3c96204d518b5b3bd5d0c0694739eae28731c6c5fd36f';

describe('Senha', () => {
  it('Deve criar uma senha', () => {
    const senha = Senha.create('12345678', '123');

    expect(senha.hash).toEqual(senhaHash);
    expect(senha.salt).toEqual('123');
  });

  it('Deve instanciar uma senha já criada', () => {
    const senha = new Senha('12345678', '123');

    expect(senha.hash).toEqual('12345678');
    expect(senha.salt).toEqual('123');
  });

  it('Não deve criar uma senha com menos de 8 caracteres', () => {
    expect(async () => Senha.create('1234567', '123')).rejects.toThrow(new Error('Senha inválida!'));
  });

  it('Deve validar uma senha correta', () => {
    const senha = new Senha(senhaHash, '123');
    return expect(senha.validate('12345678')).toEqual(true);
  });

  it('Deve validar uma senha incorreta', () => {
    const senha = new Senha(senhaHash, '123');
    return expect(senha.validate('12345679')).toEqual(false);
  });
});
