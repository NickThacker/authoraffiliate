import { Badge, Card, CardHeader } from "@openpromoter/ui";
import Link from "next/link";
import { programCtx, userPrograms } from "@/server/context";
import { DeleteProgram } from "./delete";
import { MoveProgram } from "./move";
import { NewProgram } from "./new";

const day = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function ProgramsPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const { user, role, program: current } = await programCtx(programId);
  const programs = await userPrograms(user.id);
  const workspaceName = programs.find((p) => p.id === programId)?.workspaceName ?? "this workspace";
  return (
    <>
      <Card>
        <CardHeader
          title="Programs"
          description="Programs in the same workspace share its Stripe account and customers. A product with its own Stripe account belongs in its own workspace. Open a program to manage, move or delete it."
        />
        <ul className="divide-y divide-border border-t border-border">
          {programs.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3 text-[13px]">
              <span className="flex min-w-0 items-center gap-2">
                {p.id === programId ? (
                  <span className="truncate font-medium text-fg">{p.name}</span>
                ) : (
                  <Link
                    href={`/app/${p.id}/settings/programs`}
                    className="truncate font-medium text-fg hover:underline"
                  >
                    {p.name}
                  </Link>
                )}
                {p.id === programId ? <Badge tone="primary">Current</Badge> : null}
              </span>
              <span className="shrink-0 text-xs text-subtle">
                Created {day(p.createdAt)} · {p.workspaceName} · {p.role}
              </span>
            </li>
          ))}
        </ul>
      </Card>
      {role === "owner" || role === "admin" ? <NewProgram programId={programId} /> : null}
      {role === "owner" && programs.filter((p) => p.workspaceId === current.workspaceId).length > 1 ? (
        <MoveProgram programId={programId} name={current.name} workspace={workspaceName} />
      ) : null}
      {role === "owner" ? (
        <DeleteProgram programId={programId} name={current.name} created={day(current.createdAt)} />
      ) : null}
    </>
  );
}
