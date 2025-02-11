import { z } from "zod";
import { findUserByEmail } from "../db/auth";
import { catchError } from "@lib/utils";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);
  const [userError, user] = await catchError(findUserByEmail(email));

  if (userError || !user) {
    throw createError({
      statusCode: 401,
      statusText: userError?.message,
      message: userError?.message,
    });
  }

  if (await verifyPassword(user?.password!, password)) {
    if (!user.email) return;
    await setUserSession(event, {
      user: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user!.email,
        id: user?.id,
        createdAt: user?.createdAt,
      },
    });
    return {
      statusCode: 200,
    };
  }
  throw createError({
    statusCode: 401,
    message: "Bad credentials",
  });
});
