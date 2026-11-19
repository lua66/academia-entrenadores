import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildStructuredData, LOGO_PATH, SEO_ROUTES } from '../src/data/seoRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

function resolveSiteUrl() {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/+$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, '');
  }
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  return '';
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderRouteHtml(template, baseUrl, route) {
  const canonicalUrl = baseUrl
    ? `${baseUrl}${route.path === '/' ? '/' : route.path}`
    : route.path;
  const logoUrl = baseUrl ? `${baseUrl}${LOGO_PATH}` : LOGO_PATH;
  const jsonLd = buildStructuredData(baseUrl || 'https://alturabc.mx', route.path);

  const safeTitle = escapeAttr(route.title);
  const safeDesc = escapeAttr(route.description);
  const safeKeywords = escapeAttr(route.keywords);
  const safeCanonical = escapeAttr(canonicalUrl);
  const safeLogo = escapeAttr(logoUrl);

  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+property="og:image"[\s\S]*?\/>/,
      `<meta property="og:image" content="${safeLogo}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"[\s\S]*?\/>/,
      `<meta name="twitter:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+name="twitter:image"[\s\S]*?\/>/,
      `<meta name="twitter:image" content="${safeLogo}" />`
    );

  const extraHead = [
    `<meta name="keywords" content="${safeKeywords}" />`,
    `<link rel="canonical" href="${safeCanonical}" />`,
    `<meta property="og:url" content="${safeCanonical}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ');

  return html.replace('<!--SSR_HEAD-->', extraHead);
}

function run() {
  const baseTemplatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(baseTemplatePath)) {
    throw new Error('No se encontró dist/index.html tras vite build.');
  }

  const baseTemplate = fs.readFileSync(baseTemplatePath, 'utf-8');
  const siteUrl = resolveSiteUrl();
  const today = new Date().toISOString().split('T')[0];

  for (const route of Object.values(SEO_ROUTES)) {
    const html = renderRouteHtml(baseTemplate, siteUrl, route);
    if (route.path === '/') {
      fs.writeFileSync(baseTemplatePath, html, 'utf-8');
    } else {
      const subDir = path.join(distDir, route.path.replace(/^\/+/, ''));
      fs.mkdirSync(subDir, { recursive: true });
      fs.writeFileSync(path.join(subDir, 'index.html'), html, 'utf-8');
    }
  }

  if (siteUrl) {
    const sitemapUrls = Object.values(SEO_ROUTES)
      .map((route) => {
        const loc = `${siteUrl}${route.path === '/' ? '/' : route.path}`;
        const priority =
          route.path === '/' ? '1.0' : route.path === '/aviso-de-privacidad' ? '0.4' : '0.85';
        return `  <url>\n    <loc>${escapeAttr(loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
      })
      .join('\n');

    fs.writeFileSync(
      path.join(distDir, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
      'utf-8'
    );

    fs.writeFileSync(
      path.join(distDir, 'robots.txt'),
      `User-agent: *\nAllow: /\nDisallow: /ir-whatsapp\nDisallow: /api/\nSitemap: ${siteUrl}/sitemap.xml\n`,
      'utf-8'
    );
  }

  console.log('Postbuild SEO completado para todas las rutas en dist/.');
}

run();
