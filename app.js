const express = require('express');
const db = require('./db');
const app = express();

db.sync();

module.exports = app;

app.use((req, res, next) => {
  db.getPages()
    .then(pages => {
      req.pages = pages;
      next();
    })
    .catch(next);
});

app.get('/', (req, res) => {
  const page = req.pages[0];
  res.redirect(`/pages/${page.id}`);
});

app.get('/pages/:id', (req, res) => {
  db.getContent(req.params.id).then(page =>
    res.send(
      `
  <html>
    <head>
    <title>${page.name}</title>
    <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css' />
    </head>
    <body>
    <div class="container">
    <h1>Acme Web</h1>
      <ul class="nav nav-tabs" style="margin-bottom: 20px">
        ${req.pages
          .map(
            page => `      <li class='nav-item'>
        <a href='/pages/${page.id}' class='nav-link'>
        ${page.name}
        </a>
        </li>`
          )
          .join('')}
      </ul>
    <div>${page.body}</div>
    </div>
  </body>
</html>
  `
    )
  );
});
