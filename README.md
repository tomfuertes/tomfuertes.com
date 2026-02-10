# tomfuertes.com

Personal blog. Single-file static site generator ([`build.ts`](build.ts)) that compiles markdown to HTML, served via Cloudflare Workers.

## Quick Start

```bash
bun install
bun run dev    # build + watch + serve at localhost:3000
```

## Adding a Post

Create `_posts/YYYY-MM-DD-slug.md` with frontmatter:

```markdown
---
layout: post
title: "Your Title"
date: YYYY-MM-DD
---

Post content here.
```

The filename determines the URL: `/YYYY/MM/DD/slug.html`.

## Deploy

```bash
git push  # CI handles the rest (Cloudflare Workers)
```
