import { Module } from '@nestjs/common';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { DbModule } from './configs/db/db.module';
import { EnvModule } from './configs/env/env.module';
import { PermissaoModule } from './modules/permissao/permissao.module';
import { GrupoUsuarioModule } from '@app/grupo-usuario/grupo-usuario.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [EnvModule, DbModule, UsuarioModule, GrupoUsuarioModule, PermissaoModule, AuthModule],
})
export class AppModule {}
