import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { AuthStrategy } from "./auth-strategy.enum";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT) {
	constructor() {
		super({
			secretOrKeyProvider: passportJwtSecret({
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 5,
				jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`
			}),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			audience: process.env.AUTH0_AUDIENCE,
			issuer: process.env.AUTH0_ISSUER_URL,
			algorithms: ["RS256"]
		});
	}

	validate(payload: unknown): unknown {
		return payload;
	}
}
