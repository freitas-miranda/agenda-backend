import { Module } from '@nestjs/common';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { DbModule } from './configs/db/db.module';
import { EnvModule } from './configs/env/env.module';
import { PermissaoModule } from './modules/permissao/permissao.module';
import { GrupoUsuarioModule } from '@app/grupo-usuario/grupo-usuario.module';

@Module({
  imports: [EnvModule, DbModule, UsuarioModule, GrupoUsuarioModule, PermissaoModule],
})
export class AppModule {}
