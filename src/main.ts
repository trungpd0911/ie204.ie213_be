declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// validation pipe for all routes
	app.useGlobalPipes(new ValidationPipe());

	// swagger setup
	const config = new DocumentBuilder()
		.setTitle('Swagger bếp UIT')
		.setDescription('API documentation for bếp UIT')
		.setVersion('1.0')
		.addTag('auth')
		.addTag('users')
		.addTag('posts')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	// cors
	app.enableCors();
	// start server
	await app.listen(process.env.port || 3000);
	// Hot Module Replacement => reload automatically when change code
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
