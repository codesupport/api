import type { Request } from "express";

interface AuthenticatedRequest extends Request {
	user: {
		sub: string;
	}
}

export default AuthenticatedRequest;