import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = parseInt(process.env.APP_PORT) || 3000;

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS.split(';'),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only DTO fields are allowed.
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('GetPet API')
    .setDescription(`Main GetPet API`)
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Server listening on port ⚡ ${PORT}`);
  });
}
bootstrap();
