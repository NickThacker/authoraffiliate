import { agentAction } from "@openpromoter/db";
import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page";
import { aiEnabled } from "@/server/ai/provider";
import { programCtx } from "@/server/context";
import { db } from "@/server/db";
import { AutopilotView } from "./view";

export const metadata: Metadata = { title: "Autopilot" };

export default async function AutopilotPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const { program: prog, role } = await programCtx(programId);
  const actions = await db()
    .select()
    .from(agentAction)
    .where(eq(agentAction.programId, programId))
    .orderBy(desc(agentAction.createdAt))
    .limit(100);
  return (
    <>
      <PageHeader
        title="Autopilot"
        description="Autopilot reviews your program once a week and suggests what to do next. Some steps it can take itself. Each one is logged here and can be undone. It never moves money."
      />
      <AutopilotView
        programId={programId}
        canWrite={role === "owner" || role === "admin"}
        enabled={prog.autopilotEnabled}
        mode={prog.autopilotMode}
        ai={aiEnabled()}
        actions={actions.map((a) => ({
          id: a.id,
          kind: a.kind,
          title: a.title,
          detail: a.detail,
          status: a.status,
          source: a.source,
          createdAt: a.createdAt.toISOString(),
          appliedAt: a.appliedAt?.toISOString() ?? null,
          payload: a.payload,
        }))}
      />
    </>
  );
}
