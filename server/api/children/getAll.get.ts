export default defineEventHandler(async (event) => {
  const children = await useDrizzle().select().from(tables.children).all();
  return children;
});
