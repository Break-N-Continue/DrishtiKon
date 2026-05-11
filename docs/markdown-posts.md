# Markdown Posts and Post Detail View

## Goal

We want two user-facing behaviors:

1. Posts can be authored in Markdown and rendered as rich content.
2. The feed shows short excerpts, while the full post appears on a dedicated page when clicked.

This document explains the implementation from first principles, starting at the database and ending at the UI.

---

## First principles: summary vs. body

A feed should be scannable. That means each post has two different text shapes:

- **Excerpt (summary)**: short plain-text preview used in the feed.
- **Body (markdown content)**: the full post text rendered on the detail page.

To support this, we store both `description` (excerpt) and `content` (markdown body).

---

## Data model and migration

### Why a migration is required

Existing posts only had `description`. We add new columns so old rows remain valid, then backfill:

- `content` is populated from `description`
- `slug` is generated from the title and made unique

### Migration

File: `apps/api/src/main/resources/db/migration/V6__Add_markdown_fields_to_posts.sql`

What it does:

- Adds `content`, `slug`, `cover_image_url`, and `is_draft`
- Backfills `content`
- Generates and de-duplicates slugs
- Makes `content` and `slug` non-null

---

## Backend: entity, DTO, and service flow

### Entity changes

`Post` now includes:

- `content` (markdown body)
- `slug` (URL-safe identifier)
- `coverImageUrl` (optional)
- `isDraft` (visibility control)

### Create request

`CreatePostRequest` accepts:

- `description` (required excerpt)
- `content` (optional; falls back to `description` if omitted)
- `tags` (optional list of tag names)
- `coverImageUrl` (optional)
- `isDraft` (optional)
- `slug` (optional; server will generate if absent)

### Response shape

`PostResponse` includes everything the UI needs:

- `description` (excerpt)
- `content` (markdown body)
- `slug`
- `coverImageUrl`
- `tags`
- `upvoteCount`, `commentCount`, `hasUpvoted`

### Slug generation

When a post is created:

1. Use `slug` if provided, else use `title`.
2. Convert to lower-case.
3. Replace non-alphanumeric characters with hyphens.
4. Trim leading/trailing hyphens.
5. Ensure uniqueness by appending `-2`, `-3`, etc.

This makes URLs stable and human-readable.

### New endpoint

`GET /posts/slug/{slug}`

Used by the detail page to fetch the full post by its slug.

---

## Frontend: rendering Markdown

### Core renderer

`MarkdownRenderer` is a single component that handles all Markdown rendering:

- `react-markdown` renders Markdown to React
- `remark-gfm` enables tables and task lists
- `remark-math` keeps math blocks intact
- `rehype-katex` renders math using KaTeX
- `rehype-highlight` adds syntax highlighting
- `rehype-slug` + `rehype-autolink-headings` create linkable headings
- `rehype-raw` allows raw HTML inside Markdown

### Typography and code styles

- Tailwind Typography plugin (`@tailwindcss/typography`) gives readable prose defaults.
- Highlight.js theme is imported in `globals.css` for code blocks.
- KaTeX styles are imported in `globals.css` for math rendering.

---

## Frontend: feed vs. detail

### Feed behavior

`PostCard` now shows an excerpt and links to the detail page:

- Excerpt is truncated to keep cards short
- Title and excerpt are wrapped with a link to `/posts/{slug}`

### Detail behavior

The new route `apps/web/src/app/posts/[slug]/page.tsx`:

- Fetches the post by slug
- Shows the full content with `MarkdownRenderer`
- Displays title, author, date, tags, and optional cover image

---

## Create flow and preview

`CreatePostForm` accepts:

- Title
- Excerpt (summary)
- Markdown body
- Tags
- Cover image URL
- Draft toggle

A live preview panel renders the Markdown as you type, so authors can see how the post will look before publishing.

---

## Backward compatibility

Existing posts remain valid because:

- `content` is automatically filled from `description` during migration
- The API falls back to `description` if `content` is missing
- Slugs are generated for legacy rows

---

## Security note for raw HTML

`rehype-raw` allows HTML in Markdown. If the app ever accepts untrusted Markdown, add sanitization (for example, `rehype-sanitize`) to prevent XSS.

---

## Quick verification checklist

- Run migrations and ensure new columns exist
- Create a Markdown post and verify the preview
- Confirm the feed shows a short excerpt
- Click a card to see the full post render at `/posts/{slug}`
