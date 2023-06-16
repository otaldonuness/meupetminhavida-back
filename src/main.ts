import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = parseInt(process.env.APP_PORT) || 3000;

  const config = new DocumentBuilder()
    .setTitle('GetPet API')
    .setDescription(`Main GetPet API`)
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () => {
    console.log(`Server listening on port ⚡ ${PORT}`);
  });
}
bootstrap();
