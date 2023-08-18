
const { getAllPeople, insertPeople, updatePeople,deletePeople } = require('../Models/db');
const Joi = require('joi')


const userSchema = Joi.object({
  
  _id: Joi.string().optional(),
  first_name: Joi.string().regex(/^[a-zA-Z, ]*$/, 'Alphanumerics, space and comma characters').min(3).max(30).required(),
  last_name: Joi.string().regex(/^[a-zA-Z, ]*$/, 'Alphanumerics, space and comma characters').min(3).max(30).required(),
  email: Joi.string().email().required()
   // Assuming _id is optional for inserts
});

const fta = async (req, res) => {
  res.json({ message: "Api is working...." });
};


const getData = async (req, res) => {
  try {
    const data = await getAllPeople();
    // res.json(data)
    res.render('data', { data }); // Render the 'data' template and pass the 'data' object to it
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




const postForm = async (req, res) => {
  try {
    
    // res.json(data)
    res.render('index', {  }); // Render the 'data' template and pass the 'data' object to it
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateForm = async (req, res) => {
  try {
    
    // res.json(data)
    res.render('updateUser', {  }); // Render the 'data' template and pass the 'data' object to it
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// const postData = async (req, res) => {
//   try {
//     console.log('Hiiiiii');
//     let data = req.body;

//     // If data is not an array, convert it to an array
//     if (!Array.isArray(data)) {
//       data = [data];
//     }
    
//     const result = await insertPeople(data);
//     res.json(result);
//   } catch (error) {
//     console.error('Error saving data:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

const postData = async (req, res) => {
  try {
    let data = req.body;
    const validationResult = userSchema.validate(data);
    
    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    if (!Array.isArray(data)) {
      data = [data];
    }
    const result = await insertPeople(data);
    res.json(result);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// const putData = async (req, res) => {
  
//   const email = req.body.email;
//   const first_name = req.body.first_name;
//   const last_name = req.body.last_name;
//   // const _id = req.body._id

//   try {
//     const result = await updatePeople(email, first_name, last_name);

//     // Check if the result has a "created" flag, which indicates whether a new entry was created
//     const message = result.created ? 'User data inserted successfully' : 'User data updated successfully';

//     return res.json({ message });
//   } catch (err) {
//     console.error('Error updating/inserting data:', err.message);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

const putData = async (req, res) => {
  try {
    const { email, first_name, last_name, _id } = req.body;
    const validationResult = userSchema.validate({ email, first_name, last_name, _id });

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const result = await updatePeople(email, first_name, last_name);
    const message = result.created ? 'User data inserted successfully' : 'User data updated successfully';

    return res.json({ message });
  } catch (err) {
    console.error('Error updating/inserting data:', err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



const deleteData = async (req, res) => {
  const _id = req.params._id; // Assuming you pass the user's _id in the URL parameter

  try {
    const result = await deletePeople(_id);
    if (result.deletedCount > 0) {
      return res.json({ message: 'User deleted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting data:', err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = { fta, getData, postData, putData,postForm, deleteData,updateForm };
