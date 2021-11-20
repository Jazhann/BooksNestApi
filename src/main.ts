import { NestFactory } from '@nestjs/core';
import * as env from '../config/env';
import { AppModule } from './app.module';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const ENV = process.env.NODE_ENV;
  if (ENV === 'dev' || ENV === 'prod') {
    await env.loadEnv();
  }

  const transports = [];
  if (process.env.NODE_ENV !== 'prod') {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
      }),
    );
  }
  transports.push(new winston.transports.File({ dirname: './logs/', filename: 'error.log', level: 'error' }));
  transports.push(new winston.transports.File({ dirname: './logs/', filename: 'combined.log' }));

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ transports }),
  });

  app.useGlobalPipes(new ValidationPipe());

  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  };
  app.enableCors(options);

  const config = new DocumentBuilder()
    .setTitle('Books and Authors')
    .setDescription('Book and Authors API')
    .setVersion('1.0')
    .addTag('books')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
