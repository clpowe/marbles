export async function findUserByEmail(email: string) {
  if (!email) {
    throw new Error("Email is required");
  }

  const [_, user] = await catchError(
    useDrizzle()
      .select()
      .from(tables.UserTable)
      .where(eq(tables.UserTable.email, email))
      .get(),
  );

  if (!user) {
    throw new Error("Please check your credintials");
  }

  return user;
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
