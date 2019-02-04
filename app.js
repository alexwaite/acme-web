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
  db.getPage(req.params.id).then(page =>
    res.send(
      `
  <html>
  <body>
    <ul>
      ${req.pages.map(page => `<li>${page.name}</li>`).join('')}
    </ul>
    <h2>${page.name}</h2>
    <div>${page.body}</div>
  </body>
</html>
  `
    )
  );
});
