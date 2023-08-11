import { Module } from '@nestjs/common';
import { PermissaoService } from './permissao.service';
import { PermissaoController } from './permissao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissaoEntity } from './entities/permissao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissaoEntity])],
  controllers: [PermissaoController],
  providers: [PermissaoService],
})
export class PermissaoModule {}
