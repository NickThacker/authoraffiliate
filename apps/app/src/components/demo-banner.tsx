/** Shown on every page of the public demo (server/demo.ts): what this is, and the way to your own. */
export function DemoBanner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border bg-info-soft px-4 py-3 text-[13px] text-fg ${className}`}
    >
      <span>
        This is the Author Affiliate demo with sample data. Nothing you change is saved. It resets every
        night.
      </span>
      <a
        href="https://authoraffiliate.com/signup"
        className="ml-auto inline-flex h-8 shrink-0 items-center rounded-md bg-primary px-3 font-medium text-primary-fg hover:opacity-90"
      >
        Start free
      </a>
    </div>
  );
}
