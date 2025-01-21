export default defineTask({
  meta: {
    name: "db:seed",
    description: "Run database seed task",
  },
  async run() {
    console.log("Running DB seed task...");

    const id1 = crypto.randomUUID();
    const id2 = crypto.randomUUID();

    const users = [
      {
        id: id1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
      {
        id: id2,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: "password123",
        createdAt: new Date().toISOString(),
      },
    ];
    await useDrizzle().insert(tables.users).values(users);
    return { result: "success" };
  },
});
