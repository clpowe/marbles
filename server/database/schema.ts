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
  (table) => [uniqueIndex("emailIndex").on(table.email)],
);

// Children table
export const ChildrenTable = sqliteTable("children", {
  id: text("id").primaryKey(), // UUID
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  birthDate: text("birth_date"),
  marbles: integer("marbles").notNull().default(0),
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

export const ChildrenTableRelations = relations(
  ChildrenTable,
  ({ one, many }) => ({
    marbleTransactions: many(MarbleTransactionsTable),
    mother: one(UserTable, {
      fields: [ChildrenTable.motherId],
      references: [UserTable.id],
      relationName: "motherChildren",
    }),
    father: one(UserTable, {
      fields: [ChildrenTable.fatherId],
      references: [UserTable.id],
      relationName: "fatherChildren",
    }),
  }),
);

// Define the relations for UserTable
export const UserTableRelations = relations(UserTable, ({ many }) => ({
  motherChildren: many(ChildrenTable),
  fatherChildren: many(ChildrenTable),
}));

export const MarbleTransactionsTableRelations = relations(
  MarbleTransactionsTable,
  ({ one, many }) => {
    return {
      childTrans: one(ChildrenTable, {
        fields: [MarbleTransactionsTable.childId],
        references: [ChildrenTable.id],
      }),
    };
  },
);
