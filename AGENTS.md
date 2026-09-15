<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Jer-Yung Project Context & Learned Skills
## Git Preferences
- Always commit with author: `--author="sky <sky@example.com>"`

## Timezone Handling
- API returns UTC dates (e.g. `2026-09-15T19:02:00.000Z`). ALWAYS parse them properly with `new Date(value)` before formatting to ensure conversion to local Thai time (UTC+7). NEVER use `.slice()` or `.substring()` directly on the API string for display.

## API Integration Quirks (Transaction Items)
- **Image Updates (PUT):** The `PUT /api/transaction-items/{id}` endpoint replaces the entire image list with the provided `newImages` files. To keep existing images, the frontend MUST download them (via `fetch` -> `blob` -> `File`) and re-upload them alongside the new images in the `newImages` FormData array.
- **Auto-appended Details:** The backend automatically appends `(ผู้เก็บได้: <finderName>)` to the `transactionItemsLocationDetails` field upon saving. To avoid duplicating this string in the UI on subsequent edits, always strip it out (e.g., using `.replace(/\s*\(ผู้เก็บได้:[^)]+\)/g, "")`) when initializing the edit form state.

## Authentication & Ownership
- User authentication state relies on `localStorage`. The role is stored in `jeryung-user-role` (uppercase like `ADMIN`, `USER`) and ID in `jeryung-user-id`.
- Navigation mapping logic in the app might expect lowercase roles (e.g., `"admin"`). Use `.toLowerCase()` when accessing mapping objects like `navigationByRole`.
