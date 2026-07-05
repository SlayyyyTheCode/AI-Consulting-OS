"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  engagements,
  lifecyclePhases,
  governanceChecks,
  riskRegister,
  deliverables,
  users,
} from "@/lib/db/schema";
import { LIFECYCLE_PHASES } from "@/lib/knowledge/lifecycle";
import { GOVERNANCE_CHECKLIST } from "@/lib/knowledge/governance";

async function requireUser(minRole: "viewer" | "consultant" | "admin" = "consultant") {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const order = { viewer: 0, consultant: 1, admin: 2 };
  if (order[session.user.role] < order[minRole]) throw new Error("Forbidden");
  return session.user;
}

export async function createEngagement(formData: FormData) {
  const user = await requireUser("consultant");
  const clientName = String(formData.get("clientName") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  if (!clientName || !title || !industry) throw new Error("Missing fields");

  const [engagement] = await db
    .insert(engagements)
    .values({ clientName, title, industry, ownerId: user.id })
    .returning();

  // Seed lifecycle phases and governance checklist for the engagement.
  await db.insert(lifecyclePhases).values(
    LIFECYCLE_PHASES.map((p) => ({
      engagementId: engagement.id,
      phaseKey: p.key,
      exitCriteria: p.exitCriteria.map((c) => ({ text: c, done: false })),
    }))
  );
  await db.insert(governanceChecks).values(
    GOVERNANCE_CHECKLIST.map((g) => ({
      engagementId: engagement.id,
      framework: g.framework,
      item: g.item,
    }))
  );

  revalidatePath("/dashboard");
  redirect(`/engagements/${engagement.id}/discovery`);
}

export async function updateEngagementStatus(engagementId: string, status: "active" | "on_hold" | "completed" | "archived") {
  await requireUser("consultant");
  await db
    .update(engagements)
    .set({ status, updatedAt: new Date() })
    .where(eq(engagements.id, engagementId));
  revalidatePath(`/engagements/${engagementId}`);
  revalidatePath("/dashboard");
}

export async function updatePhaseStatus(
  engagementId: string,
  phaseKey: string,
  status: "not_started" | "in_progress" | "completed" | "skipped"
) {
  await requireUser("consultant");
  await db
    .update(lifecyclePhases)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(lifecyclePhases.engagementId, engagementId), eq(lifecyclePhases.phaseKey, phaseKey)));

  if (status === "in_progress") {
    await db
      .update(engagements)
      .set({ currentPhase: phaseKey, updatedAt: new Date() })
      .where(eq(engagements.id, engagementId));
  }
  revalidatePath(`/engagements/${engagementId}/lifecycle`);
  revalidatePath("/dashboard");
}

export async function toggleExitCriterion(engagementId: string, phaseKey: string, index: number) {
  await requireUser("consultant");
  const [phase] = await db
    .select()
    .from(lifecyclePhases)
    .where(and(eq(lifecyclePhases.engagementId, engagementId), eq(lifecyclePhases.phaseKey, phaseKey)));
  if (!phase) return;
  const criteria = phase.exitCriteria as { text: string; done: boolean }[];
  if (!criteria[index]) return;
  criteria[index].done = !criteria[index].done;
  await db
    .update(lifecyclePhases)
    .set({ exitCriteria: criteria, updatedAt: new Date() })
    .where(eq(lifecyclePhases.id, phase.id));
  revalidatePath(`/engagements/${engagementId}/lifecycle`);
}

export async function updateGovernanceCheck(
  checkId: string,
  engagementId: string,
  status: "not_started" | "in_progress" | "compliant" | "not_applicable"
) {
  await requireUser("consultant");
  await db
    .update(governanceChecks)
    .set({ status, updatedAt: new Date() })
    .where(eq(governanceChecks.id, checkId));
  revalidatePath(`/engagements/${engagementId}/governance`);
}

export async function addRisk(engagementId: string, formData: FormData) {
  await requireUser("consultant");
  const risk = String(formData.get("risk") ?? "").trim();
  const category = String(formData.get("category") ?? "General").trim();
  const likelihood = Number(formData.get("likelihood") ?? 3);
  const impact = Number(formData.get("impact") ?? 3);
  const mitigation = String(formData.get("mitigation") ?? "").trim() || null;
  if (!risk) throw new Error("Risk description required");
  await db.insert(riskRegister).values({ engagementId, risk, category, likelihood, impact, mitigation });
  revalidatePath(`/engagements/${engagementId}/governance`);
}

export async function updateRiskStatus(
  riskId: string,
  engagementId: string,
  status: "open" | "mitigating" | "closed" | "accepted"
) {
  await requireUser("consultant");
  await db.update(riskRegister).set({ status }).where(eq(riskRegister.id, riskId));
  revalidatePath(`/engagements/${engagementId}/governance`);
}

export async function updateDeliverable(deliverableId: string, engagementId: string, formData: FormData) {
  await requireUser("consultant");
  const contentMd = String(formData.get("contentMd") ?? "");
  const status = String(formData.get("status") ?? "draft") as "draft" | "in_review" | "final";
  const [existing] = await db.select().from(deliverables).where(eq(deliverables.id, deliverableId));
  if (!existing) throw new Error("Not found");
  await db
    .update(deliverables)
    .set({ contentMd, status, version: existing.version + 1, updatedAt: new Date() })
    .where(eq(deliverables.id, deliverableId));
  revalidatePath(`/engagements/${engagementId}/deliverables`);
}

export async function deleteDeliverable(deliverableId: string, engagementId: string) {
  await requireUser("consultant");
  await db.delete(deliverables).where(eq(deliverables.id, deliverableId));
  revalidatePath(`/engagements/${engagementId}/deliverables`);
}

export async function updateUserRole(userId: string, role: "admin" | "consultant" | "viewer") {
  const actor = await requireUser("admin");
  if (actor.id === userId) throw new Error("Cannot change your own role");
  await db.update(users).set({ role }).where(eq(users.id, userId));
  revalidatePath("/team");
}

export async function addTeamMember(formData: FormData) {
  await requireUser("admin");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "consultant") as "admin" | "consultant" | "viewer";
  if (!name || !email || password.length < 8) throw new Error("Invalid input");
  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(users).values({ name, email, passwordHash, role });
  revalidatePath("/team");
}
