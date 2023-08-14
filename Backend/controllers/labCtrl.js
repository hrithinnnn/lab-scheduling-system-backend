const lab = require('../models/labModel');
const requests = require('../models/requestModel');
var ObjectId = require('mongodb').ObjectId;
var isTimeOverlap=require('../Utils/time-overlap');
var compare=require('../Utils/time-compare');
const labCtrl = {
    createLabClass: async(req, res) =>{
        try {
            const {section,semester,batch,dateOfClass,startTime,endTime,subject,labName} = req.body;
            console.log(labName)
            const dt=new Date(dateOfClass);
            const newLabClass = new lab({
                section,semester,batch,dateOfClass:dt,startTime,endTime,subject,labName
            })
            console.log(newLabClass)
            const reqs = await requests.find({dateOfEvent:dt,labName})
            // console.log(reqs)
        let overlap = false;
        if (reqs.length > 0) {
            for (let req of reqs) {
                const t1 = {
                    start: req.startTime,
                    end: req.endTime
                };
                const t2 = {
                    start: startTime,
                    end: endTime
                };
                console.log(t1,t2);
                if (isTimeOverlap(t1, t2)) {
                    overlap = true;
                    break;
                }
            }
        console.log(overlap);
        }
        if (overlap) {
            res.status(201).json({ status:"Failure", message: "event already scheduled during these hours", data: {} });
            return null;
        }
        const labs = await lab.find({dateOfClass:dt,labName})
        // console.log(reqs)
    // let overlap = false
    if (labs.length > 0) {
        for (let l of labs) {
            const t1 = {
                start: l.startTime,
                end: l.endTime
            };
            const t2 = {
                start: startTime,
                end: endTime
            };
            // console.log(t1,t2);
            if (isTimeOverlap(t1, t2)) {
                overlap = true;
                break;
            }
        }
    console.log(overlap);
    }
    if (overlap) {

        res.status(201).json({ status:"Failure", message: "Lab already scheduled during these hours" });
        return null;
    }
            await newLabClass.save()
            res.status(200).json({status:"Success", message: "lab class has been scheduled successfully"})
        } catch (err) {
            return res.status(500).json({status:"failure", message:err.message})
        }
    },
    deleteLabClass: async(req, res) =>{
        try {
            const id=req.params.id;
            await lab.findByIdAndDelete(req.params.id)
            res.status(200).json({status:"success",message: `Deleted request: ${id}`})
        } catch (err) {
            return res.status(500).json({status:"failure",message: err.message})
        }
    },

    getLabClassess: async(req, res) => {
        try {
            const dt=new Date(req.params.date);
            const reqs = await lab.find({dateOfClass:dt});
            res.status(200).json({status:"success",reqs})
        } catch (err) {
            return res.status(500).json({status:"failure",message: err.message})
        }
    },
    
    // sample: async(req,res)=>{
    //     const date=new Date("4-8-2023");
    //     try {
    //         const reqs = await lab.insertMany({date})
    //         res.json(reqs)
    //     } catch (err) {
    //         return res.status(500).json({msg: err.message})
    //     }
    // },
    // sampleGet: async(req,res)=>{
    //     const date=new Date("2023-08-16");
    //     try {
    //         const reqs = await lab.find({date:{"$lte": date}})
    //         res.json(reqs)
    //     } catch (err) {
    //         return res.status(500).json({msg: err.message})
    //     }
    // },
    getLabsBetweenDates: async(req,res)=>{
        try{
            const start= new Date(req.params.startdate);
            const end = new Date(req.params.enddate);
            const labClasses = await lab.find({$and:[{dateOfClass:{"$gte": start}},{dateOfClass:{"$lte": end}}]})
            // console.log(labClasses);
            res.status(200).json({status:"success",labClasses})
        }catch (err) {
            return res.status(500).json({status:"failure",message: err.message})
    }
    }
    }

module.exports = labCtrl