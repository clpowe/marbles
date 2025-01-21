import type { SQL } from "drizzle-orm";
import type { UserInsert } from "~~/server/utils/drizzle";

export async function createUser(user: UserInsert) {
  return useDrizzle()
    .insert(tables.users)
    .values(user)
    .returning({
      id: tables.users.id,
      email: tables.users.email,
      name: tables.users.name,
      verifiedAt: tables.users.verifiedAt,
    })
    .get();
}
