const router = require('express').Router();
const {createStaff, verifyMail, userLogin, deleteStaff, updatedStaffs, getAllStaff, getOneStaff} = require('../controller/staffController');
const upload = require('../helper/multer');
const {checkRole} = require('../middleware/authorization')


// router.post('/staff', createStaff);
router.post('/staff', checkRole, upload.single("photo"), createStaff);
router.get('/staffs', getAllStaff);
router.get('/staff/:id', getOneStaff)
router.patch('/staff/:id', updatedStaffs);
router.delete('/staff/:id', deleteStaff);
router.get('/mail/:id/:token',verifyMail);
router.post('/login', userLogin);

module.exports = router;
