import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DbService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const entitiesPath = __dirname + '/../../**/*.entity{.js,.ts}';

    return {
      type: 'mariadb',
      host: this.configService.get<string>('db.host'),
      port: this.configService.get<number>('db.port'),
      username: this.configService.get<string>('db.user'),
      password: this.configService.get<string>('db.pass'),
      database: this.configService.get<string>('db.name'),
      entities: [entitiesPath],
      synchronize: false,
    };
  }
}
