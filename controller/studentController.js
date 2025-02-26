
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


exports.createStudents = async (req, res)=>{
    try{
        const findStaff = await staffModel.findById(req.params.id)
        if(!findStaff){
            return res.status(404).json({
                message: 'Staff not found'
            })
        } 
        const { fullName, password, department, DOB, gender, email,} = req.body
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
            password: hash, 
            department, 
            DOB,
            gender, 
            email,
            studentImageId: uploadImage.public_id,
            studentImageURL: uploadImage.secure_url
           
        }
        fs.unlink(req.file.path, (err)=>{

            if(err){
                console.log('err.message');
                
            }else{
                console.log('File successfully Removed');
                
            }
        })
        const newStudent = await studentModel.create(data);
        
        const token = await jwt.sign({id:newStudent._id}, key, {expiresIn: '7mins'})
        const link =   `${req.protocol}://${req.get('host')}/mail/${newStudent._id}/${token}`
        const subject = "WELCOME " + fullName.split(" ")[0];
        const text = `Welcome ${newStudent.fullName}, Kindly use this link to verify your email ${link}`;
        sendMail({ subject:subject, email:newStudent.email, html:signup(link, newStudent.fullName) })
        if( newStudent.department == "science"){
            return res.status(201).json({
                message: 'New Science student Created Successfully',
                data: newStudent
            })
        }else if( newStudent.department = "art"){
            return res.status(201).json({
                message: 'New art student Created Successfully',
                data: newStudent
            })
        }else {
            return res.status(201).json({
                message: 'New student Created Successfully',
                data: newStudent
            })
        }
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
} 
exports.getAllStudents = async (req, res)=>{
    try {
           
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
        const data = { 
            DOB: req.body.DOB, 
            fullName: req.body.fullName
        };
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