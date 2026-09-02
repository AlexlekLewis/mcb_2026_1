# MCB Website — Change Requests (Sept 2026)

Running log of Alex's requested changes. Tick off as shipped.

| # | Change | Status | Commit |
|---|--------|--------|--------|
| 1 | **Indexing** — all pages indexable by search + answer engines (SEO/AEO) | ✅ Audited + hardened | `fix(seo): www canonical fallback` |
| 2 | **Hero images** — swap in new photos | ⛔ Blocked — awaiting labelled Google Drive assets | — |
| 3 | **Payright placement & messaging** — one banner only, at the "Which option is right for you?" section with adequate padding; strip all repetitive Payright mentions | ✅ Done | `refactor(payright): single placement` |
| 4 | **Product page structure** — Hero → Choose with Confidence → Which Option Is Right for You? → Benefits → Reviews → Product spiel → Common Questions | ✅ Done | `feat(product): new section order` |
| 5 | **Product Guide** — subtle button + hover modal on all pages; cut its footprint | ✅ Done | `feat(product-guide): button + modal` |
| 6 | **Page spacing** — reduce padding ~50% for a tighter layout | ✅ Done | `style: halve vertical rhythm` |
| 7 | **Booking page** — Payright / payment options on the right-hand side | ✅ Done | `feat(quote): payment options sidebar` |
| 8 | **Spring Sale** — marketing plan + spring-feel modal on all landing pages | 🟡 Built, awaiting sign-off | `feat(promo): spring sale modal` |

## Indexing audit result (item 1)
792 built pages: 663 noindex, 129 indexable, 98 in sitemap. **No indexing defects found** — the gap is deliberate and correct (661 thin suburb hubs noindexed by the June growth-audit decision; 26 `/products/*` cross-canonicalised; 6 permanent redirect stubs; `/quote` dynamic). Review schema removal held, FAQPage present on all 41 product pages, llms.txt all-www.

One latent hole closed: `SITE.url` fell back to the apex (which 307s to www), so an unset `NEXT_PUBLIC_BASE_URL` would flip every canonical to a redirecting host. Production was already correct.

**Open question for Alex:** "make all pages indexable" would mean un-noindexing 661 thin suburb pages. That reverses a deliberate decision and risks doorway/thin-content penalties — not done. See notes below.

## Notes
- Item 3 supersedes the earlier standalone instruction to move the top-of-page Payright banner down: the banner now appears **once**, at the "Which option is right for you?" section. Item 7 (booking page) is the sanctioned exception.
- Item 5's Product Guide button replaces the full-width "Product Guide" section, so it is not a numbered section in the item 4 running order.
