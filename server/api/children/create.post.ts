import { defineEventHandler, readBody } from "h3";
import catchError from "../../utils/catchError";
import { createChild } from "~~/server/utils/children";

export default defineEventHandler(async (event) => {
  // Parse the request body
  const body = await readBody(event);

  // Validate input data
  const { firstName, lastName, motherId, fatherId, birthDate } = body;

  if (!firstName || !lastName || !motherId || !fatherId) {
    console.log("Missing required fields");
    throw new Error(
      "Missing required fields: firstName, lastName, motherId, or fatherId.",
    );
  }

  // Insert the child into the database
  const [error, result] = await catchError(
    createChild({
      firstName,
      lastName,
      motherId,
      fatherId,
      birthDate,
    }),
  );

  if (error) {
    console.error(error.message);
    return {
      success: false,
      message: error.message || "An error occurred while adding the child",
    };
  }

  // Return a success response
  return {
    success: true,
    message: "Child added successfully",
    statusCode: 200,
    childId: result?.id, // Drizzle ORM will return the inserted ID
  };
});
