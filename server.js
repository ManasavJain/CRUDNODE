const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Replace 'your_mongodb_uri' with your actual MongoDB URI
const mongoURI = 'mongodb+srv://manasavjain88:p8q3Drq2uaoK4PmT@cluster0.ykwp5im.mongodb.net/'
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const dataSchema = new mongoose.Schema({
  _id: String,
  first_name: String,
  last_name: String,
  email: String,
});

const DataModel = mongoose.model('Data', dataSchema);

const app = express();
app.use(bodyParser.json());

// Endpoint to save user data to the database
app.post('/save-data', (req, res) => {
  const { _id, first_name, last_name, email } = req.body;
  const newData = new DataModel({ _id, first_name, last_name, email });

  newData.save((err, data) => {
    if (err) {
      console.error('Error saving data:', err);
      res.status(500).json({ error: 'Error saving data' });
    } else {
      console.log('Data saved:', data);
      res.status(200).json({ message: 'Data saved successfully' });
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
