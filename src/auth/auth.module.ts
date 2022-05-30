import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ManagementClient } from "auth0";
import { JWTStrategy } from "./jwt.strategy";
import { AuthService } from "./auth.service";

@Module({
	imports: [PassportModule.register({ defaultStrategy: "jwt" })],
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
		JWTStrategy,
		AuthService
	],
	exports: [PassportModule]
})
export class AuthModule {}
