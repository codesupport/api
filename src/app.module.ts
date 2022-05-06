import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { config } from "./typeorm-config";

@Module({
	imports: [
		TypeOrmModule.forRoot(config),
		AuthModule,
		UserModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
