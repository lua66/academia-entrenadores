import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import {
  buildStructuredData,
  getRouteMeta,
  LOGO_PATH,
  SEO_ROUTES,
} from './src/data/seoRoutes.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Número de WhatsApp mantenido solo en el servidor para que nunca sea visible en el HTML del cliente.
const WHATSAPP_E164 = (process.env.WHATSAPP_NUMBER || '34608180231').replace(/\D/g, '');

function resolveBaseUrl(req: express.Request): string {
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0]?.trim() || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
  return `${proto}://${host}`;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectRouteSeo(template: string, baseUrl: string, pathname: string): string {
  const meta = getRouteMeta(pathname);
  const canonicalUrl = `${baseUrl}${meta.path === '/' ? '/' : meta.path}`;
  const logoAbsUrl = `${baseUrl}${LOGO_PATH}`;
  const jsonLd = buildStructuredData(baseUrl, pathname);

  const safeTitle = escapeHtmlAttr(meta.title);
  const safeDesc = escapeHtmlAttr(meta.description);
  const safeKeywords = escapeHtmlAttr(meta.keywords);
  const safeCanonical = escapeHtmlAttr(canonicalUrl);
  const safeLogo = escapeHtmlAttr(logoAbsUrl);

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

  html = html.replace('<!--SSR_HEAD-->', extraHead);
  return html;
}

async function createServer() {
  const app = express();
  app.disable('x-powered-by');

  // Redirección privada de WhatsApp (oculta el número en la web)
  app.get('/ir-whatsapp', (req, res) => {
    const rawMsg = typeof req.query.msg === 'string' ? req.query.msg : '';
    const defaultMsg =
      'Hola, me interesa el curso "Del Fundamento al Juego · Nivel C" de Altura BC en CDMX.';
    const finalMsg = rawMsg.trim() || defaultMsg;
    const targetUrl = `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(finalMsg)}`;
    res.redirect(302, targetUrl);
  });

  // robots.txt dinámico para Google Search
  app.get('/robots.txt', (req, res) => {
    const baseUrl = resolveBaseUrl(req);
    res.type('text/plain; charset=utf-8');
    res.send(
      [
        'User-agent: *',
        'Allow: /',
        'Disallow: /ir-whatsapp',
        `Sitemap: ${baseUrl}/sitemap.xml`,
      ].join('\n')
    );
  });

  // sitemap.xml dinámico con todas las URLs indexables
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = resolveBaseUrl(req);
    const today = new Date().toISOString().split('T')[0];
    const urls = Object.values(SEO_ROUTES)
      .map((route) => {
        const loc = `${baseUrl}${route.path === '/' ? '/' : route.path}`;
        const priority = route.path === '/' ? '1.0' : route.path === '/aviso-de-privacidad' ? '0.4' : '0.85';
        return `  <url>\n    <loc>${escapeHtmlAttr(loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
      })
      .join('\n');

    res.type('application/xml; charset=utf-8');
    res.send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
    );
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl.split('?')[0];
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        const baseUrl = resolveBaseUrl(req);
        const html = injectRouteSeo(template, baseUrl, url);
        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));

    app.use('*', (req, res) => {
      const url = req.originalUrl.split('?')[0];
      const template = fs.readFileSync(path.resolve(distDir, 'index.html'), 'utf-8');
      const baseUrl = resolveBaseUrl(req);
      const html = injectRouteSeo(template, baseUrl, url);
      res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Altura BC activo en http://0.0.0.0:${PORT}`);
  });
}

createServer();
