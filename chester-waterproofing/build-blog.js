const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const CONTENT_DIR = path.join(__dirname, 'content', 'blog');
const OUTPUT_DIR = path.join(__dirname, 'blog');
const SITE_URL = 'https://chesterwaterproofingspecialists.com';

// Create output folder if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create content folder if it doesn't exist
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Simple front-matter parser
function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const data = {};
  match[1].split(/\r?\n/).forEach(line => {
    const idx = line.indexOf(':');
    if (idx > -1) {
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      value = value.replace(/^["']|["']$/g, '');
      data[key] = value;
    }
  });

  return { data, body: match[2] };
}

// Template for a single blog post
function postTemplate({ title, date, description, bodyHtml, slug }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Blog</title>
  <meta name="description" content="${description || ''}">
  <link rel="canonical" href="${SITE_URL}/blog/${slug}.html">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header class="header">
    <div class="container header-inner">
      <a href="/" class="logo">Chester <span>Waterproofing</span> Specialists</a>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="nav" role="navigation">
        <a href="/">Home</a>
        <a href="/services/basement-waterproofing.html">Basement Waterproofing</a>
        <a href="/services/foundation-crack-repair.html">Foundation Crack Repair</a>
        <a href="/services/crawl-space-waterproofing.html">Crawl Space</a>
        <a href="/services/exterior-drainage.html">Exterior Drainage</a>
        <a href="/services/sump-pump.html">Sump Pump</a>
        <a href="/service-areas.html">Service Areas</a>
        <a href="/blog/" class="active">Blog</a>
        <a href="/contact.html">Contact Us</a>
      </nav>
    </div>
  </header>

  <div class="page-header">
    <div class="container">
      <h1>${title}</h1>
      <p>${date}</p>
    </div>
  </div>

  <main class="page-content">
    <div class="container">
      ${bodyHtml}
      <p style="margin-top: 2rem;"><a href="/blog/">← Back to Blog</a></p>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>Chester Waterproofing Specialists</h4>
          <p>200 King of Prussia Rd Ste 650<br>Radnor, PA 19087</p>
          <p><a href="tel:+16105550199">(610) 555-0199</a></p>
        </div>
        <div>
          <h4>Services</h4>
          <p><a href="/services/basement-waterproofing.html">Basement Waterproofing</a></p>
          <p><a href="/services/foundation-crack-repair.html">Foundation Crack Repair</a></p>
          <p><a href="/services/crawl-space-waterproofing.html">Crawl Space</a></p>
          <p><a href="/services/exterior-drainage.html">Exterior Drainage</a></p>
          <p><a href="/services/sump-pump.html">Sump Pump</a></p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <p><a href="/service-areas.html">Service Areas</a></p>
          <p><a href="/blog/">Blog</a></p>
          <p><a href="/contact.html">Contact Us</a></p>
        </div>
      </div>
      <div class="footer-bottom"><p>&copy; 2026 Chester Waterproofing Specialists. All rights reserved.</p></div>
    </div>
  </footer>
  <script src="/js/main.js" defer></script>
</body>
</html>`;
}

// Template for the blog listing page
function indexTemplate(posts) {
  const cards = posts.map(p => `
        <article class="blog-card">
          <h2><a href="/blog/${p.slug}.html">${p.title}</a></h2>
          <div class="blog-meta">${p.date}</div>
          <p>${p.description || ''}</p>
          <a href="/blog/${p.slug}.html">Read more →</a>
        </article>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blog | Chester Waterproofing Specialists</title>
  <meta name="description" content="Tips and advice on basement waterproofing, foundation care, and protecting your Chester PA home from water damage.">
  <link rel="canonical" href="${SITE_URL}/blog/">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header class="header">
    <div class="container header-inner">
      <a href="/" class="logo">Chester <span>Waterproofing</span> Specialists</a>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="nav" role="navigation">
        <a href="/">Home</a>
        <a href="/services/basement-waterproofing.html">Basement Waterproofing</a>
        <a href="/services/foundation-crack-repair.html">Foundation Crack Repair</a>
        <a href="/services/crawl-space-waterproofing.html">Crawl Space</a>
        <a href="/services/exterior-drainage.html">Exterior Drainage</a>
        <a href="/services/sump-pump.html">Sump Pump</a>
        <a href="/service-areas.html">Service Areas</a>
        <a href="/blog/" class="active">Blog</a>
        <a href="/contact.html">Contact Us</a>
      </nav>
    </div>
  </header>

  <div class="page-header">
    <div class="container">
      <h1>Blog</h1>
      <p>Practical advice for Chester area homeowners</p>
    </div>
  </div>

  <main class="page-content">
    <div class="container">
      <div class="blog-list">
${cards || '<p>No posts yet.</p>'}
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>Chester Waterproofing Specialists</h4>
          <p>200 King of Prussia Rd Ste 650<br>Radnor, PA 19087</p>
          <p><a href="tel:+16105550199">(610) 555-0199</a></p>
        </div>
        <div>
          <h4>Services</h4>
          <p><a href="/services/basement-waterproofing.html">Basement Waterproofing</a></p>
          <p><a href="/services/foundation-crack-repair.html">Foundation Crack Repair</a></p>
          <p><a href="/services/crawl-space-waterproofing.html">Crawl Space</a></p>
          <p><a href="/services/exterior-drainage.html">Exterior Drainage</a></p>
          <p><a href="/services/sump-pump.html">Sump Pump</a></p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <p><a href="/service-areas.html">Service Areas</a></p>
          <p><a href="/blog/">Blog</a></p>
          <p><a href="/contact.html">Contact Us</a></p>
        </div>
      </div>
      <div class="footer-bottom"><p>&copy; 2026 Chester Waterproofing Specialists. All rights reserved.</p></div>
    </div>
  </footer>
  <script src="/js/main.js" defer></script>
</body>
</html>`;
}

// ===== MAIN BUILD =====
const files = fs.existsSync(CONTENT_DIR)
  ? fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'))
  : [];

const posts = [];

files.forEach(file => {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  const { data, body } = parseFrontMatter(raw);
  const slug = file.replace(/\.md$/, '');
  const bodyHtml = marked.parse(body || '');

  const post = {
    title: data.title || slug,
    date: data.date || '',
    description: data.description || '',
    slug,
    bodyHtml
  };

  posts.push(post);

  // Write the individual post page
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${slug}.html`),
    postTemplate(post)
  );
});

// Sort newest first
posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

// Write the blog index
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'index.html'),
  indexTemplate(posts)
);

console.log(`✓ Built ${posts.length} blog post(s)`);
