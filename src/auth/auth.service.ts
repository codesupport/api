import { Injectable } from "@nestjs/common";
import { ManagementClient } from "auth0";

@Injectable()
export class AuthService {
	constructor(
		private readonly managementClient: ManagementClient
	) {}

	async isUserValid(authId: string, username: string): Promise<boolean> {
		const user = await this.managementClient.getUser({ id: authId });

		return user?.username === username;
	}
}
