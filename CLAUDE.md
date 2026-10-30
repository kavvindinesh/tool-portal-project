# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks or libraries (no React, Vue, Tailwind, jQuery, etc.).
- No build step: files are opened or served exactly as written.

## Project Structure

The repository is nearly empty for now. Planned layout:

- `CLAUDE.md` – these instructions.
- `index.html` – the homepage (tool cards).
- `tools/` – one HTML page per tool.
- `css/styles.css` – shared styles, including light and dark theme colours.
- `js/theme.js` – shared light/dark toggle.
- `js/<tool-name>.js` – each tool's own logic.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet and phone.
2. Users can toggle between a light and a dark theme. The default is the
   light theme.
3. Text must stay easy to read, with good contrast, in both the light and
   the dark theme.

## Visual Design

"Study Notebook" style, defined in `css/styles.css`; reuse its variables and
classes rather than adding new colours.

- Fonts (Google Fonts, with system fallbacks): Space Grotesk for headings,
  Atkinson Hyperlegible for body text.
- Light: warm white `#fbfaf7`, near-black text, deep green accent `#1f5e46`.
- Dark: `#151917` background, light text, mint accent `#7fd1a8`.
- Soft rounded panels (12–16px corners), tap targets at least 44px tall.

## Feature Plan

A portal of small web tools for aircraft inspection students.

### Portal structure

- **Homepage (`index.html`):** short intro, then a grid of tool cards
  (title, one-line description, link). Learning-only disclaimer in the footer.
- **Opening a tool:** clicking a card opens that tool's own page in `tools/`.
- **Getting back:** every tool page has the same header, with the portal name
  linking to the homepage and a "← All tools" link.
- **Adding a tool later:** create `tools/<tool-name>.html` and
  `js/<tool-name>.js`, reuse `css/styles.css` and `js/theme.js`, then add one
  card to the homepage grid.

### Phases

1. **Portal + first tool:** homepage, shared styles and light/dark toggle,
   and the NDT method selector (pick material, defect type and location →
   see recommended / possible / unsuitable methods, with reasons).
   - [x] Portal shell: homepage, shared styles, light/dark toggle, and a
     placeholder "Tool 1 — coming soon" card to prove the open/back
     navigation.
   - [x] NDT method selector (`tools/ndt-method-selector.html`), replacing
     the placeholder. Rules follow FAA-H-8083-30 and AC 43.13-1B Ch. 5.
2. **More NDT tools:** e.g. eddy current depth calculator, ultrasonic
   thickness calculator, penetrant process guide.
3. **Grow the portal:** group tools by topic as the list gets longer.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- When something is unclear, ask rather than guess.
