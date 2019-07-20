const Koa = require("koa");
const app = new Koa();
const server = require("koa-static");
const puppeteer = require("puppeteer");
const { URL } = require("url");
const cors = require("@koa/cors");

const RENDER_CACHE = new Map();

app.use(cors());

app.use(async (ctx, next) => {
  const url = new URL(ctx.request.href);
  url.hostname = "localhost";
  url.port = process.env.PORT || 5001;
  // eslint-disable-next-line no-console
  console.log("url: ", url.href);
  if (!isNeedSsrPath(url.pathname)) {
    // eslint-disable-next-line no-console
    console.log("is not need ssr path: ", url.pathname);
    await next();
  } else {
    const { html, ttRenderMs } = await ssr(url.href);
    ctx.set(
      "Server-Timing",
      `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`
    );
    ctx.body = html;
  }
});

app.use(
  server(`${__dirname}/dist`, {
    maxAge: 7200 * 1000
  })
);

const port = process.env.SSR_PORT || 5009;
app.listen(port);
// eslint-disable-next-line no-console
console.log(`ssr is working on port ${port}`);

async function ssr(url) {
  if (RENDER_CACHE.has(url)) {
    return { html: RENDER_CACHE.get(url), ttRenderMs: 0 };
  }

  const start = Date.now();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url, {
      waitUntil: ["domcontentloaded", "load", "networkidle0", "networkidle2"]
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();

  const ttRenderMs = Date.now() - start;
  // eslint-disable-next-line no-console
  console.info(`Headless rendered page in: ${ttRenderMs}ms`);

  RENDER_CACHE.set(url, html);

  return { html, ttRenderMs };
}

function isNeedSsrPath(path) {
  let flag = true;
  // 这里要把build生成的dist目录里面的静态资源给排除
  const dontNeedSsrPathArray = ["/img", "/js", "/css"];
  dontNeedSsrPathArray.forEach(item => {
    if (path.startsWith(item)) {
      flag = false;
    }
  });

  return flag;
}
