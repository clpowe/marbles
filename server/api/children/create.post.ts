import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody(event);

    // Validate input data
    const { firstName, lastName, motherId, fatherId, birthDate } = body;

    if (!firstName || !lastName || !motherId || !fatherId) {
      throw new Error(
        "Missing required fields: firstName, lastName, motherId, or fatherId.",
      );
    }

    const uuid = crypto.randomUUID();

    // Insert the child into the database
    const result = await useDrizzle()
      .insert(tables.ChildrenTable)
      .values({
        id: uuid,
        firstName,
        lastName,
        birthDate,
        motherId,
        fatherId,
      })
      .returning();

    // Return a success response
    return {
      success: true,
      message: "Child added successfully",
      statusCode: 200,
      childId: result[0].id, // Drizzle ORM will return the inserted ID
    };
  } catch (error: any) {
    console.log(error);
    // Return an error response
    return {
      success: false,
      message: error.message || "An error occurred while adding the child",
    };
  }
});
