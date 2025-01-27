import type { SQL } from "drizzle-orm";
import type { UserInsert } from "~~/server/utils/drizzle";

export async function getAllUsers() {
  return useDrizzle().select().from(tables.UserTable).all();
}

export async function createUser(user: UserInsert) {
  return useDrizzle()
    .insert(tables.UserTable)
    .values(user)
    .returning({
      id: tables.UserTable.id,
      email: tables.UserTable.email,
      firstName: tables.UserTable.firstName,
      lastName: tables.UserTable.lastName,
      sex: tables.UserTable.sex,
      password: tables.UserTable.password,
      createdAt: tables.UserTable.createdAt,
    })
    .get();
}

export async function findUserByEmail(email: string) {
  return useDrizzle()
    .select()
    .from(tables.UserTable)
    .where(eq(tables.UserTable.email, email))
    .get();
}
