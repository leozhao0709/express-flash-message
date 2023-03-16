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
// the first argument to nunjucks is the path to the folder
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
