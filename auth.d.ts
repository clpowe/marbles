declare module '#auth-utils' {
	interface User {
		firstName: string
		lastName: string
		email: string
		id: string
		createdAt: string
	}

	interface UserSession {
		user: User
	}

	interface SecureSessionData {
		// Add your own fields
	}
}

export { User, UserSession, SecureSessionData }
