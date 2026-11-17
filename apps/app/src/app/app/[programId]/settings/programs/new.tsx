"use client";

import { Button, Field, Input, Switch } from "@openpromoter/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SettingsCard } from "@/components/page";
import { useAction } from "@/components/use-action";
import { createProgramAction } from "../../settings-actions";

export function NewProgram({ programId }: { programId: string }) {
  const { pending, run } = useAction();
  const router = useRouter();
  const [ownStripe, setOwnStripe] = useState(false);
  return (
    <SettingsCard title="New program" description="Branded automatically from the website you enter.">
      <form
        className="flex flex-col gap-3"
        action={(f) =>
          run(
            () =>
              createProgramAction(programId, {
                websiteUrl: String(f.get("url")),
                name: String(f.get("name") || ""),
                ownStripe,
              }),
            "Program created",
            (id) => router.push(`/onboarding?program=${id}&step=3`),
          )
        }
      >
        <Field label="Website" htmlFor="np-url">
          <Input id="np-url" name="url" required placeholder="product.com" />
        </Field>
        <Field label="Name" htmlFor="np-name">
          <Input id="np-name" name="name" />
        </Field>
        <label className="flex items-start justify-between gap-4">
          <span className="text-[13px]">
            <span className="text-fg">It has its own Stripe account</span>
            <span className="mt-0.5 block text-xs text-muted">
              Creates a separate workspace so its customers and sales stay apart. Leave off if it bills
              through this workspace's Stripe account.
            </span>
          </span>
          <Switch
            checked={ownStripe}
            onCheckedChange={setOwnStripe}
            aria-label="It has its own Stripe account"
          />
        </label>
        <Button type="submit" variant="primary" loading={pending} className="self-start">
          Create program
        </Button>
      </form>
    </SettingsCard>
  );
}
