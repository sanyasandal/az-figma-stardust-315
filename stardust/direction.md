<!-- provenance: stardust:master (hands-off) + figma-to-eds, 2026-10-12T18:55:32.418Z, input: Figma rsZQmpVzuyn0KhCDA3WN60 node 13496:19403 -->
# Direction — One AZ v3.2 · Login & Registration → EDS

**Hands-off activated** 2026-10-12T18:55:32.418Z by user phrase "auto mode". Gates are not weakened.

## Flow
figma-to-eds, donor mode `sample-pages` (Figma frame "Page: Login & Registration", 13 page types). Figma is the design source of truth; there is no live site, so gate 3 (divergence attribution) is N/A.

## Named assumptions
1. Breakpoints: only Login Landing has Tablet/Mobile frames; other pages are authored responsive from the same rules (divergence candidates).
2. Fonts: Lexia (headings/nav) is licensed and not in the repo; Inter is self-hosted. Lexia falls back to a metric-close serif until the licensed webfont is supplied (divergence: font licensing).
3. Forms are presentational (no backend). Submit handlers are stubs (dynamics interim tier).
4. Page copy is the Figma specimen copy, authored verbatim.

## Named deviations
1. **Screenshot export.** figma-to-eds `scripts/figma-screenshot.mjs` needs the Figma desktop MCP on :3845 (not running). Per user instruction, capture uses the `excatfigma` MCP tools directly; screenshots are inline vision references only, so gate 2 runs as the geometry gate against Figma metadata plus side-by-side visual review.

## Additional named assumptions (appended at build end)
5. Nav dropdown children ("All products", "All therapeutic areas") are placeholders; the frames show only the top-level items.
6. Most link targets (footer, utility bar, DocCheck, AZ Employee) are placeholders; the in-flow links connect the 13 pages to each other.
7. Registration field 2 is labelled "First name *" in Figma with placeholder "e.g. Dowry". It is authored as "Last name *".
8. Intro paragraphs hidden in a frame are omitted (link-expired, email-verification, profile-review, forgot-password, resend-verification-email).
9. Figma typos are kept verbatim ("Privicy Policy"). "Your email adress" on Resend is authored as "address" (the same label is spelled correctly on Login without password).
10. The combined social-icon raster is replaced by per-platform SVG icons (linkedin, facebook, youtube, instagram, x).
11. The Figma `H1` 56/60 type style is unused by these frames and is not mapped. h1 maps to Lexia 46/50.
12. Waiting Confirmation: the code includes a paragraph under the heading that the frame hides. The rendered frame (heading, dots, two paragraphs) is followed.
13. Select options for "HCP type" and "Speciality" are not shown in Figma ("Select an option"). Representative options are authored.

## Additional named deviations
2. **Validation renderer.** `stardust/.work/gates/validate.mjs` (Playwright at 1440/768/390) implements the master Validation rule. It is not a replacement for a skill gate.
3. **Geometry spec authored from design-context.** `get_metadata` depth is capped at 4 on excatfigma, so expectations come from `get_design_context` Tailwind geometry (w/h/padding/gap) with source node ids recorded per check.

## Gate results (final)
- token-probe: PASS, 147 checks.
- token-literals: PASS, 0 hardcoded token values in blocks.
- geometry: PASS, 28 checks (login 1440/768, registration 1440, forgot-password 1440).
- Validation loop: 13 pages × 3 viewports. 0 console errors, 0 failed requests, 0 overflow, 0 unlabeled inputs, 0 missing alt.

## Post-PR fix
- **Accessibility deviation:** the empty `select` text uses `--text-label-2` (#656969, about 5.7:1) instead of the Figma placeholder `--text-placeholder-1` (#b2b4b4, 2.08:1), which failed WCAG AA in Lighthouse. Input `::placeholder` keeps the Figma colour.
- `aem-psi-check` on PR #1 failed twice with "Quota exceeded" from the PageSpeed API (no score). Local Lighthouse (mobile) on the branch preview: login perf/a11y/BP 100/100/100; registration 100/96 → fixed above. SEO 69 is due only to the noindex `.aem.page` preview.
