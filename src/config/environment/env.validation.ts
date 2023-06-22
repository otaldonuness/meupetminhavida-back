import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Test = 'test',
  Stagging = 'stagging',
  Production = 'prod',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNotEmpty()
  @IsNumber()
  APP_PORT: number;

  @IsNotEmpty()
  DATABASE_USERNAME: string;

  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  DATABASE_URL: string;

  @IsNotEmpty()
  ALLOWED_ORIGINS: string;

  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNotEmpty()
  TOKEN_EXPIRES: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(
      `some expected environment variable could not be fould. checkit it and try again: ${errors.toString()}`,
    );
  }
  return validatedConfig;
}
