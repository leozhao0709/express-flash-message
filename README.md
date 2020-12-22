# express-flash-message

Provides Express.js flash message middleware that work for rendering or redirecting.

**Requires [express-sessions](https://www.npmjs.com/package/express-session) or [cookie-session](https://github.com/expressjs/cookie-session) middleware before apply this middleware.**

## installation

npm: `npm install --save express-flash-message`

yarn: `yarn add express-flash-message`

Note: if you don't install [express-session](https://www.npmjs.com/package/express-session) **or** [cookie-session](https://github.com/expressjs/cookie-session) before, then you also need install these dependency.

## usage

```ts
const express = require('express');
const session = require('express-session');
const path = require('path');
const { flash } = require('express-flash-message');

const app = express();
const port = 3000;

// express-session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
    },
  })
);

// apply express-flash-message middleware
app.use(flash({ sessionKeyName: 'flashMessage' }));

app.get('/flash', async function (req, res) {
  // Set a flash message by passing the key, followed by the value, to req.flash().
  await req.flash('info', 'Flash is back!');
  res.redirect('/');
});

app.get('/', async function (req, res) {
  // Get an array of flash message by passing the key to req.consumeFlash()
  const messages = await req.consumeFlash('info');
  res.render('index', { messages });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

If you are using `cookie-session`, please sepecify it with `useCookieSession`:

```js
app.use(flash({ sessionKeyName: 'flashMessage', useCookieSession: true }));
```

Then in your template, you can consume the flash messages. **But please remember the messages is an array.**

```html
<ul>
  {% for msg in messages %}
  <li>{{msg}}</li>
  {% endfor %}
</ul>
```

Note the example above is using [nunjuck](https://mozilla.github.io/nunjucks/) engine. You can use other engines also.

Note:

- This middleware must be used **after** `express-session` or `cookie-session` middleware.

- `req.flash` and `req.consumeFlash` returns a **Promise**. We saw several other flash packages are not using async process to deal with flash message, then if user refresh page really quickly, it will have trouble to consume the flash message. This package is mainly to fix that issue.

- the flash message is an **array**. You can use `await req.flash('key', 'value')` several times and all the value will be stored to the `key`. Then when you call `await req.consumeFlash('key')`, it will give you an **array** which contains all the value you want to flash.

- The Falsh message will be **set to null** after you call `await req.consumeFlash('key')` from session which means it will be removed from your session.

## License

[MIT](./LICENSE)
