import { member, program, prospect, user } from "@openpromoter/db";
import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createCode, createId } from "@/lib/id";
import { db } from "@/server/db";
import { moveProgramToOwnWorkspace } from "@/server/setup";
import { addPartner, fixture } from "./helpers";

// A product on a different Stripe account moves out of a shared workspace into its own.
const actor = { type: "user" as const, id: null };

async function secondProgram(workspaceId: string) {
  const [p] = await db()
    .insert(program)
    .values({
      id: createId("prg"),
      workspaceId,
      name: "Second Product",
      slug: `second-${createCode(6)}`,
      websiteUrl: "https://second.test",
      brand: { color: "#0F766E" },
      autoApprove: {
        enabled: true,
        maxRiskScore: 40,
        requireWebsite: false,
        blockedCountries: [],
        allowedEmailDomains: [],
      },
      doubleSided: { enabled: false, percentOff: 0, durationMonths: 0 },
      holdDays: 30,
      minPayout: 5000,
    })
    .returning();
  return p!;
}

describe("moving a program to its own workspace", () => {
  it("gives it a new workspace with the same members and drops customer suggestions", async () => {
    const f = await fixture();
    const teammate = { id: crypto.randomUUID(), name: "Teammate", email: `t-${createCode(6)}@acme.test` };
    await db().insert(user).values(teammate);
    await db().insert(member).values({ workspaceId: f.ws.id, userId: teammate.id, role: "admin" });
    const second = await secondProgram(f.ws.id);
    await db()
      .insert(prospect)
      .values([
        {
          id: createId("pro"),
          programId: second.id,
          source: "customer" as const,
          name: "Cust",
          reason: "Paying customer",
          email: "c@x.test",
          score: 50,
        },
        {
          id: createId("pro"),
          programId: second.id,
          source: "manual" as const,
          name: "Kept",
          reason: "Added by hand",
          email: "k@x.test",
          score: 50,
        },
      ]);

    const wsId = await moveProgramToOwnWorkspace(second, actor);

    const [moved] = await db().select().from(program).where(eq(program.id, second.id));
    expect(moved!.workspaceId).toBe(wsId);
    const [stayed] = await db().select().from(program).where(eq(program.id, f.program.id));
    expect(stayed!.workspaceId).toBe(f.ws.id);
    const roles = await db().select().from(member).where(eq(member.workspaceId, wsId));
    expect(roles.map((r) => [r.userId, r.role]).sort()).toEqual(
      [
        [f.user.id, "owner"],
        [teammate.id, "admin"],
      ].sort(),
    );
    const left = await db().select().from(prospect).where(eq(prospect.programId, second.id));
    expect(left.map((p) => p.source)).toEqual(["manual"]);
  });

  it("refuses the only program in a workspace", async () => {
    const f = await fixture();
    await expect(moveProgramToOwnWorkspace(f.program, actor)).rejects.toThrow(/already has a workspace/);
  });

  it("refuses a program that already has partners", async () => {
    const f = await fixture();
    const second = await secondProgram(f.ws.id);
    await addPartner(second.id, f.ws.id);
    await expect(moveProgramToOwnWorkspace(second, actor)).rejects.toThrow(/partners or sales/);
    const [p] = await db().select().from(program).where(eq(program.id, second.id));
    expect(p!.workspaceId).toBe(f.ws.id);
  });
});
