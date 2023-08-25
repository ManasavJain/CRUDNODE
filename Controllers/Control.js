
const { getAllPeople, insertPeople, updatePeople, deletePeople, checkdata } = require('../Models/db');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = Joi.object({
  _id: Joi.string().optional(),
  first_name: Joi.string().regex(/^[a-zA-Z, ]*$/, 'Alphanumerics, space and comma characters').min(3).max(30).required(),
  last_name: Joi.string().regex(/^[a-zA-Z, ]*$/, 'Alphanumerics, space and comma characters').min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]+$'))
    .required(),
});

const fta = async (req, res) => {
  res.json({ message: "Api is working...." });
};

const getData = async (req, res) => {
  try {
    const data = await getAllPeople();
    res.render('data', { data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const postForm = async (req, res) => {
  try {
    res.render('index', {});
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateForm = async (req, res) => {
  try {
    res.render('updateUser', {});
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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

const putData = async (req, res) => {
  try {
    const { email, first_name, last_name, _id, password } = req.body;
    const validationResult = userSchema.validate({ email, first_name, last_name, _id, password });

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const result = await updatePeople(email, first_name, last_name);
    const message = result.created ? 'User data inserted successfully' : 'User data updated successfully';

    return res.json({ message });
  } catch (err) {
    console.error('Error updating/inserting data:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteData = async (req, res) => {
  const _id = req.params._id;

  try {
    const result = await deletePeople(_id);
    if (result.deletedCount > 0) {
      return res.json({ message: 'User deleted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting data:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// const checkData = async (req, res) => {
//   const { _id, password } = req.body;

//   try {
//     const user = await checkdata(_id);

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     if (password === user.password) {
//       const token = jwt.sign({ _id: user._id }, 'secret_key', {
//         expiresIn: '1h',
//       });
//       return res.json({ token });
//     } else {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

const checkData = async (req, res) => {
  const { _id, password } = req.body;

  try {
    const user = await checkdata(_id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (password === user.password) {
      const token = jwt.sign({ _id: user._id }, 'secret_key', {
        expiresIn: '1h',
      });

      // Redirect to /api/postData upon successful login
      res.redirect('/postData');
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const loginpage = async (req, res) => {
  try {
    res.render('login', {});
  } catch (err) {
    res.status(500).json({ error: 'you cannot login due to a 500 error' });
  }
};

module.exports = { fta, getData, postData, putData, postForm, deleteData, updateForm, checkData, loginpage };
