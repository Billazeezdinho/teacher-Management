const router = require('express').Router();

const { createStudents, getAllStudents, getOneStudent, updateStudent, deleteStudents } = require('../controller/studentController');

router.post('/student', createStudents);
router.post('/student/:id', createStudents);
router.get('/students', getAllStudents);
router.get('/student/:id', getOneStudent);
router.patch('/student/:Id', updateStudent);
router.delete('/student/:id', deleteStudents)

module.exports = router;