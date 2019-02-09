const express = require('express');
const app = require('./app');

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}...`);
});
