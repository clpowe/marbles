export default defineEventHandler(async (event) => {
	const users = await useDrizzle().select().from(tables.users).all()
	return users
})
