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
// the first argument to nunjucks is the path to the folder
nunjucks.configure(path.resolve(__dirname, '../views'), {
  autoescape: true,
  express: app,
});

app.use(
  flash({
    // // below are optional property you can pass in to track
    // onAddFlash: (type, message) => {},
    // onConsumeFlash: (type: string, messages: string[]) => {},
  })
);

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
