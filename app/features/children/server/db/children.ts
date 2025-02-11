import type { ChildInsert } from '~~/server/utils/drizzle'
import {
	UserTable,
	ChildrenTable,
	MarbleTransactionsTable
} from '~~/server/database/schema'
import { eq, sum, sql } from 'drizzle-orm'

export async function getChildren(userId: string) {
	const res = await useDrizzle()
		.select({
			id: ChildrenTable.id,
			firstName: ChildrenTable.firstName,
			lastName: ChildrenTable.lastName,
			transactionSum: sql`COALESCE(SUM(marbleTransactions.amount), 0)`
		})
		.from(tables.ChildrenTable)
		.where(
			or(eq(ChildrenTable.motherId, userId), eq(ChildrenTable.fatherId, userId))
		)
		.leftJoin(
			MarbleTransactionsTable,
			eq(ChildrenTable.id, MarbleTransactionsTable.childId)
		)
		.groupBy(ChildrenTable.id)

	return res
}

export async function createChild(child: ChildInsert) {
	const uuid = crypto.randomUUID()
	try {
		const res = await useDrizzle()
			.insert(tables.ChildrenTable)
			.values({
				...child,
				id: uuid
			})
			.returning({
				id: tables.ChildrenTable.id,
				firstName: tables.ChildrenTable.firstName,
				lastName: tables.ChildrenTable.lastName,
				birthDate: tables.ChildrenTable.birthDate,
				motherId: tables.ChildrenTable.motherId,
				fatherId: tables.ChildrenTable.fatherId
			})
			.get()

		console.log('Ghidren', res)

		return res
	} catch (e) {
		console.log(e)
	}
	return
}
