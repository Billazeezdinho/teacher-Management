const router = require('express').Router();
const {createStaff, verifyMail, userLogin, deleteStaff, updatedStaffs, getAllStaff, getOneStaff, confirmAdmin, confirmSuperAdmin} = require('../controller/staffController');
const upload = require('../helper/multer');
const {checkRole, adminRole} = require('../middleware/authorization')


// router.post('/staff', createStaff);
router.post('/staff', checkRole,  upload.single("photo"), createStaff);
router.get('/staffs', checkRole, getAllStaff);
router.get('/staff/:id',checkRole, getOneStaff)
router.patch('/staff/:id',checkRole, updatedStaffs);
router.delete('/staff/:id',checkRole, deleteStaff);
router.get('/mail/:id/:token',verifyMail);
router.post('/login/', userLogin);
router.patch('/login/super',confirmSuperAdmin, userLogin);
router.patch('/admin/:id',checkRole, confirmAdmin);

module.exports = router;
