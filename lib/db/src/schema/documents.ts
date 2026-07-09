import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const riskItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  category: z.string(),
});

export type RiskItem = z.infer<typeof riskItemSchema>;

export const documentsTable = pgTable("documents", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  filesize: integer("filesize").notNull(),
  status: text("status", { enum: ["pending", "processing", "completed", "failed"] }).notNull().default("pending"),
  summary: text("summary"),
  riskItems: jsonb("risk_items").$type<RiskItem[]>(),
  overallRisk: text("overall_risk", { enum: ["low", "medium", "high"] }),
  riskScore: integer("risk_score"),
  missingDocuments: jsonb("missing_documents").$type<string[]>(),
  recommendations: jsonb("recommendations").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documentsTable.$inferSelect;
