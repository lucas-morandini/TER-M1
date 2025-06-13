import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration de l'URL de base pour l'API
  app.setGlobalPrefix('api');
  
  // Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('API documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger sur /api
  SwaggerModule.setup('api', app, document);
  
  // Configuration des pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // CORS
  app.enableCors();
  
  // Guards
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  
  // Body parser
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  
  await app.listen(process.env.PORT ?? 3000);
  
  console.log('Application démarrée sur le port', process.env.PORT ?? 3000);
  console.log('Documentation Swagger disponible sur: http://localhost:3000/api');
}

bootstrap();