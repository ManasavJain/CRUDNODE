const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://manasavjain88:p8q3Drq2uaoK4PmT@cluster0.ykwp5im.mongodb.net/'; // Replace this with your MongoDB URL
const dbName = 'ImpData';

const client = new MongoClient(url, { useUnifiedTopology: true });

async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName); // Ensure you are returning the 'db' object here
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = { connectToDB };
// const { ObjectId } = require('mongodb');


const getAllPeople = async () => {
  try {
    const db = await connectToDB();
    const collection = db.collection('People');
    const data = await collection.find({}).sort({_id: -1}).toArray();
    return data;
  } catch (error) {
    throw new Error('Error fetching data:', error);
  }
};

const checkdata = async (_id) => {
  try {
    const db = await connectToDB();
    const collection = db.collection('People');
    const data = await collection.findOne({ _id });
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Error fetching data:', error);
  }
};

const insertPeople = async (peopleData) => {
  try {
    const db = await connectToDB();
    const collection = db.collection('People');

    const data = await collection.insertMany(peopleData);
   
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error saving data: ${error.message}`);
  }
};



const updatePeople = async (email, first_name, last_name) => {
  try {
    const db = await connectToDB();
    const collection = db.collection('People');

    // Check if the user with the given email already exists in the database
    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      // If the user exists, update their data in the database
      await collection.updateOne({ email }, { $set: { first_name, last_name } });
      return { created: false }; // Return { created: false } to indicate that the user data was updated
    } else {
      // If the user does not exist, create a new entry in the database
      await collection.insertOne({ email, first_name, last_name });
      return { created: true }; // Return { created: true } to indicate that a new user was inserted
    }
  } catch (err) {
    throw new Error('Error updating/inserting data: ' + err.message);
  }
};

const deletePeople = async (_id) => {
  try {
    const db = await connectToDB();
    const collection = db.collection('People');

    // Delete the user with the specified _id
    const result = await collection.deleteOne({ _id :_id});

    return result;
  } catch (err) {
    throw new Error('Error deleting data: ' + err.message);
  }
};


module.exports = {
  getAllPeople,
  insertPeople,
  updatePeople,
  deletePeople,
  checkdata
};
