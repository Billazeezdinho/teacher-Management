const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim: true,
        lowercase:true
    },
    email: {
        type:String,
        required: true,
        trim: true,
        lowercase: true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        required: true,
        lowercase: true,
        default:'teacher',
        enum:['admin', 'teacher','student']
    },
    staffImadeId:{
        type: String
    },
    staffImageUrl:{
        type: String
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    isSuperAdmin:{
        type: Boolean,
        default: false
    },
    dateCreated:{
        type: Date,
        required: true,
        immutable:true,
        default: ()=>{
            const date = new Date
            return date.toISOString()
        }
    },
    teachers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'teacher'
    }]
})
const staffModel = mongoose.model('staff', staffSchema)
module.exports = staffModel;