import { z } from 'zod'

const bodySchema = z.object({
	email: z.string().email(),
	password: z.string()
})

export default defineEventHandler(async (event) => {
	const { email, password } = await readValidatedBody(event, bodySchema.parse)

	const user = await useDrizzle()
		.select()
		.from(tables.UserTable)
		.where(eq(tables.UserTable.email, email))
		.get()

	if (!user) {
		throw createError({
			statusCode: 401,
			message: 'User not Found'
		})
	}

	if (await verifyPassword(user.password, password)) {
		await setUserSession(event, {
			user: {
				id: user.id,
				name: user.firstName,
				email: user.email
			}
		})
		return {
			statusCode: 200
		}
	}
	throw createError({
		statusCode: 401,
		message: 'Bad credentials'
	})
})
