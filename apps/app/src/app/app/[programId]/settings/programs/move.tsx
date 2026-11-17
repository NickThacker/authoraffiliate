"use client";

import { Button } from "@openpromoter/ui";
import { useRouter } from "next/navigation";
import { SettingsCard } from "@/components/page";
import { useAction } from "@/components/use-action";
import { moveProgramWorkspaceAction } from "../../settings-actions";

export function MoveProgram({
  programId,
  name,
  workspace,
}: {
  programId: string;
  name: string;
  workspace: string;
}) {
  const { pending, run } = useAction();
  const router = useRouter();
  return (
    <SettingsCard
      title="Give this program its own workspace"
      description={`Programs in ${workspace} share one Stripe account and one customer list. If ${name} bills through a different Stripe account, move it to its own workspace and connect that account there. This only works before it has partners or sales.`}
    >
      <Button
        variant="secondary"
        loading={pending}
        className="self-start"
        onClick={() =>
          run(
            () => moveProgramWorkspaceAction(programId),
            "Moved to its own workspace",
            () => {
              router.push(`/app/${programId}/settings/integrations`);
              router.refresh();
            },
          )
        }
      >
        Move {name} to its own workspace
      </Button>
    </SettingsCard>
  );
}
