import { plainToInstance } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string | undefined;

  @IsInt()
  @Min(1)
  @Max(65535)
  DB_PORT: number | undefined;

  @IsString()
  @IsNotEmpty()
  DB_USER: string | undefined;
  
  @IsString()
  DB_PASSWORD: string | undefined;
  
  @IsString()
  @IsNotEmpty()
  DB_NAME: string | undefined;
  
  @IsBooleanString()
  @IsOptional()
  DB_SSL: string = 'false';

  @IsString()
  @IsNotEmpty()
  REDIS_URL: string | undefined;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string | undefined;
  
  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '1d';

  @IsString()
  @IsNotEmpty()
  CLOUDINARY_CLOUD_NAME: string | undefined;
  
  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_KEY: string | undefined;
  
  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_SECRET: string | undefined;

  @IsString()
  @IsOptional()
  CORS_ORIGIN: string = '*';
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    throw new Error(
      `Config validation error:\n${errors
        .map((e) => Object.values(e.constraints ?? {}).join(', '))
        .join('\n')}`,
    );
  }
  return validated;
}