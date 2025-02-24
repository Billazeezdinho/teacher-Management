const studentModel = require('../model/studentModel');
const staffModel = require('../model/staffModel');

exports.createStudents = async (req, res)=>{
    try {
        const findStaff = await staffModel.findById(req.params.id);
        if(!findStaff){
            res.status(400).json({
                message: "student    not assigned to any staff"
            })
        }
        const {fullName, DOB, email, phoneNumber, gender, studentImageURL, studentImageId} = req.body;

        const data = {
            fullName,
            DOB,
            email,
            phoneNumber,
            gender,
            studentImageId: uploadImage.public_id,
            studentImageURL: uploadImage.secure_url
        };

        const newStudent = await studentModel(data);
        newStudent.staff = req.params._id;
        //save the student created in the staff database
        await newStudent.save();
        // push the student created to a staff for assigning
        findStaff.students.push(newStudent._id);
        await findStaff.save();
        res.status(200).json({
            message: "Student created succesfully",
            data: newStudent
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
};

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