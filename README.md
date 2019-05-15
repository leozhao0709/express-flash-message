# express-flash-message

Provides Express.js flash message middleware that work for rendering or redirecting.

**Requires sessions middleware before apply this middleware.**

## installation

npm: `npm install express-flash-message`

yarn: `yarn add express-flash-message`

## usage

```ts
var { flash } = require('express-flash-message');
var app = express();

app.use(flash({ sessionKeyName: 'flashMessage' })); // if you don't provide sessionKeyName, then it will use 'flash' to store in your sessison.

app.get('/flash', async function(req, res) {
  // Set a flash message by passing the key, followed by the value, to req.flash().
  await req.flash('info', 'Flash is back!');
  res.redirect('/');
});

app.get('/', async function(req, res) {
  // Get an array of flash message by passing the key to req.consumeFlash()
  res.render('index', { message: await req.consumeFlash('info') });
});
```

Note:

- this middleware must be used **after** session middleware.
- `req.flash` and `req.consumeFlash` returns a **Promise**. We saw several other flash packages are not using async process to deal with flash message, then if user refresh page really quickly, it will have trouble to consume the flash message. This package is mainly to fix that issue.
- the flash message is an **array**. You can use `await req.flash('key', 'value')` several times and all the value will be stored to the `key`. Then when you call `await req.consumeFlash('key')`, it will give you an **array** which contains all the value you want to flash.

The Falsh message will be **set to null** after you call `await req.consumeFlash('key')` from session which means it will be removed from your session.

## License

[MIT](./LICENSE)
