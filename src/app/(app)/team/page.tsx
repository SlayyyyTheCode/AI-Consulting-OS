import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { PageHeader } from "@/components/ui";
import { TeamManager } from "@/components/team-manager";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await auth();
  if (session?.user.role !== "admin") redirect("/dashboard");

  const team = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users);

  return (
    <>
      <PageHeader
        title="Team"
        description="Manage consultants and their access. Admin can manage everything; consultants run engagements; viewers are read-only."
      />
      <TeamManager
        currentUserId={session.user.id}
        team={team.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() }))}
      />
    </>
  );
}
