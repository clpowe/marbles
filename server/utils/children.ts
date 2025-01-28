import type { ChildInsert } from "~~/server/utils/drizzle";
import {
  UserTable,
  ChildrenTable,
  MarbleTransactionsTable,
} from "~~/server/database/schema";
import { eq, sum, sql } from "drizzle-orm";

export async function getChildren(userId: string) {
  try {
    const res = await useDrizzle().query.UserTable.findFirst({
      where: eq(UserTable.id, userId),
      with: {
        motherChildren: {
          columns: {
            firstName: true,
            lastName: true,
          },
          with: {
            marbleTransactions: {
              extras: (table, { sql }) => ({
                total: sql<number>`sum(${table.amount})`.as("total"),
              }),
            },
          },
        },
        fatherChildren: {
          columns: {
            firstName: true,
            lastName: true,
          },
          with: {
            marbleTransactions: {
              extras: (table, { sql }) => ({
                total: sql<number>`sum(${table.amount})`.as("total"),
              }),
            },
          },
        },
      },
    });

    console.log(res);

    const allChildren = [
      ...(res?.motherChildren ?? []),
      ...(res?.fatherChildren ?? []),
    ];

    console.log(allChildren);

    return allChildren;
  } catch (e) {
    console.log(e);
  }
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
