import { Module } from '@nestjs/common';
import { GrupoUsuarioService } from './grupo-usuario.service';
import { GrupoUsuarioController } from './grupo-usuario.controller';
import { GrupoUsuarioEntity } from './entities/grupo-usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GrupoUsuarioEntity])],
  controllers: [GrupoUsuarioController],
  providers: [GrupoUsuarioService],
  exports: [GrupoUsuarioService],
})
export class GrupoUsuarioModule {}
