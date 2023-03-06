const path = require('path');
const Koa = require('koa');
const app = new Koa();
const EventEmitter = require('events');

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

class MessageSource extends EventEmitter {
  constructor() {
    super();
    this.messages = [];
  }
  setMessage(newMessage) {
    this.messages.push(newMessage);
    this.emit('recieved', newMessage);
  }
}
const messageSource = new MessageSource();

router.get('/subscribe', async (ctx, next) => {
  const getMessage = new Promise((resolve) => {
    messageSource.on('recieved', (newMessage) => {
      resolve(newMessage);
    });
  });

  try {
    const message = await getMessage;
    ctx.response.body = `${message}`;
  } catch (err) {
    ctx.status = 500;
    console.error(err);
  }
});

router.post('/publish', async (ctx, next) => {
  const newMessage = ctx.request.body.message;
  if (newMessage) {
    messageSource.setMessage(ctx.request.body.message);
  }
  ctx.status = 200;
});

app.use(router.routes());

module.exports = app;
