import { plainToInstance } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, validateSync } from "class-validator";

enum Environment {
  Development = "development",
  Test = "test",
  Stagging = "stagging",
  Production = "prod",
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNotEmpty()
  @IsNumber()
  APP_PORT: number;

  @IsNotEmpty()
  DATABASE_URL: string;

  @IsNotEmpty()
  ALLOWED_ORIGINS: string;

  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string;

  @IsNotEmpty()
  REFRESH_TOKEN_SECRET: string;

  @IsNotEmpty()
  ACCESS_TOKEN_EXPIRES: string;

  @IsNotEmpty()
  REFRESH_TOKEN_EXPIRES: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Some expected environment variable(s) could not be fould. Check it and try again: ${errors.toString()}`
    );
  }
  return validatedConfig;
}
