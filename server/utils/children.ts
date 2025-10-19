import { tables, useDrizzle, sql, eq } from './drizzle'

export async function getAllChildren() {
	const rows = await useDrizzle()
		.select({
			id: tables.ChildrenTable.id,
			firstName: tables.ChildrenTable.firstName,
			lastName: tables.ChildrenTable.lastName,
			transactionSum: sql`COALESCE(SUM(${tables.MarbleTransactionsTable.amount}), 0)`
		})
		.from(tables.ChildrenTable)
		.leftJoin(
			tables.MarbleTransactionsTable,
			eq(tables.ChildrenTable.id, tables.MarbleTransactionsTable.childId)
		)
		.groupBy(tables.ChildrenTable.id)

	return rows.map((child: any) => ({
		id: child.id,
		firstName: child.firstName,
		lastName: child.lastName,
		transactionSum: Number(child.transactionSum) || 0
	}))
}
