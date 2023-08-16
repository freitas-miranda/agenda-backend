import { UsuarioEntity } from '@app/usuario/entities/usuario.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    private readonly jwtService: JwtService
  ) {}

  async signIn(email: string, senha: string): Promise<any> {
    const usuario = await this.validarUsuario(email, senha);
    if (!usuario) {
      throw new UnauthorizedException('Usuário e/ou senha são inválidos');
    }

    return this.gerarToken(usuario);
  }

  async validarUsuario(email: string, senha: string): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuario) return null;

    const senhasConferem = usuario.senhaHash === senha;
    if (!senhasConferem) return null;

    return usuario;
  }

  async gerarToken(usuario: UsuarioEntity): Promise<any> {
    const payload = {
      sub: usuario.email,
      permissoes: [],
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
