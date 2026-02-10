# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev

- `bun run dev` - build + watch + serve at localhost:3000
- `bun run build` - build to _site/
- Deploy is handled by git push (CI/Cloudflare)

## Architecture

Single-file static site generator (`build.ts`) that compiles markdown to HTML. Deployed via Cloudflare Workers.

- `build.ts` - the entire pipeline: frontmatter parsing, markdown rendering (via marked), HTML templating, index/about generation, and `--watch` mode with built-in Bun.serve() dev server
- `worker.ts` - Cloudflare Worker that serves `_site/` via the ASSETS binding
- `wrangler.toml` - Worker config (name: `tomfuertes-com`)

Posts live in `_posts/` as `YYYY-MM-DD-slug.md`. The filename determines the URL (`/YYYY/MM/DD/slug.html`). Frontmatter requires `layout: post`, `title`, and `date`.

The about page lives at `_pages/about.md`. Static assets in `css/` and `images/` are copied as-is.

All HTML layout and templating is inline in `build.ts` (template literals) - there are no separate template files.

## Style

- Never use em dashes (the `--` character). A pre-commit hook blocks them. Use ` -` instead.
