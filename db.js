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


  INSERT INTO content(name, body, page_id) values ('Welcome to ACME Web', 'You are free to navigate the site', 1);

  INSERT INTO content(name, body, page_id) values ('Moe', 'Moe is the CEO!', 2);
  INSERT INTO content(name, body, page_id) values ('Curly', 'Curly is the CEO!', 2);
  INSERT INTO content(name, body, page_id) values ('Larry', 'Larry is the CEO!', 2);

  INSERT INTO content(name, body, page_id) values ('Phone', 'Please call as at 555-555-5555', 3);
  INSERT INTO content(name, body, page_id) values ('Fax', 'Please fax as at 555-555-5556', 3);
`;

const getPages = () => {
  return client.query('SELECT * from pages').then(response => response.rows);
};

const getPage = id => {
  return client
    .query('SELECT * from pages WHERE id = $1', [id])
    .then(response => response.rows[0]);
};

const getContent = page_id => {
  return client
    .query(
      'SELECT pages.id, pages.name, content.name as contentName, content.body from content join pages on pages.id = content.page_id where page_id = $1',
      [page_id]
    )
    .then(response => response.rows[0]);
};

const sync = () => {
  return client.query(SEED).then(console.log('seeded DB'));
};

module.exports = { getPages, getPage, getContent, sync };
