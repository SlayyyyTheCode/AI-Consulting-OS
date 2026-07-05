import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "consultant", "viewer"]);
export const engagementStatusEnum = pgEnum("engagement_status", [
  "active",
  "on_hold",
  "completed",
  "archived",
]);
export const phaseStatusEnum = pgEnum("phase_status", [
  "not_started",
  "in_progress",
  "completed",
  "skipped",
]);
export const deliverableStatusEnum = pgEnum("deliverable_status", [
  "draft",
  "in_review",
  "final",
]);
export const checkStatusEnum = pgEnum("check_status", [
  "not_started",
  "in_progress",
  "compliant",
  "not_applicable",
]);
export const riskStatusEnum = pgEnum("risk_status", [
  "open",
  "mitigating",
  "closed",
  "accepted",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: roleEnum("role").notNull().default("consultant"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const engagements = pgTable("engagements", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientName: text("client_name").notNull(),
  title: text("title").notNull(),
  industry: text("industry").notNull(),
  status: engagementStatusEnum("status").notNull().default("active"),
  currentPhase: text("current_phase").notNull().default("sales"),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const discoverySessions = pgTable("discovery_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  messages: jsonb("messages").notNull().default([]),
  extractedBrief: jsonb("extracted_brief"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const classifications = pgTable("classifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  domain: text("domain").notNull(),
  subDomain: text("sub_domain").notNull(),
  businessFunction: text("business_function").notNull(),
  painPoints: jsonb("pain_points").notNull().default([]),
  opportunityAreas: jsonb("opportunity_areas").notNull().default([]),
  issueTree: jsonb("issue_tree"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const recommendations = pgTable("recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const architectures = pgTable("architectures", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  components: jsonb("components").notNull().default([]),
  dataFlow: jsonb("data_flow").notNull().default([]),
  techStack: jsonb("tech_stack").notNull().default([]),
  mermaidDiagram: text("mermaid_diagram").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const deliverables = pgTable("deliverables", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  templateKey: text("template_key").notNull(),
  title: text("title").notNull(),
  contentMd: text("content_md").notNull(),
  status: deliverableStatusEnum("status").notNull().default("draft"),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lifecyclePhases = pgTable("lifecycle_phases", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  phaseKey: text("phase_key").notNull(),
  status: phaseStatusEnum("status").notNull().default("not_started"),
  exitCriteria: jsonb("exit_criteria").notNull().default([]),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const riskRegister = pgTable("risk_register", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  risk: text("risk").notNull(),
  category: text("category").notNull(),
  likelihood: integer("likelihood").notNull().default(3),
  impact: integer("impact").notNull().default(3),
  mitigation: text("mitigation"),
  owner: text("owner"),
  status: riskStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const governanceChecks = pgTable("governance_checks", {
  id: uuid("id").primaryKey().defaultRandom(),
  engagementId: uuid("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  framework: text("framework").notNull(),
  item: text("item").notNull(),
  status: checkStatusEnum("status").notNull().default("not_started"),
  evidence: text("evidence"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
