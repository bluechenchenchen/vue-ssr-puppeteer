const Koa = require("koa");
const app = new Koa();
const server = require("koa-static");
const cors = require("@koa/cors");

app.use(cors());

app.use(
  server(`${__dirname}/dist`, {
    maxage: 7200 * 1000
  })
);

const port = process.env.PORT || 5001;
app.listen(port);
// eslint-disable-next-line no-console
console.log(`The project is working on port ${port}`);
