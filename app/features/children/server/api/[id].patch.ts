export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing id",
    });
  }

  const child = await useDrizzle()
    .select()
    .from(tables.ChildrenTable)
    .where(eq(tables.ChildrenTable.id, id))
    .get();

  if (!child) {
    throw createError({
      statusCode: 404,
      statusMessage: "Child not found",
    });
  }

  const newCount = child.marbles + (body.action === "add" ? 1 : -1);
  return useDrizzle()
    .update(tables.ChildrenTable)
    .set({ marbles: newCount })
    .where(eq(tables.ChildrenTable.id, id))
    .run();
});
