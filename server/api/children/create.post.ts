import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody(event);

    // Validate input data
    const { firstName, lastName, motherId, fatherId } = body;

    if (!firstName || !lastName || !motherId || !fatherId) {
      throw new Error(
        "Missing required fields: firstName, lastName, motherId, or fatherId.",
      );
    }

    const uuid = crypto.randomUUID();

    // Insert the child into the database
    const result = await useDrizzle().insert(tables.children).values({
      id: uuid,
      firstName,
      lastName,
      motherId,
      fatherId,
    });

    // Return a success response
    return {
      success: true,
      message: "Child added successfully",
      childId: result.id, // Drizzle ORM will return the inserted ID
    };
  } catch (error: any) {
    // Return an error response
    return {
      success: false,
      message: error.message || "An error occurred while adding the child",
    };
  }
});
