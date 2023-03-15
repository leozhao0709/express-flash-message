# express-flash-message v3

Provides Express.js flash message middleware that work for rendering or redirecting.

In v3, there is no session needed! If you are using v2 version, check doc [here](./READMEV2.md)

## installation

npm: `npm install --save express-flash-message`

yarn: `yarn add express-flash-message`

pnpm: `pnpm add express-flash-message`

## usage

You can go to [example](./examples) folder to run the following example.

```ts
import express from 'express';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import nunjucks from 'nunjucks';
import flash from 'express-flash-message';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.engine('njk', nunjucks.render);
app.set('view engine', 'njk');
nunjucks.configure(path.resolve(__dirname, '../views'), {
  autoescape: true,
  express: app,
});

app.use(flash());

app.get('/flash', (req, res) => {
  res.flash('success', 'this is info flash message');
  res.flash('success', 'this is info flash message2');
  res.redirect('/');
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

## License

[MIT](./LICENSE)
