const studentRouter = require('express').Router();
const upload = require('../helper/multer');
const { createStudents, getAllStudents, getOneStudent, updateStudent, deleteStudents } = require('../controller/studentController');


studentRouter.post('/student/:id', upload.single("photo"), createStudents);
studentRouter.get('/students', getAllStudents);
studentRouter.get('/student/:id', getOneStudent);
studentRouter.patch('/student/:Id', updateStudent);
studentRouter.delete('/student/:id', deleteStudents)

module.exports = studentRouter;