const requests = require('../models/requestModel')
var ObjectId = require('mongodb').ObjectId;
var isTimeOverlap=require('../Utils/time-overlap');
var compare=require('../Utils/time-compare');
const lab = require('../models/labModel')
const approvalState=require('../models/approvalEnum');
const requestCtrl = {
    createRequest: async(req, res) =>{
        try {
            const {title, description,dateOfEvent,startTime,endTime,userId,labName,eventType,email} = req.body;
            const dt= new Date(dateOfEvent);
            const newRequest = new requests({
                title,
                description,
                dateOfEvent:dt,
                startTime,
                endTime,
                userId,
                labName,
                eventType,
                email
            })
            console.log(labName)
    //         const reqs = await requests.find({dateOfEvent:dt, labName:labName})
    //         // console.log(reqs)
            
    //     let overlap = false;

    //     let clashingReq;
    //     if (reqs.length > 0) {
    //         for (let req of reqs) {

    //             const t1 = {
    //                 start: req.startTime,
    //                 end: req.endTime
    //             };

    //             const t2 = {
    //                 start: startTime,
    //                 end: endTime
    //             };
    //             console.log(t1,t2);
    //             if (isTimeOverlap(t1, t2)) {
    //                 clashingReq=req;
    //                 overlap = true;
    //                 break;
    //             }
    //         }
    //     console.log(overlap);
    //     }

    //     if (overlap) {

    //       res.status(201).json({ status: "failure",message: "event already scheduled during these hours" , details:clashingReq });
    //         return null;
    //     }

    //     const labs = await lab.find({dateOfClass:dt})
    //     // console.log(reqs)
        
    // // let overlap = false;

    // if (labs.length > 0) {

    //     for (let l of labs) {

    //         const t1 = {
    //             start: l.startTime,
    //             end: l.endTime
    //         };

    //         const t2 = {
    //             start: startTime,
    //             end: endTime
    //         };
    //         // console.log(t1,t2);
    //         if (isTimeOverlap(t1, t2)) {

    //             overlap = true;
    //             break;
    //         }
    //     }
    // console.log(overlap);
    // }

    // if (overlap) {

    //   res.status(201).json({ status: "failure", message:"event already scheduled during these hours"});
    //     return null;
    // }


            // console.log(newRequest)
            await newRequest.save()
            res.status(200).json({status:"success", message: "Request has been sent successfully"})
        } catch (err) {
            return res.status(500).json({status:"failure", message: err.message})
        }
    },
    deleteRequest: async(req, res) =>{
        try {
            const id=req.params.id;
            await requests.findByIdAndDelete(req.params.id)
            res.status(200).json({status:"success",message: "Deleted request: ",id})
        } catch (err) {
            return res.status(500).json({status:"failure",message: err.message})
        }
    },
    updateRequest: async(req, res) =>{
        const _id=req.params.id;
        try {
            const {title, description,eventType} = req.body;
            console.log({_id,title, description})
            const docs= await requests.updateOne({_id: _id},
            {$set:{title:title, description,eventType}})
            res.status(200).json({status:"success",message:"request was edit successfully",docs});
        } catch (err) {
            return res.status(500).json({status:"failure",message: err.message})
        }
    },
    getRequests: async(req, res) => {
        try {
            const dt=new Date(req.params.date);
            console.log(dt);
            const reqs = await requests.find({dateOfEvent:dt});
            res.status(200).json({status:"success",reqs})
        } catch (err) {
            return res.status(500).json({status:"failure",message: err.message})
        }
    },
    getHODPending: async(req,res)=>{
        try{
            
            const HODPending = await requests.find({HODApproval:approvalState.pending,labApproval:approvalState.approved})
            return res.status(200).json({status:"success",HODPending});
        }catch (err) {
            return res.status(500).json({statuts:"failure", message: err.message})
    }
    
},
approveOrDenyHOD: async(req, res) =>{
    const _id=req.params.id;
    const status=req.params.status;
    let message;
    console.log(_id,status,message)
    if(status==1){
        message="approved successfully";
    }else{
        message="denied successfully";
    }
    try {
        // const {title, description,dateOfEvent,startTime,endTime,userId} = req.body;
        // console.log({_id,title, description,dateOfEvent,startTime,endTime,userId})
        const docs= await requests.updateOne({_id: _id},
        {$set:{HODApproval:status}})

        res.status(200).json({status:"success",message});
    } catch (err) {
        return res.status(500).json({status:"failure",message: err.message})
    }
},

getlabPending: async(req,res)=>{
    try{
        const labPending = await requests.find({labApproval:approvalState.pending})
        console.log(labPending);
        res.status(200).json({status:"success",labPending})
    }catch (err) {
        return res.status(500).json({status:"failure",message: err.message})
}

},
approveOrDenyLab: async(req, res) =>{
const _id=req.params.id;
const status=req.params.status;
const user=req.params.userId;
let message;
if(status==1){
    message="approved successfully";
}else{
    message="denied successfully";
}
try {
    // const {title, description,dateOfEvent,startTime,endTime,userId} = req.body;
    // console.log({_id,title, description,dateOfEvent,startTime,endTime,userId})
    if(status==1){

        const docs= await requests.updateOne({_id: _id},
        {$set:{labApproval:status,approvedBy:user}})
        res.status(200).json({status:"success",message});
    }
    else{
        const docs= await requests.updateOne({_id: _id},
            {$set:{labApproval:status,deniedBy:user}})
            res.json({status:"success",message});
    }
} catch (err) {
    return res.status(500).json({status:"failure", message: err.message})
}
},
// denylab: async(req, res) =>{
// const _id=req.params.id;
// try {
//     // const {title, description,dateOfEvent,startTime,endTime,userId} = req.body;
//     // console.log({_id,title, description,dateOfEvent,startTime,endTime,userId})
//     const docs= await requests.updateOne({_id: _id},
//     {$set:{labApproval:approvalState.denied}},{multi:true})
//     res.json({docs});
// } catch (err) {
//     return res.status(500).json({msg: err.message})
// }
// },
getReqsBetweenDates: async(req,res)=>{
    try{
        const start= new Date(req.params.startdate);
        const end = new Date(req.params.enddate);
        // console.log(start,end)
        const reqs = await requests.find({$and:[{dateOfEvent:{"$gte": start}},{dateOfEvent:{"$lte": end}}]})
        // console.log(";abPendnig :",reqs);
        res.status(200).json({status:"success",reqs})
    }catch (err) {
        return res.status(500).json({status:"failure",message: err.message})
}
},
searchRequests: async(req, res) => {
    try {
        const query=req.params.query;
        let searchRegExp= `/${query}/i`;
        console.log(query,searchRegExp)
        const reqs = await requests.find({ $or: [ {title: new RegExp(query, 'i')},{description: new RegExp(query, 'i')} ] } );
        res.status(200).json({status:"success",reqs})
    } catch (err) {
        return res.status(500).json({status:"failure",message: err.message})
    }
},
getAvailability: async(req,res)=>{
    try{
        const date= new Date(req.params.date);
        const venue=req.params.venue;
        console.log("availa:",date)
        let clashingitems=[];
        const reqs = await requests.find({$and:[{dateOfEvent:date},{labName:venue}]});
        console.log(reqs)
            for (let item of reqs) {
                const t1 = {
                    start: item.startTime,
                    end: item.endTime
                };

                const t2 = {
                    start: req.params.starttime,
                    end: req.params.endtime
                };
                console.log(t1,t2);
                if (isTimeOverlap(t1, t2)) {
                    clashingitems.push(item);
                }
        }
        const labs = await lab.find({$and:[{dateOfClass:date},{labName:venue}]});
        console.log(labs)
            for (let item of labs) {
                const t1 = {
                    start: item.startTime,
                    end: item.endTime
                };

                const t2 = {
                    start: req.params.starttime,
                    end: req.params.endtime
                };
                console.log(t1,t2);
                if (isTimeOverlap(t1, t2)) {
                    clashingitems.push(item);
                }
        }
        res.status(200).json({status:"success",clashingitems});
    }catch (err) {
        return res.status(500).json({status:"failure",message: err.message})
}
},
getAvailabilityHOD: async(req,res)=>{
    try{
        const date= new Date(req.params.date);
        const venue=req.params.venue;
        const id=req.params.id;
        console.log(date,venue,req.params.starttime,req.params.endtime)
        let clashingitems=[];
        const reqs = await requests.find({$and:[{dateOfEvent:date},{labName:venue}]});
        console.log(reqs)
            for (let item of reqs) {
                const t1 = {
                    start: item.startTime,
                    end: item.endTime
                };

                const t2 = {
                    start: req.params.starttime,
                    end: req.params.endtime
                };
                console.log(t1,t2);
                if (isTimeOverlap(t1, t2) && item._id!=id) {
                    clashingitems.push(item);
                }
        }
        const labs = await lab.find({$and:[{dateOfClass:date},{labName:venue}]});
        console.log(labs)
            for (let item of labs) {
                const t1 = {
                    start: item.startTime,
                    end: item.endTime
                };

                const t2 = {
                    start: req.params.starttime,
                    end: req.params.endtime
                };
                console.log(t1,t2);
                if (isTimeOverlap(t1, t2)) {
                    clashingitems.push(item);
                }
        }
        res.status(200).json({status:"success",clashingitems});
    }catch (err) {
        return res.status(500).json({status:"failure",message: err.message})
}
}
}

module.exports = requestCtrl