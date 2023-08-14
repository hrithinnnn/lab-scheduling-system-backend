const mongoose = require('mongoose')


const requestSchema = new mongoose.Schema({
    labName:{
        type:String,
        required:true
    },
    type:{
        type:Number,
        default:0
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    dateOfRequest:{
        type: Date,
        default: Date.now
    },
    dateOfEvent:{
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
    HODApproval:{
        type:Number,
        default:0
    },
    labApproval:{
        type:Number,
        default:0
    },
    userId: {
        type: String,
        required: true
    },approvedBy:{
        type:String,
        default:''
    },
    deniedBy:{
        type:String,
        default:''
    },
    eventType:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},{
    timestamps: true
})


module.exports = mongoose.model('request', requestSchema)