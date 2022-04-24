import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

const port = Number.parseInt(process.env.PORT) || 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const swaggerConfig = new DocumentBuilder()
		.setTitle("Codesupport API")
		.setVersion("v2")
		.setDescription("The new and better CodeSupport API")
		.setContact("LamboCreeper", "https://codesupport.dev", "")
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup("api", app, swaggerDocument);

	await app.listen(port);
	console.log(`Now listening on port ${port}`);
}

bootstrap();
