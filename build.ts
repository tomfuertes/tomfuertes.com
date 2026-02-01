import { marked } from "marked";
import { Glob } from "bun";

const SITE_NAME = "Tom Fuertes";
const OUT_DIR = "_site";

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
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width">
        <link rel="stylesheet" href="/css/syntax.css">
        <link rel="stylesheet" href="/css/main.css">
    </head>
    <body>
        <div class="site">
          <div class="header">
            <h1 class="title"><a href="/">${SITE_NAME}</a></h1>
            <a class="extra" href="/">home</a>
          </div>
          ${content}
          <div class="footer">
            <div class="contact">
              <p>
                Tom Fuertes<br />
                <strike>Poker Player</strike> Front End Developer<br />
                <span id="em"></span><script>(function(){var a=atob('dG9tZnVlcnRlc0BnbWFpbC5jb20='),b=atob('dG9tQHRvbWZ1ZXJ0ZXMuY29t'),c=atob('dG9tQG5vdGFtYm91cmluZS5jb20=');document.getElementById('em').innerHTML=[a,b,c].join('<br>')})()</script>
              </p>
            </div>
            <div class="contact">
              <p>
                <a href="https://github.com/tomfuertes">github.com/tomfuertes</a><br />
                <a href="https://linkedin.com/in/tomfuertes">linkedin.com/in/tomfuertes</a><br />
                <a href="https://twitter.com/thisbetom">twitter.com/thisbetom</a><br />
              </p>
            </div>
            <div class="contact" style="flex-basis:100%;margin-top:1em;">
              <p><strong>Want to talk? Ask me about:</strong><br />
                My desk setup (the mic especially)<br />
                Airgapping AI workflows from personal data<br />
                Poker → CRO → the product-dev merge<br />
                Fuji photography and capturing moments of transition
              </p>
              <p>
                <strong>Looking to partner?</strong> I consult at <a href="https://notambourine.com">notambourine.com</a> — connect on <a href="https://linkedin.com/in/tomfuertes">LinkedIn</a>.
              </p>
            </div>
          </div>
        </div>
    </body>
</html>`;

// Post layout
const postLayout = (title: string, date: string, content: string) => `
<h2>${title}</h2>
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

// Clean and create output directory
await Bun.$`rm -rf ${OUT_DIR} && mkdir -p ${OUT_DIR}`;

// Write posts
for (const post of posts) {
  const postHtml = postLayout(post.title, post.date, post.html);
  const fullHtml = defaultLayout(post.title, postHtml);

  const outPath = `${OUT_DIR}${post.url}`;
  await Bun.$`mkdir -p ${outPath.split("/").slice(0, -1).join("/")}`;
  await Bun.write(outPath, fullHtml);
  console.log(`  ${post.url}`);
}

// Generate index
const indexContent = `
<div id="home">
  <h1>Blog Posts</h1>
  <ul class="posts">
    ${posts.map(p => `<li><span>${dateToString(p.date)}</span> &raquo; <a href="${p.url}">${p.title}</a></li>`).join("\n    ")}
  </ul>
</div>`;

await Bun.write(`${OUT_DIR}/index.html`, defaultLayout("Blog", indexContent));
console.log("  /index.html");

// Copy static assets
await Bun.$`cp -r css images ${OUT_DIR}/`;
console.log("  /css/");
console.log("  /images/");

console.log(`\nBuilt ${posts.length} posts to ${OUT_DIR}/`);
