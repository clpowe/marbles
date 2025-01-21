import { z } from 'zod'
import { findUserByEmail } from '~~/server/utils/user'
import catchError from '../../utils/catchError'

const bodySchema = z.object({
	email: z.string().email(),
	password: z.string()
})

export default defineEventHandler(async (event) => {
	const { email, password } = await readValidatedBody(event, bodySchema.parse)
	console.log(email, password)
	const [userError, user] = await catchError(findUserByEmail(email))

	if (userError || !user) {
		throw createError({
			statusCode: 401,
			cause: userError,
			message: 'User not Found'
		})
	}

	if (await verifyPassword(user?.password!, password)) {
		console.log('Logged in')
		// set the user session in the cookie
		// this server util is auto-imported by the auth-utils module
		await setUserSession(event, {
			user: {
				firstName: user?.firstName,
				lastName: user?.lastName,
				email: user?.email,
				id: user?.id,
				createdAt: user?.createdAt
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
