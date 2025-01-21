export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id')
	const body = await readBody(event)

	const child = await useDrizzle()
		.select()
		.from(tables.children)
		.where(eq(tables.children.id, id))
		.get()

	if (!child) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Child not found'
		})
	}

	const newCount = child.marbles + (body.action === 'add' ? 1 : -1)
	return useDrizzle()
		.update(tables.children)
		.set({ marbles: newCount })
		.where(eq(tables.children.id, id))
		.run()
})
