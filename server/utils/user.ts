import type { SQL } from 'drizzle-orm'
import type { UserInsert } from '~~/server/utils/drizzle'

export async function getAllUsers() {
	return useDrizzle().select().from(tables.users).all()
}

export async function createUser(user: UserInsert) {
	return useDrizzle()
		.insert(tables.users)
		.values(user)
		.returning({
			id: tables.users.id,
			email: tables.users.email,
			firstName: tables.users.firstName,
			lastName: tables.users.lastName,
			password: tables.users.password,
			createdAt: tables.users.createdAt
		})
		.get()
}

export async function findUserByEmail(email: string) {
	return useDrizzle()
		.select()
		.from(tables.users)
		.where(eq(tables.users.email, email))
		.get()
}
