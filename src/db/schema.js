import {pgTable, integer, serial, text, timestamp, pgEnum} from "drizzle-orm/pg-core";
import { AVAILABLE_STATUSES } from "@/data/invoices";

const statuses = AVAILABLE_STATUSES.map(({id}) => id)
export const statusEnum = pgEnum("status", statuses)

export const Invoices = pgTable("invoices", {
  id: serial("id").primaryKey().notNull(),
  createTS: timestamp().defaultNow().notNull(),
  value: integer("value").notNull(),
  description: text("description").notNull(),
  userId: text('userId').notNull(),
  status: statusEnum('status').notNull(),
})
