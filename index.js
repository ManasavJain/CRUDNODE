
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');



// Set the views directory to a custom folder

// Import the routes
const routes = require('./Routes/RoutesExample');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express middleware to parse JSON request bodies
app.use(express.json());

// Use the routes as middleware
app.use('/', routes);






const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
