import { pbkdf2Sync, randomBytes } from 'node:crypto';

export class Senha {
  constructor(readonly hash: string, readonly salt: string) {}

  static create(senhaAberta: string, salt?: string): Senha {
    if (senhaAberta.length < 8) throw new Error('Senha inválida!');

    const { senhaHash, senhaSalt } = Senha.gerarSenha(senhaAberta, salt);

    return new Senha(senhaHash, senhaSalt);
  }

  validate(senhaAberta: string) {
    // Derivar a senha passada para comparação com o salt carregado na classe
    const { senhaHash } = Senha.gerarSenha(senhaAberta, this.salt);
    return senhaHash === this.hash;
  }

  private static gerarSenha(senhaAberta: string, salt?: string) {
    // Gera um salt aleatório de 20 bytes se não for informado
    const senhaSalt = salt || randomBytes(20).toString('hex');

    // Define o número de iterações para fortalecer o algoritmo
    const iterations = 10000;

    // Define o tamanho da chave gerada
    const keyLength = 64;

    // Aplica a função PBKDF2 para derivar a senha com o salt
    const senhaHash = pbkdf2Sync(senhaAberta, senhaSalt, iterations, keyLength, 'sha512').toString('hex');

    return {
      senhaHash,
      senhaSalt,
    };
  }
}
