import { getChildren } from "../db/children";

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  if (!user) {
    createError({
      statusCode: 401,
      statusMessage: "User not authenticated",
    });
    return [];
  }
  const children = await getChildren(user?.id);
  // Normalize records to plain objects with default prototype
  return children.map((c: any) => ({ ...c }));
});
