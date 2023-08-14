const mongoose = require('mongoose')


const labClassSchema = new mongoose.Schema({
    type:{
        type: Number,
        default:1
    },
    section:{
        type: String,
        required: true
    },
    semester:{
        type: Number,
        required: true
    },
    batch:{
        type: Number,
        required: true
    },
    dateOfClass:{
        type:Date,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    labName:{
        type:String,
        required:true
    }

},{
    timestamps: true
})


module.exports = mongoose.model('labClass', labClassSchema)