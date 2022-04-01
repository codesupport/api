import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			secretOrKeyProvider: passportJwtSecret({
				cache: true,
				rateLimit: true,
				jwksRequestsPerMinute: 5,
				jwksUri: `${process.env.AUTH0_ISSUER_URL}/.well-known/jwks.json`
			}),
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			audience: process.env.AUTH0_AUDIENCE,
			issuer: process.env.AUTH0_ISSUER_URL,
			algorithms: ['RS256']
		});
		console.log(process.env.AUTH0_ISSUER_URL);
	}

	validate(payload: unknown): unknown {
		return payload;
	}
}
