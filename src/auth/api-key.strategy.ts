import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import Strategy from "passport-headerapikey";
import { AuthStrategy } from "./auth-strategy.enum";

@Injectable()
export class APIKeyStrategy extends PassportStrategy(Strategy, AuthStrategy.API_KEY) {
	constructor() {
		super({
			header: "X-API-Key"
		}, true, (key, data) => this.validate(key, data));
	}

	validate(key: string, done: (error: Error, data) => void): void {
		if ([process.env.AUTH0_ACTION_API_KEY].includes(key)) {
			return done(null, true);
		}

		done(new UnauthorizedException(), null);
	}
}