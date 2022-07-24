import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

const port = Number.parseInt(process.env.PORT) || 3000;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const swaggerConfig = new DocumentBuilder()
		.setTitle("CodeSupport API")
		.setVersion("v2")
		.setDescription("The CodeSupport API acts as a central service used for management of CodeSupport user generated content.")
		.setContact("CodeSupport Discord", "https://codesupport.dev/discord", "")
		.build();

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup("docs", app, swaggerDocument);

	await app.listen(port);
	console.log(`Now listening on port ${port}`);
}

bootstrap();
