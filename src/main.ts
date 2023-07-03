import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Environment } from "./config/environment/enums";

async function bootstrap() {
  const configService = new ConfigService();
  const nestLogger = new Logger(bootstrap.name);

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: configService.get("ALLOWED_ORIGINS").split(";"),
  });

  if (configService.get("NODE_ENV") === Environment.Production) {
    app.useLogger(false);
  }

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

  const PORT = parseInt(configService.get("APP_PORT"));

  await app.listen(PORT, () => {
    nestLogger.log(`Server listening on port ⚡ ${PORT}`);
  });
}
bootstrap();
