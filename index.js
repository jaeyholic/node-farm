const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////
///////SERVER

//PRODUCTS TEMPLATES

//OVERVIEW TEMPLATE
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);

//CARD TEMPLATE
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

//PRODUCT TEMPLATE
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

//JSON DATA
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

//CREATING SERVER
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const cardHTML = dataObject
      .map(el => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHTML);
    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, 'localhost', (req, res) => {
  console.log('Listening to request on port 8000');
});
