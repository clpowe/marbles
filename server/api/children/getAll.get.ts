export default defineEventHandler(async (event) => {
  const children = await useDrizzle().select().from(tables.ChildrenTable).all();
  return children;
});
