import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const { user } = context.switchToHttp().getRequest();

		return user?.sub;
	}
);