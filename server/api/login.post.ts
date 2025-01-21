import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);
  console.log(email, password);
  const user = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email));

  console.log(user);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "User not Found",
    });
  }

  if (await verifyPassword(user[0].password, password)) {
    console.log("Logged in");
    // set the user session in the cookie
    // this server util is auto-imported by the auth-utils module
    await setUserSession(event, {
      user: {
        name: user.name,
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

  // Insert user data into the database
  const [userInsertError] = await catchError(
    useDrizzle().insert(tables.users).values({
      name: name,
      last: last,
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
    }),
  );
});
