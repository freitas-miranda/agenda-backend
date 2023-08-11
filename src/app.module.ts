import { Module } from '@nestjs/common';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { DbModule } from './configs/db/db.module';
import { EnvModule } from './configs/env/env.module';
import { PermissaoModule } from './modules/permissao/permissao.module';

@Module({
  imports: [EnvModule, DbModule, UsuarioModule, PermissaoModule],
})
export class AppModule {}
