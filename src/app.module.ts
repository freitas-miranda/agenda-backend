import { Module } from '@nestjs/common';
import { UsuarioModule } from './app/usuario/usuario.module';
import { DbModule } from './config/db/db.module';
import { EnvModule } from './config/env/env.module';

@Module({
  imports: [EnvModule, DbModule, UsuarioModule],
})
export class AppModule {}
