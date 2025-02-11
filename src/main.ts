import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.enableCors({
		origin: ['http://localhost:3001'],
	});

	await app.init();

	await app.listen(process.env.PORT ?? 3000);
}

/* eslint-disable @typescript-eslint/no-floating-promises */
bootstrap();
