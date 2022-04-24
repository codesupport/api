import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JWTStrategy } from "./jwt.strategy";

@Module({
	imports: [PassportModule.register({ defaultStrategy: "jwt" })],
	providers: [JWTStrategy],
	exports: [PassportModule]
})
export class AuthModule {}
