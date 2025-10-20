// import updates from '~~/server/utils/eventEmmit'
import { tables, useDrizzle } from '~~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = await useDrizzle()
    .insert(tables.MarbleTransactionsTable)
    .values({
      id: crypto.randomUUID(),
      childId: body.childId,
      amount: body.amount,
      reason: body.reason ?? ''
    })
    .returning()

  //updates.emitNew(result)

  return result
})
