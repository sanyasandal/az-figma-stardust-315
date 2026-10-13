<!-- provenance: stardust:figma-to-eds map phase; source excatfigma get_design_context for 13 frames under 13496:19403; synthesized by agent -->
# Figma → EDS mapping — One AZ v3.2 · Login & Registration

| Figma component | EDS target | Notes |
|---|---|---|
| Header (Contact Navigation + Main Header) | `blocks/header` (nav sections: utility, brand, sections, tools) | Desktop ≥1024; hamburger below |
| Header, minimal (logo only) | `blocks/header` → `.header-minimal` via metadata `nav: /nav-minimal` | All non-login frames |
| Footer | `blocks/footer` (columns + bottom row with icons and code) | Centered on mobile |
| Login Window over image | `form (login)` block: `image`, `title`, fields, `submit`, `checkbox`, `divider`, `button`, `note` rows | 1440: card at x80 / 941h; 768: centred 550 / 869h; mobile: no hero |
| Input Field / Select / Password | `form` rows `text/email/tel/password/select` | Label `*` = required; cell 4 link = right-side link |
| Checkbox Form / Toggle | `form` rows `checkbox` / `toggle` | Toggle 28×16, role=switch |
| Group label / footnote | `form` rows `legend` / `hint` | Channel consent |
| Registration 2-col grid | `form` (default variant), `empty` spacer row | Gap 40, 570px columns |
| Single field 570 centred | `form (centered)` | forgot-password, reset-link-expired, resend, login-without-password |
| Button collage | default content in a section with `Style: actions` | `<strong><a>` primary, `<em><a>` secondary |
| .Block Element (h1 + paragraph) | default content | h1 Lexia 46/50 |
| Waiting dots | `loader` block | role=status |

## Pages
login, registration, channel-consent, email-verification, email-verified, profile-review, link-expired, resend-verification-email, forgot-password, waiting-confirmation, login-without-password, reset-link-expired, reset-password-sent.
