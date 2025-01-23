export default defineEventHandler(async (event) => {
  const users = await useDrizzle().query.UserTable.findMany();
  return users;
});
