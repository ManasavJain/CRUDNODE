const express = require('express');
const exphbs = require('express-handlebars');
const {  getAllPeople, insertPeople, updatePeople } = require('./Models/db');


const app = express();
const port = 3000; // Change this to the desired port number

// Set up Handlebars middleware
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');



// Route to fetch all people data from the database and render it using Handlebars
// app.get('/', async (req, res) => {
//   try {
//     const data = await getAllPeople();
//     res.render('index', { peopleData: data });
//   } catch (error) {
//     res.render('error', { error: 'Error fetching data from the database' });
//   }
// });

app.get('/', async (req, res) => {
    try {
      // Assuming you have the necessary logic to get the data to be inserted from req.body
      const newData = req.body;
      const data = await insertPeople(newData);
      res.render('index', { peopleData:data });
    } catch (error) {
      res.render('error', { error: 'Error inserting data into the database' });
    }
  });
  
  // Route to update an existing person's data in the database
  app.put('/update/:id', async (req, res) => {
    try {
      const personId = req.params.id;
      // Assuming you have the necessary logic to get the updated data from req.body
      const updatedData = req.body;
      const data = await updatePeople(personId, updatedData);
      res.render('index', { peopleData:data });
    } catch (error) {
      res.render('error', { error: 'Error updating data in the database' });
    }
  });



// Additional routes and logic for inserting/updating data can be added here

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
