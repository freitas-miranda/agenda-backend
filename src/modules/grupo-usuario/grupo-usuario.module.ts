import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoUsuarioService } from './grupo-usuario.service';
import { GrupoUsuarioController } from './grupo-usuario.controller';
import { GrupoUsuarioEntity } from './entities/grupo-usuario.entity';
import { GrupoUsuarioUsuarioEntity } from './entities/grupo-usuario-usuario.entity';
import { GrupoUsuarioPermissaoEntity } from './entities/grupo-usuario-permissao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GrupoUsuarioEntity, GrupoUsuarioUsuarioEntity, GrupoUsuarioPermissaoEntity])],
  controllers: [GrupoUsuarioController],
  providers: [GrupoUsuarioService],
  exports: [GrupoUsuarioService],
})
export class GrupoUsuarioModule {}
