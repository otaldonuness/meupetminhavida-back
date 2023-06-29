import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule);
  const PORT = parseInt(configService.get("APP_PORT")) || 3000;

  app.enableCors({
    origin: configService.get("ALLOWED_ORIGINS").split(";"),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only DTO fields are allowed.
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Meu Pet Minha Vida API")
    .setDescription(
      `**Meu Pet Minha Vida API**  
      You can check our repository [*here*](https://github.com/otaldonuness/meupetminhavida-back), it's an open-source project!
      `
    )
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(PORT, () => {
    console.log(`Server listening on port ⚡ ${PORT}`);
  });
}
bootstrap();
