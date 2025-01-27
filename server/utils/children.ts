import type { ChildInsert } from "~~/server/utils/drizzle";
import {
  UserTable,
  ChildrenTable,
  MarbleTransactionsTable,
} from "~~/server/database/schema";
import { eq } from "drizzle-orm";

export async function getChildren(userId: string) {
  const res = await useDrizzle().query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
    with: {
      motherChildren: {
        with: {
          marbleTransactions: true,
        },
      },
      fatherChildren: {
        with: {
          marbleTransactions: true,
        },
      },
    },
  });

  // Combine both motherChildren and fatherChildren
  const allChildren = [
    ...(res?.motherChildren ?? []),
    ...(res?.fatherChildren ?? []),
  ].map((child) => ({
    ...child,
    transactionSum: child.marbleTransactions.reduce(
      (sum, transaction) => sum + (transaction.amount ?? 0),
      0,
    ),
  }));

  return allChildren;
}

export async function createChild(child: ChildInsert) {
  const uuid = crypto.randomUUID();
  try {
    const res = await useDrizzle()
      .insert(tables.ChildrenTable)
      .values({
        id: uuid,
        ...child,
      })
      .returning({
        id: tables.ChildrenTable.id,
        firstName: tables.ChildrenTable.firstName,
        lastName: tables.ChildrenTable.lastName,
        birthDate: tables.ChildrenTable.birthDate,
        motherId: tables.ChildrenTable.motherId,
        fatherId: tables.ChildrenTable.fatherId,
      })
      .get();
    console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
  return;
}
