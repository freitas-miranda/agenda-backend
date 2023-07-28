import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.enableCors({
    origin: process.env.FRONTEND,
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);

  Logger.log(`Servidor rodando na porta ${port} 🚀`, 'API');
}
bootstrap();
