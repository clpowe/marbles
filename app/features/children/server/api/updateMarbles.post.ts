import updates from "~~/server/utils/eventEmmit";

export default defineEventHandler(async (event) => {
  console.log("updateMarbles");
  const body = await readBody(event);

  const res = await useDrizzle()
    .insert(tables.MarbleTransactionsTable)
    .values({
      id: crypto.randomUUID(),
      childId: body.childId,
      amount: body.amount,
      reason: body.reason,
    })
    .returning();

  // Directly use the emitNew method on the updates instance
  console.log(res);
  updates.emitNew(res);

  return res;
});
