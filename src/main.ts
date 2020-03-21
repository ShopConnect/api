import * as helmet from 'helmet';
import * as passport from 'passport';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from "@nestjs/platform-socket.io";
import { NestFactory } from '@nestjs/core';
import { SeedingService } from './database/seeding.service';

async function bootstrap(): Promise<void> {
  const logger = new Logger("ShopConnect", true);

  let start = Date.now();
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle("ShopConnect API")
    .setDescription("The API for the ShopConnect project")
    .setVersion("0.1")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document);

  app.useWebSocketAdapter(new IoAdapter(app));

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      /(.*)/
    ]
  });
  app.use(helmet());
  app.use(passport.initialize());

  let seedService = app.get(SeedingService);
  seedService.up();

  let configService = app.get(ConfigService);

  await app.listen(configService.get<number>("PORT"), "0.0.0.0", () => {
    let end = Date.now();
    let span = end - start;
    logger.log(`Took ${new Date(span).getMilliseconds()} milliseconds to initialize`);
  });
}
bootstrap();
