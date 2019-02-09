const pg = require('pg');

const client = new pg.Client('postgres://localhost/acme_web');

client.connect();

const SEED = `
  DROP TABLE IF EXISTS content;
  DROP TABLE IF EXISTS pages;


  CREATE TABLE pages(id serial primary key,
    name varchar(255),
    is_home_page boolean);

  CREATE TABLE content(id serial primary key,
    name varchar(255),
    body text,
    page_id integer references pages(id));

  INSERT INTO pages(name, is_home_page) values('Home', true);
  INSERT INTO pages(name, is_home_page) values('Employees', false);
  INSERT INTO pages(name, is_home_page) values('Contact', false);


  INSERT INTO content(name, body, page_id) values ('Acme Web: Home', '
  <h2>Welcome to the Home Page</h2>
  <div>The online portal to all Acme services and products.</div>
  ', 1);

  INSERT INTO content(name, body, page_id) values ('Acme Web: Employees', '
  <h2>Moe</h2>
  <div>Moe is our CEO!!!</div>

  <h2>Larry</h2>
  <div>Larry is our CTO!!!</div>

  <h2>Curly</h2>
  <div>Curly is the COO!!!</div>
  ', 2);


  INSERT INTO content(name, body, page_id) values ('Acme Web: Contact Us', '
  <h2>Phone</h2>
  <div>Calls us at 212-555-1212</div>

  <h2>Fax</h2>
  <div>Fax us at 212-555-1212</div>
  ', 3);
`;

const getPages = () => {
  return client.query('SELECT * from pages').then(response => response.rows);
};

const getPage = id => {
  return client
    .query('SELECT * from pages WHERE id = $1', [id])
    .then(response => response.rows[0])
    .catch(ex => console.log(ex));
};

const getContent = page_id => {
  return client
    .query('SELECT * from content where page_id = $1', [page_id])
    .then(response => response.rows[0])
    .catch(ex => console.log(ex));
};

const sync = () => {
  return client.query(SEED).then(console.log('seeded DB'));
};

module.exports = { getPages, getPage, getContent, sync };
