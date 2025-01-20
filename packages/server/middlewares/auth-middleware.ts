import type { Context } from "elysia";
import type { User, Session } from "better-auth/types";
import { auth } from "../lib/auth";

export const userMiddleware = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.request.headers });
  if (!session) {
    throw c.error(401, { message: "Unauthorized Access: Token is missing" });
  }

  return {
    user: session.user,
    session: session.session,
  };
};

export const userInfo = (user: User | null, session: Session | null) => {
  return {
    user: user,
    session: session,
  };
};
