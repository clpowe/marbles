export default defineEventHandler(async (event) => {
  const users = await useDrizzle().query.UserTable.findMany();
  // Normalize to plain objects to avoid null-prototype objects in SSR payload
  return users.map((u: any) => ({ ...u }));
});
