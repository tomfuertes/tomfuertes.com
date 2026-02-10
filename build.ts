import { marked } from "marked";
import { Glob } from "bun";
import { mkdir, rm, rename, cp } from "node:fs/promises";
import { watch } from "node:fs";

const SITE_NAME = "Tom Fuertes";
const OUT_DIR = "_site";
const GIT_SHA = (await Bun.$`git rev-parse --short HEAD`.text()).trim();

// Parse frontmatter from markdown
function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      data[key.trim()] = rest.join(":").trim().replace(/^["']|["']$/g, "");
    }
  }
  return { data, content: match[2] };
}

// Format date like Jekyll's date_to_string
function dateToString(dateStr: string) {
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Default layout template
const defaultLayout = (title: string, content: string) => `<!DOCTYPE html>
<!-- build: ${GIT_SHA} -->
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>${title} | tomfuertes.com</title>
        <meta name="viewport" content="width=device-width">
        <link rel="icon" type="image/png" href="/images/favicon-32.png" sizes="32x32">
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
        <link rel="stylesheet" href="/css/syntax.css">
        <link rel="stylesheet" href="/css/main.css">
    </head>
    <body>
        <div class="site">
          <div class="header">
            <a class="site-title" href="/">${SITE_NAME}</a>
            <nav>
              <a href="/">posts</a>
              <a href="/about.html">about</a>
            </nav>
          </div>
          ${content}
          <footer class="footer">
            <span>© ${new Date().getFullYear()}</span>
            <nav class="social">
              <a href="#" id="email-link" title="Email" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
              <a href="https://twitter.com/thisbetom" title="X/Twitter" aria-label="X/Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com/in/tomfuertes" title="LinkedIn" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </nav>
            <script>(function(){var e=atob('dG9tZnVlcnRlc0BnbWFpbC5jb20=');document.getElementById('email-link').href='mailto:'+e;})()</script>
          </footer>
        </div>
    </body>
</html>`;

// Post layout
const postLayout = (title: string, date: string, content: string) => `
<h1>${title}</h1>
<p class="meta">${dateToString(date)}</p>
<div class="post">
${content}
</div>`;

// Collect all posts
interface Post {
  title: string;
  date: string;
  url: string;
  html: string;
}

async function build() {
  const posts: Post[] = [];

  // Process posts
  const glob = new Glob("_posts/*.md");
  for await (const path of glob.scan(".")) {
    const file = await Bun.file(path).text();
    const { data, content } = parseFrontmatter(file);

    // Extract date and slug from filename: 2014-01-15-auto-build-tags.md
    const filename = path.split("/").pop()!;
    const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
    if (!match) continue;

    const [, year, month, day, slug] = match;
    const url = `/${year}/${month}/${day}/${slug}.html`;
    const html = await marked(content);

    posts.push({
      title: data.title || slug,
      date: data.date || `${year}-${month}-${day}`,
      url,
      html,
    });
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Build into temp dir, then swap into _site/ so the dev server never sees a partial build
  const TMP_DIR = `${OUT_DIR}.tmp`;
  await rm(TMP_DIR, { recursive: true, force: true });
  await mkdir(TMP_DIR, { recursive: true });

  // Write posts
  for (const post of posts) {
    const postHtml = postLayout(post.title, post.date, post.html);
    const fullHtml = defaultLayout(post.title, postHtml);

    const outPath = `${TMP_DIR}${post.url}`;
    await mkdir(outPath.split("/").slice(0, -1).join("/"), { recursive: true });
    await Bun.write(outPath, fullHtml);
    console.log(`  ${post.url}`);
  }

  // Generate index
  const indexContent = `
<div id="home">
  <h1>Posts</h1>
  <ul class="posts">
    ${posts.map(p => `<li><span class="date">${dateToString(p.date)}</span><a href="${p.url}">${p.title}</a></li>`).join("\n    ")}
  </ul>
</div>`;

  await Bun.write(`${TMP_DIR}/index.html`, defaultLayout("Blog", indexContent));
  console.log("  /index.html");

  // Generate about page
  const aboutFile = await Bun.file("_pages/about.md").text();
  const { content: aboutContent } = parseFrontmatter(aboutFile);
  const aboutHtml = await marked(aboutContent);
  const aboutPageContent = `
<div class="page">
  <h1>About</h1>
  <div class="post">
${aboutHtml}
  </div>
</div>`;
  await Bun.write(`${TMP_DIR}/about.html`, defaultLayout("About", aboutPageContent));
  console.log("  /about.html");

  // Copy static assets
  await cp("css", `${TMP_DIR}/css`, { recursive: true });
  await cp("images", `${TMP_DIR}/images`, { recursive: true });
  await Bun.write(`${TMP_DIR}/favicon.ico`, Bun.file("images/favicon-32.png"));
  console.log("  /css/");
  console.log("  /images/");

  // Swap build into _site/ (rm + rename so dev server never serves a half-built directory)
  await rm(OUT_DIR, { recursive: true, force: true });
  await rename(TMP_DIR, OUT_DIR);

  console.log(`\nBuilt ${posts.length} posts to ${OUT_DIR}/`);
}

await build();

// Watch mode: rebuild on source file changes
if (process.argv.includes("--watch")) {
  const dirs = ["_posts", "_pages", "css"];
  let timeout: Timer | null = null;
  let building = false;
  const rebuild = () => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      if (building) return;
      building = true;
      console.log("\nRebuilding...");
      try {
        await build();
      } catch (error) {
        console.error("Build failed:", error);
      } finally {
        building = false;
      }
    }, 100);
  };
  for (const dir of dirs) {
    watch(dir, { recursive: true }, rebuild);
  }
  console.log("Watching _posts/, _pages/, css/ for changes...");

  Bun.serve({
    port: 3000,
    async fetch(req) {
      let path = new URL(req.url).pathname;
      if (path === "/") path = "/index.html";
      // Try _site/ first, fall back to _site.tmp/ during rebuilds (rm/rename gap)
      for (const dir of [OUT_DIR, `${OUT_DIR}.tmp`]) {
        const file = Bun.file(`${dir}${path}`);
        if (await file.exists()) return new Response(file);
      }
      return new Response("Not found", { status: 404 });
    },
  });
  console.log("Serving at http://localhost:3000");
}
