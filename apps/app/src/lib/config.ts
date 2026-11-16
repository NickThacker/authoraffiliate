/** Single source of truth for product naming. */
export const PRODUCT = {
  name: "Author Affiliate",
  domain: "authoraffiliate.com",
  github: "https://github.com/NickThacker/authoraffiliate",
  /** npm packages, SDK docs and the op.js API stay upstream OpenPromoter's, so installs keep working. */
  npm: "openpromoter",
  mcpPackage: "openpromoter-mcp",
  docs: "https://openpromoter.com/docs",
  tagline: "Affiliate programs for author tools",
  supportEmail: "partners@authoraffiliate.com",
  /** AGPL-3.0 fork credit. */
  upstream: { name: "OpenPromoter", url: "https://github.com/openpromoter/openpromoter" },
} as const;
