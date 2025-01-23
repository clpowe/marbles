import { relations } from "drizzle-orm";
import {
  sqliteTable,
  integer,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// Users table (represents parents)
export const UserTable = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(), // UUID
    email: text("email", { length: 255 }).unique().default(""),
    firstName: text("first_name").notNull().default(""),
    lastName: text("last_name").notNull().default(""),
    sex: text({ enum: ["male", "female"] })
      .$type<"male" | "female">()
      .notNull()
      .default("male"),
    password: text("password").notNull().default(""), // Should be hashed
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => sql`(current_timestamp)`),
  },
  (table) => {
    return {
      emailIndex: uniqueIndex("emailIndex").on(table.email),
    };
  },
);

// Children table
export const ChildrenTable = sqliteTable("children", {
  id: text("id").primaryKey(), // UUID
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  birthDate: integer("birth_date", { mode: "timestamp" }),
  motherId: text("mother_id")
    .notNull()
    .references(() => UserTable.id),
  fatherId: text("father_id")
    .notNull()
    .references(() => UserTable.id),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`),
});

// Updated MarbleTransactions table
export const MarbleTransactionsTable = sqliteTable("marbleTransactions", {
  id: text("id").primaryKey(), // UUID
  childId: text("child_id")
    .notNull()
    .references(() => ChildrenTable.id),
  amount: integer("amount").notNull().default(0), // Positive for earning, negative for deductions
  reason: text("reason").default(""),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => sql`(current_timestamp)`),
});

// RELATIONS

export const UserTableRelations = relations(UserTable, ({ many }) => {
  return {
    children: many(ChildrenTable),
  };
});

export const ChildrenTableRelations = relations(
  ChildrenTable,
  ({ one, many }) => {
    return {
      marbleTransactions: many(MarbleTransactionsTable),
      mother: one(UserTable, {
        fields: [ChildrenTable.motherId],
        references: [UserTable.id],
      }),
      father: one(UserTable, {
        fields: [ChildrenTable.fatherId],
        references: [UserTable.id],
      }),
    };
  },
);

export const MarbleTransactionsTableRelations = relations(
  MarbleTransactionsTable,
  ({ many }) => {
    return {
      child: many(ChildrenTable),
    };
  },
);
