import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS für Website + Portal im Dev
  app.enableCors({
    origin: (process.env.CORS_ORIGIN || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3002;
  await app.listen(port);
  console.log(`API läuft auf http://localhost:${port}`);
}
bootstrap();