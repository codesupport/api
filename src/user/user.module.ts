import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ManagementClient } from "auth0";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { UserController } from "./user.controller";

@Module({
	providers: [
		{
			provide: ManagementClient,
			useValue: new ManagementClient({
				domain: process.env.AUTH0_DOMAIN,
				clientId: process.env.AUTH0_CLIENT_ID,
				clientSecret: process.env.AUTH0_CLIENT_SECRET,
				scope: "read:users"
			})
		},
		UserService,
		AuthService
	],
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UserController]
})
export class UserModule {}
