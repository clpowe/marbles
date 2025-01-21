import { drizzle } from 'drizzle-orm/d1'
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
	return drizzle(hubDatabase(), { schema })
}

export type User = typeof schema.users.$inferSelect
export type UserInsert = typeof schema.users.$inferInsert
export type Child = typeof schema.children.$inferSelect
export type ChildInsert = typeof schema.children.$inferInsert
export type Transaction = typeof schema.marbleTransactions.$inferInsert
export type TransactionInsert = typeof schema.marbleTransactions.$inferInsert
