import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// Users table (represents parents)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // UUID
  email: text("email").unique().default(""),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  password: text("password").notNull().default(""), // Should be hashed
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`),
});

// Children table
export const children = sqliteTable("children", {
  id: text("id").primaryKey(), // UUID
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  birthDate: integer("birth_date", { mode: "timestamp" }),
  motherId: text("mother_id")
    .notNull()
    .references(() => users.id),
  fatherId: text("father_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`),
});

// Updated MarbleTransactions table
export const marbleTransactions = sqliteTable("marble_transactions", {
  id: text("id").primaryKey(), // UUID
  childId: text("child_id")
    .notNull()
    .references(() => children.id),
  amount: integer("amount").notNull().default(0), // Positive for earning, negative for deductions
  reason: text("reason").default(""),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`),
});
