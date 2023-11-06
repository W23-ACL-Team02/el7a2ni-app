var express = require('express');
const userModel = require('../models/user.js');
const appointmentsModel = require('../models/appointment.js');
const healthPackageModel = require(`../models/healthPackage.js`)
var router = express.Router();
const axios = require('axios');

const apiURL = 'http://localhost:3000/doctors/api';

//UI
router.get('/', function(req, res, next) {
    // Redirect back to home
    res.redirect('/');
});

router.get('/updateInfo', (req, res) => {
    const userId = req.session.userId;
    return res.render('doctorUpdateInfo', {userId});
})

router.post('/updateInfo', async(req, res) => {
    try {
        if (req.body.userId != req.session.userId) {
            throw new Error("Error authenticating user.")
        }

        const response = await axios.put(apiURL + "/editDoctor", req.body);

        // console.log(response)
        return res.status(200).send(`Updated`);
    } catch (error) {
        return res.status(400).json({err: error.message})
    }
})

router.get('/viewDoctors', async (req, res) => {
    //37
    //As a **patient I should be able to view a list of all doctors along with their specialty, 
    //session price (based on subscribed health package if any).**
    //Session price is calculated as ( doctor’s rate + 10% clinic's markup  - some discount  (Based on patient's health package if any))
     if (req.session.userType != 'patient') {
        return res.status(400).send("Only patients can access this.")
     }

    try {
        let discountRate = 0;       
        let docs = await userModel.find({type:'doctor',acceptanceStatus:'accepted'})
        let user = await userModel.findById(req.session.userId);
        if (user?.healthPackage != undefined) {
            let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
            discountRate = userHealthPackage.discountSession;
        }
        res.render('patientDoctor', {docs, discountRate});
    } catch(error) {
        res.status(400).json({err:error.message})
    }

});

router.post('/searchDoctors', async (req, res) => {
    //38,39
    //search for a doctor by name and/or speciality and/or availability on a certain date and at a specific time
    
    if (req.session.userType != 'patient') {
        return res.status(400).send("Only patients can access this.")
    }

    let docname = req.body.docname
    let docSpeciality = req.body.speciality
    let theDate = req.body.date + ":00.000Z"
    if(docname=="")
        docname = "All"
    // if(theDate=="" || theTime==""){
    //     console.log("empyty date")
    // }
    // console.log(docname)
    // console.log(docSpeciality)
    // console.log(theDate)
    // console.log(theTime)
    let docs = []
    try{
        //first we get the possible queries without considering date and time (just filtering doctors name and/or speciality)
        if(docSpeciality=="All" && docname=="All") {
            // all doctors
            docs = await userModel.find({type:'doctor',acceptanceStatus:'accepted'})
        } 
        else if(docSpeciality=="All" && docname!="All") {
            // all doctors with this name
            docs = await userModel.find({name:docname,type:'doctor',acceptanceStatus:'accepted'})
        }
        else if(docSpeciality!="All" && docname=="All") {
            // all doctors with this speciality
            docs = await userModel.find({type:'doctor',speciality:docSpeciality,acceptanceStatus:'accepted'})
        }
        else if(docSpeciality!="All" && docname!="All") {
            // all doctors with this speciality with this name
            docs = await userModel.find({name:docname,type:'doctor',speciality:docSpeciality,acceptanceStatus:'accepted'})
        } 

        
        // if the patient asks for a specific date and time for a doctor to be available
        if(docs!=[] && theDate!=":00.000Z"){
            console.log(theDate)
            theDate = new Date(theDate)
            // const dateNtime = new Date(theDate);
            // console.log(dateNtime)
            const docsWithAppts = await appointmentsModel.find({start:{$lte:theDate}, end:{$gte:theDate}})
            for (let i = 0; i < docsWithAppts.length; i++){
                const docsUsername = docsWithAppts[i].doctorUsername;
                docs = docs.filter((user) => user.username != docsUsername);
            }
        }
        
        let discountRate = 0;
        let user = await userModel.findById(req.session.userId);
        if (user?.healthPackage != undefined) {
            let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
            discountRate = userHealthPackage.discountSession;
        }
        res.render('patientDoctor', {docs,discountRate});

        // if(docs==[])
        //     return "no doctors found matching this search"
    }catch(error){
        res.status(400).json({err:error.message})
    }
    
});

router.get('/viewDoctorDetails/:id', async (req, res) => {
    //40,41
    //select a doctor from the search/filter results
    //view all details of selected doctor including specilaty, affiliation (hospital), educational background

    if (req.session.userType != 'patient') {
        return res.status(400).send("Only patients can access this.")
    }
    const doctor = await userModel.findOne({_id:req.params.id})
    let discountRate = 0;
    let user = await userModel.findById(req.session.userId);
    if (user?.healthPackage != undefined) {
        let userHealthPackage = await healthPackageModel.findById(user?.healthPackage);
        discountRate = userHealthPackage.discountSession;
    }
    res.render('viewOneDoctor', {doctor,discountRate});
});

//API
const editDoctor = async (req, res) => {
    const {userId, email, payRate, affiliation} = req.body;

    try {
        let updateResponse = await userModel.updateOne({_id: userId}, {email: email || undefined, payRate: payRate || undefined, affiliation: affiliation || undefined})
        
        if (updateResponse.matchedCount < 1) {
            throw new Error(`No document found with id: ${userId}`);
        } else if (updateResponse.modifiedCount < 1) {
            throw new Error(`Document not modified.`);
        }

        return res.status(200).send("Updated doctor");
    } catch (error) {
        return res.status(400).json({err: error.message});
    }
}

router.put('/api/editDoctor', editDoctor)

module.exports= router;var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    // Redirect back to home
    res.redirect('/');
});

module.exports= router;