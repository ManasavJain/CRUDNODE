const express = require('express');
const router = express.Router();
const {fta,getData,postData,putData, postForm, deleteData, updateForm} = require("../Controllers/Control")
router.route('').get(fta)
router.route('/api/data').get(getData);

router.route('/api/postData').post(postData);

router.route('/updatemail/data').put(putData)
router.route('/updateUser').get(updateForm)

router.route('/postData').get(postForm)
router.route('/deleteuser/:_id').delete(deleteData)

module.exports = router;
