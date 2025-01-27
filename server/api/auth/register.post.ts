import { z } from "zod";
import type { ZodError } from "zod";
import catchError from "../../utils/catchError";

const bodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  sex: z.enum(["male", "female"]),
  password: z.string(),
  passwordConfirmation: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let parsedBody;
  try {
    parsedBody = bodySchema.parse(body);
  } catch (validationError: ZodError | unknown) {
    throw createError({
      statusCode: 422,
      message: "Validation failed",
      data: validationError ? validationError : undefined,
    });
  }

  const { firstName, lastName, email, sex, password, passwordConfirmation } =
    parsedBody;

  // Check if passwords match
  if (!password) {
    throw createError({
      statusCode: 400,
      message: "Password is required",
    });
  }

  if (password !== passwordConfirmation) {
    throw createError({
      statusCode: 400,
      message: "Passwords do not match",
    });
  }

  // Hash the password
  const [hashError, hashedPassword] = await catchError(hashPassword(password));
  if (hashError) {
    throw createError({
      statusCode: 500,
      message: "Failed to hash the password",
      cause: hashError,
    });
  }

  // Insert user data into the database
  const [userInsertError] = await catchError(
    createUser({
      id: crypto.randomUUID(),
      firstName: firstName, // Corrected to 'fistName' to match schema
      lastName: lastName,
      email: email,
      sex: sex,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }),
  );
  if (userInsertError) {
    console.log(userInsertError);
    throw createError({
      statusCode: 500,
      message: userInsertError.message,
      cause: userInsertError.cause,
    });
  }

  // Return success response
  return {
    statusCode: 200,
    message: "User registration successful",
  };
});
