import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  engagements,
  discoverySessions,
  classifications,
  recommendations,
  architectures,
} from "@/lib/db/schema";
import type { Brief, Classification, Recommendation } from "@/lib/ai/schemas";

export async function getEngagement(id: string) {
  const [e] = await db.select().from(engagements).where(eq(engagements.id, id));
  return e ?? null;
}

export async function getDiscovery(engagementId: string) {
  const [d] = await db
    .select()
    .from(discoverySessions)
    .where(eq(discoverySessions.engagementId, engagementId))
    .orderBy(desc(discoverySessions.createdAt))
    .limit(1);
  return d ?? null;
}

export async function getClassification(engagementId: string) {
  const [c] = await db
    .select()
    .from(classifications)
    .where(eq(classifications.engagementId, engagementId))
    .orderBy(desc(classifications.createdAt))
    .limit(1);
  return c ?? null;
}

export async function getRecommendation(engagementId: string) {
  const [r] = await db
    .select()
    .from(recommendations)
    .where(eq(recommendations.engagementId, engagementId))
    .orderBy(desc(recommendations.createdAt))
    .limit(1);
  return r ?? null;
}

export async function getArchitecture(engagementId: string) {
  const [a] = await db
    .select()
    .from(architectures)
    .where(eq(architectures.engagementId, engagementId))
    .orderBy(desc(architectures.createdAt))
    .limit(1);
  return a ?? null;
}

/** Assemble full engagement context as text for AI prompts. */
export async function buildEngagementContext(engagementId: string): Promise<string> {
  const [engagement, discovery, classification, recommendation] = await Promise.all([
    getEngagement(engagementId),
    getDiscovery(engagementId),
    getClassification(engagementId),
    getRecommendation(engagementId),
  ]);

  const parts: string[] = [];
  if (engagement) {
    parts.push(
      `ENGAGEMENT: ${engagement.title}\nClient: ${engagement.clientName}\nIndustry: ${engagement.industry}\nCurrent phase: ${engagement.currentPhase}`
    );
  }
  if (discovery?.extractedBrief) {
    const b = discovery.extractedBrief as Brief;
    parts.push(
      `DISCOVERY BRIEF:\nProblem: ${b.problemStatement}\nWhy AI: ${b.whyAI}\nCurrent state: ${b.currentState}\nFuture state: ${b.futureState}\nObjectives: ${b.businessObjectives?.join("; ")}\nConstraints: ${b.constraints?.join("; ")}\nSuccess metrics: ${b.successMetrics?.join("; ")}\nStakeholders: ${b.stakeholders?.join("; ")}\nTimeline: ${b.timeline}\nBudget: ${b.budget}\nCompliance: ${b.compliance?.join("; ")}`
    );
  }
  if (classification) {
    parts.push(
      `CLASSIFICATION:\nDomain: ${classification.domain} > ${classification.subDomain}\nFunction: ${classification.businessFunction}\nPain points: ${(classification.painPoints as string[]).join("; ")}\nOpportunities: ${(classification.opportunityAreas as string[]).join("; ")}`
    );
  }
  if (recommendation) {
    const r = recommendation.payload as Recommendation;
    parts.push(
      `RECOMMENDATIONS:\nMethodologies: ${r.methodologies?.map((m) => m.key).join(", ")}\nUse cases: ${r.useCases?.map((u) => `${u.key} (${u.confidence}%)`).join(", ")}\nAccelerator: ${r.acceleratorKey}\nTeam: ${r.team?.map((t) => t.role).join(", ")}\nKey risks: ${r.risks?.map((k) => k.risk).join("; ")}`
    );
  }
  return parts.join("\n\n") || "No engagement context available yet.";
}

export type { Brief, Classification, Recommendation };
