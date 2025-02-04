import { drizzle } from 'drizzle-orm/d1'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '~~/server/database/schema'

export const tables = schema

export function useDrizzle() {
	return drizzle(hubDatabase(), { schema })
}

export type User = typeof schema.UserTable.$inferSelect
export type UserInsert = typeof schema.UserTable.$inferInsert
export type Child = typeof schema.ChildrenTable.$inferSelect
export type ChildInsert = typeof schema.ChildrenTable.$inferInsert
export type Transaction = typeof schema.MarbleTransactionsTable.$inferInsert
export type TransactionInsert =
	typeof schema.MarbleTransactionsTable.$inferInsert
