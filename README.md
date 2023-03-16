# express-flash-message v3

Provides Express.js flash message middleware that work for rendering or redirecting.

**Requires [express-sessions](https://www.npmjs.com/package/express-session) or [cookie-session](https://github.com/expressjs/cookie-session) middleware before apply this middleware.**

## installation

npm: `npm install --save express-flash-message`

yarn: `yarn add express-flash-message`

pnpm: `pnpm add express-flash-message`

Note: if you don't install [express-session](https://www.npmjs.com/package/express-session) **or** [cookie-session](https://github.com/expressjs/cookie-session) before, then you also need install one of these dependencies.

## usage

You can go to [example](./examples) folder to run the following example.

```ts
import express from 'express';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import nunjucks from 'nunjucks';
import session from 'express-session';
import flash from 'express-flash-message';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// setup view
app.engine('njk', nunjucks.render);
app.set('view engine', 'njk');
nunjucks.configure(path.resolve(__dirname, '../views'), {
  autoescape: true,
  express: app,
});

// setup express-session
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

// setup flash
app.use(
  flash({
    sessionKeyName: 'express-flash-message',
    // below are optional property you can pass in to track
    onAddFlash: (type, message) => {},
    onConsumeFlash: (type: string, messages: string[]) => {},
  })
);

app.get('/flash', (req, res) => {
  res.flash('success', 'this is info flash message');
  res.flash('success', 'this is info flash message2');
  setTimeout(() => {
    res.redirect('/');
  }, 3000);
});

app.get('/', (req, res) => {
  res.flash('success', '-----info----');
  res.render('index');
});

app.listen('5000', () => {
  console.log('app start at http://localhost:5000');
});
```

Then in your template, you can consume the flash messages by calling `getFlashMessage(type)`. **But please remember the messages is an array.**

```html
<ul>
  {% for msg in getFlashMessages('success') %}
  <li>{{msg}}</li>
  {% endfor %}
</ul>
```

Note the example above is using [nunjuck](https://mozilla.github.io/nunjucks/) engine. You can use other engines also.

Note:

- The flash message is an **array**. You can use `res.flash('type', 'value')` several times and all the value will be stored in the `key`. Then when you call `getFlashMessages('type')` in your template directly, it will give you an **array** which contains all the values you want to flash.

- The Flash message will be **consumed** after you call `getFlashMessages('type')`.

- The package is build with typescript, so if you are using CommonJS and need `require` import, then you have to require it this way: `const flash = require('express-flash-message').default;`

## migrate from V2

If you are using v2 version, check doc [here](./READMEV2.md). Difference between v2 and v3:

1. in v3, we are using `response.flash` instead of `request.flash`.

2. If you are using template, you don't need to call `consumeFlash` method, it integrate with `response.render` now. In your template, you can directly call `getFlashMessages(key)` to get the flash message.

3. If you still want to consume the flash by your self, you can call the following method which exported by the package.

```js
export const getFlashMessages = (
  req: Request,
  sessionKeyName: string,
  type: string,
  onConsumeFlash?: OnConsumeFlash
) => void
```

## License

[MIT](./LICENSE)
