# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Deploy

- `bun run dev` - watch + rebuild + serve at localhost:8787
- `bun run build` - build to _site/
- `bun run deploy` - build + deploy to Cloudflare Workers

## Architecture

Single-file static site generator (`build.ts`) that compiles markdown to HTML and deploys via Cloudflare Workers.

- `build.ts` - the entire build pipeline: frontmatter parsing, markdown rendering (via marked), HTML templating, index generation, about page, and `--watch` mode with fs.watch
- `worker.ts` - Cloudflare Worker that serves `_site/` via the ASSETS binding
- `wrangler.toml` - Worker config (name: `tomfuertes-com`)

Posts live in `_posts/` as `YYYY-MM-DD-slug.md`. The filename determines the URL (`/YYYY/MM/DD/slug.html`). Frontmatter requires `layout: post`, `title`, and `date`.

The about page lives at `_pages/about.md`. Static assets in `css/` and `images/` are copied as-is.

All HTML layout and templating is inline in `build.ts` (template literals) - there are no separate template files.

## Style

- Never use em dashes (the `--` character). A pre-commit hook blocks them. Use ` -` instead.
