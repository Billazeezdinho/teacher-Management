const staffModel = require('../model/staffModel');
const studentModel = require('../model/studentModel');
require('dotenv').config()
const cloudinary = require('../helper/cloudinary');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const key = process.env.key;
const sendMail = require('../helper/email');
const bcrypt = require('bcryptjs');
const signup = require('../helper/signUp')


exports.createStaff = async (req, res)=>{
    try{
        const {fullName, email, password, role} = req.body
        const uploadImage = await cloudinary.uploader.upload(req.file.path, (err)=>{

            if(err){
                return res.status(400).json({
                    message: 'Error uploading image' + err.message
                }) 
                
            }
        })
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt)
        const data = {
            fullName,
            email,
            password: hash,
            role,
            staffImadeId: uploadImage.public_id,
            staffImageUrl: uploadImage.secure_url
        }
        fs.unlink(req.file.path, (err)=>{

            if(err){
                console.log('err.message');
                
            }else{
                console.log('File successfully Removed');
                
            }
        })
        const newStaff = await staffModel.create(data);
        
        const token = await jwt.sign({id:newStaff._id}, key, {expiresIn: '7mins'})
        const link =   `${req.protocol}://${req.get('host')}/mail/${newStaff._id}/${token}`
        const subject = "WELCOME " + fullName.split(" ")[0];
        const text = `Welcome ${newStaff.fullName}, Kindly use this link to verify your email ${link}`;
        sendMail({ subject:subject, email:newStaff.email, html:signup(link, newStaff.fullName) })
        if( newStaff.role == "admin"){
            return res.status(201).json({
                message: 'New SuperAdmin Created Successfully',
                data: newStaff
            })
        }else if( newStaff.role = "teacher"){
            return res.status(201).json({
                message: 'New Teacher Created Successfully',
                data: newStaff
            })
        }
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}

exports.verifyMail = async (req, res) =>{
    try{
        const { id } = req.params
        const checkStaff = await staffModel.findById( id)
        if(!checkStaff){
            return res.status(404).json({
                message: 'No Staff found'
            })
        }
        
        if(checkStaff.isVerified === true){
            return res.status(400).json({
                message: 'email already been verified'
            })
        }
        await jwt.verify(req.params.token, key, (error)=>{
            if(error){
                return res.status(404).json({
                    message: "Email Link Has Expired"  
                })
            }
        })
        const verifyingMail = await staffModel.findByIdAndUpdate(id, {isVerified: true})
        res.status(200).json({
            message: 'Email verified successfully'
        })
    }catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

exports.userLogin = async (req, res) => {
    try{
        const { email, passWord } = req.body;
        const checkEmail = await staffModel.findOne({ email });

        if(!checkEmail){
            return res.status(404).json({
                message: "Email not found"
            })
        }
        const checkPassword = await bcrypt.compare(passWord, checkEmail.password)
        if(!checkPassword){
            return res.status(400).json({
                message: "Incorrect Password"
            })
        }
        if(checkEmail.isVerified == false){
            return res.status(400).json({
                message: "Email not verified"
            })
        }
        const {isVerified, schoolImageUrl, schoolImageId, department, students, dateCreated, password, ...others} = checkEmail._doc

        const token = jwt.sign({id:checkEmail._id}, key, {expiresIn: '1D'})
        
        res.status(200).json({
            message: "Login Successfully",
            data: others,
            token
        })
    }catch(error){
        res.status(500).json({
            message:"Unable to Login" + error.message
        })
    }
};

exports.getAllStaff = async(req, res) =>{
    try {
        const findAllStaff = await staffModel.find();
        if(!findAllStaff){
            return res.status(404).json({
                message:'No staff found'
            })
        }
        res.status(200).json({ 
            message: "All staffs found ",
            data: findAllStaff,
            total: findAllStaff.length

        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

exports.getOneStaff = async(req,res)=>{
    try {
        const {id} = req.params;
        const findOne = await staffModel.findById(id);
        
        if(!findOne){
            return res.status(404).json({
                message: 'No Staff found'
            })
        }
        res.status(200).json({
            message:'Staff found',
            data: findOne
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
};

exports.updatedStaffs = async(req, res) => {
    try {
        
        const {id} = req.params;
        const data = {fullName: req.body.fullName, email: req.body.email};
        
        const updatedStaff = await staffModel.findByIdAndUpdate(id, data, {new: true});
        
        if(!updatedStaff) {
            return res.status(400).json({
                message: "Staffs details not updated"
            });
        }

        return res.status(200).json({
            message: "Staffs details updated",
            data: updatedStaff
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteStaff = async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteStaff = await staffModel.findByIdAndDelete(id);
        if(!deleteStaff){
            res.status(400).json({
                message:"Staff details not deleted"
            })
        }
        return res.status(200).json({
            message:"Staff data Successfully deleted",
            data: deleteStaff
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

exports.confirmAdmin = async (req, res)=>{
    try{
        const comfirmAdmin = await staffModel.findByIdAndUpdate(req.params.id, {isAdmin:true}, {new:true})
        
        res.status(200).json({
            message:" This Teacher is now an Admin"
        })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
exports.confirmSuperAdmin = async (req, res)=>{
    try{
        const comfirmAdmin = await staffModel.findByIdAndUpdate(req.params.id, {isSuperAdmin:true}, {new:true})
        
        res.status(200).json({
            message:" This Admin is now a superAdmin"
        })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
exports.getAllStudents = async (req, res)=>{
    try {
        const {id} = req.params;
        
        const findAll = await studentModel.find();
        if(!findAll){
            return res.status(404).json({
                message:'student not found'
            })
        }
        res.status(200).json({
            message: "students found",
            data: findAll,
            total: findAll.length
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
};

exports.getOneStudent = async(req, res)=>{
    try {
        const {id} = req.params;
    
        const getOne = await studentModel.findById(id);
        if(!getOne){
            res.status(400).json({
                message: "No student found"
            })
        };
        return res.status(200).json({
            message:"A student was found",
            data: getOne
        })

        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
};
exports.updateStudent = async(req, res) => {
    try {
        const {Id} = req.params;
        const data = { DOB: req.body.DOB, fullName: req.body.fullName};
        
        const updatedStudent = await studentModel.findByIdAndUpdate(Id, data, {new: true});
        
        if(!updatedStudent) {
            return res.status(400).json({
                message: "Student details not updated"
            });
        }

        return res.status(200).json({
            message: "Students details updated",
            data: updatedStudent
        });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteStudents = async(req, res)=>{
    try {
        const {id} = req.params;
        const deleteStudent = await studentModel.findByIdAndDelete(id);
        if(!deleteStudent){
            res.status(400).json({
                message:"Student details not deleted"
            })
        }
        return res.status(200).json({
            message:"Student data Successfully deleted",
            data: deleteStudent
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}
