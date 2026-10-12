# Journal

## 2026-10-12T19:38:30.839Z — figma-to-eds: Login & Registration → EDS (hands-off)

**Prompt:** migrate One-AZ v3.2 node 13496:19403 to EDS in auto mode with stardust + figma-to-eds, capturing via the excatfigma MCP (not figma-to-content).

**Done:** captured 13 frames and 768 variables via excatfigma; generated tokens (curate-tokens.mjs); self-hosted Inter; reworked header/footer; new form and loader blocks; authored nav, nav-minimal, footer and 13 pages in DA and previewed them.

**Fixes found by validation:** token-name mismatch (--border-border-*) hid input borders; login min-height plus padding overflowed (border-box); tablet padding aligned to Figma 32/28; Channel consent heading changed to legend + hint; toggle resized to 28×16.

**Gates:** token-probe 147/147, token-literals 0, geometry 28/28, validation 39/39 clean.

**Open:** Lexia webfont licence; real form backend; placeholder link targets. See direction.md assumptions 1–13.
