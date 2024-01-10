const userModel = require('../models/user');
const fileModel = require('../models/file');
const appointmentModel = require(`../models/appointment`);
const healthPackageModel = require('../models/healthPackage');
const prescriptionModel = require("../models/prescription.js");
const familymemberSchema = require("../models/familymembers.js");

module.exports = {

    getHealthPackages: async (req, res) => {        
        try {
            const healthPackages = await healthPackageModel.find();
            return res.status(200).json({healthPackages});
        } catch (error) {
            return res.status(400).json({errors: [error.message]});
        }
    },

    uploadHealthRecordForTesting: async (req, res) => {
        try {
            const patient = await userModel.findById(req.session.userId)
            const healthRecordDocument = req.file ? req.file : null;
            const b64 = fileModel.encodeFileToBase64(healthRecordDocument)
            const file = await fileModel.File.create({fileName: healthRecordDocument.originalname, fileType: "healthRecord", fileData: b64})
            const files = patient.files ? patient.files : []
            files.push(file)
            await patient.updateOne({files: files})
            return res.status(200).json({successes: [`Successfully uploaded ${healthRecordDocument.originalname}.`]});
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    },

    viewMyHealthRecords: async (req, res) => {
        try {
            const patient = await userModel.findById(req.session.userId)
            var patientFiles = []
            if (patient.files){
                patientFiles = patient.files
                patientFiles.forEach(file => {
                    if (file.fileType == "healthRecord")
                        file = fileModel.decodeBase64ToFile(file.fileData)
                });
            }
            res.status(200).json({files: patientFiles})
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    },

    subscribeToHealthPackage: async (req, res) => {
        try{
            const packageId = req.body.packageId;
            const patientId = req.session.userId;
            // const patientId = '6547b96606043724533eedbf'
            const patient = await userModel.findById(patientId);

            // TODO: add package to specified family members 

            if (patient.healthPackage?.status !== "Unsubscribed"){
                res.status(400).json({errors: ["Already subscribed"]})
                return
            }
            const startDate = new Date()
            const endDate = new Date()
            endDate.setDate(endDate.getDate() + 30)

            const package = {
                packageId: packageId,
                startDate: startDate,
                includedFamilyMembers: [],
                status: `Subscribed`,
                endDate: endDate
            }

            await patient.updateOne({healthPackage: package});
            await patient.save();

            res.status(200).json(package)
        } catch (error) {
        res.status(400).json({errors: [error.message]})
      }
    },
    subscribeForFamilyMember: async (req, res) => {
        const patientId = req.session.userId;
        const memberId = req.body.memberId;
        const memberType = req.body.memberType;
        const packageId = req.body.packageId;

        try{

            var memberBelongsToUser = false;
            const patient = await userModel.findById(patientId)
            if(memberType == 'linked'){
                patient.family.linked.map((member) => {
                    if (member.id == memberId){
                        memberBelongsToUser = true;
                    }
                })
                if (!memberBelongsToUser){
                    res.status(400).json({errors: ["This family member doesn't belong to you"]})
                    return
                }

                const member = await userModel.findById({_id: memberId});

                if (member.healthPackage?.status !== "Unsubscribed"){
                    res.status(400).json({errors: ["Already subscribed"]})
                    return
                }
                const startDate = new Date()
                const endDate = new Date()
                endDate.setDate(endDate.getDate() + 30)
    
                const package = {
                    packageId: packageId,
                    startDate: startDate,
                    status: `Subscribed through family member`,
                    endDate: endDate
                }
    
                await member.updateOne({healthPackage: package});
                await member.save();
                res.status(200).json({healthPackage: package})
            }

            else if (memberType == 'created'){
                patient.family.created.map((member) => {
                    if (member.id == memberId){
                        memberBelongsToUser = true;
                    }
                })
                if (!memberBelongsToUser){
                    res.status(400).json({errors: ["This family member doesn't belong to you"]})
                    return
                }

                const member = await familymemberSchema.findById({_id: memberId});

                if (member.healthPackage?.status !== "Unsubscribed"){
                    res.status(400).json({errors: ["Already subscribed"]})
                    return
                }
                const startDate = new Date()
                const endDate = new Date()
                endDate.setDate(endDate.getDate() + 30)
    
                const package = {
                    packageId: packageId,
                    startDate: startDate,
                    status: `Subscribed through family member`,
                    endDate: endDate
                }
    
                await member.updateOne({healthPackage: package});
                await member.save();
                res.status(200).json({healthPackage: package})
        }

            
        } catch (error){
            res.status(400).json({errors: [error.message]})
        }
    },
    viewSubscriptionDetails: async (req, res) => {
        const patientId = req.session.userId;

        try{

            const patient = await userModel.findById(patientId)
            const package = await healthPackageModel.findById(patient.healthPackage?.packageId)
            res.status(200).json({package: package, subscription: patient.healthPackage})
            
        } catch (error){
            res.status(400).json({errors: [error.message]})
        }
    },
    cancelSubscription: async (req, res) => {
        const patientId = req.session.userId;

        try{

            const patient = await userModel.findById(patientId)
            if (!patient.healthPackage || patient.healthPackage.status == "Unsubscribed"){
                res.status(400).json({errors: ["No active subscription to cancel"]})
                return
            }
            const package = patient.healthPackage
            package.status = "Unsubscribed"
            await patient.updateOne({_id: patientId}, {healthPackage: package})
            //await patient.save()

            res.status(200).json({subscription: patient.healthPackage})
            
        } catch (error){
            res.status(400).json({errors: [error.message]})
        }
    },
    cancelSubscriptionForFamilyMember: async (req, res) => {
        const patientId = req.session.userId;
        const memberId = req.body.memberId;
        const memberType = req.body.memberType;

        try{

            var memberBelongsToUser = false;
            const patient = await userModel.findById(patientId)
            if(memberType == 'linked'){
                patient.family.linked.map((member) => {
                    if (member.id == memberId){
                        memberBelongsToUser = true;
                    }
                })
                if (!memberBelongsToUser){
                    res.status(400).json({errors: ["This family member doesn't belong to you"]})
                    return
                }

                const member = await userModel.findById({_id: memberId});

                if (!member.healthPackage || member.healthPackage.status == "Unsubscribed"){
                    res.status(400).json({errors: ["No active subscription to cancel"]})
                    return
                }
                const package = member.healthPackage
                package.status = "Unsubscribed"
                await member.updateOne({_id: memberId}, {healthPackage: package})
                await member.save()
                res.status(200).json({subscription: member.healthPackage})
            }

            else if (memberType == 'created'){
                patient.family.created.map((member) => {
                    if (member.id == memberId){
                        memberBelongsToUser = true;
                    }
                })
                if (!memberBelongsToUser){
                    res.status(400).json({errors: ["This family member doesn't belong to you"]})
                    return
                }

                const member = await familymemberSchema.findById({_id: memberId});

                if (!member.healthPackage || member.healthPackage.status == "Unsubscribed"){
                    res.status(400).json({errors: ["No active subscription to cancel"]})
                    return
                }
                const package = member.healthPackage
                package.status = "Unsubscribed"
                await member.updateOne({_id: memberId}, {healthPackage: package})
                await member.save()
                res.status(200).json({subscription: member.healthPackage})
        }

            
        } catch (error){
            res.status(400).json({errors: [error.message]})
        }
    },
    upgradeSubscription: async (req, res) => {
        const patientId = req.session.userId;
        const newPackageId = req.body.packageId;

        try{

            const patient = await userModel.findById(patientId)
            if (!patient.healthPackage || patient.healthPackage.status == "Cancelled"){
                res.status(400).json({errors: ["No active subscription to upgrade"]})
                return
            }
            if (patient.healthPackage.status == "Subscribed through family member"){
                res.status(400).json({errors: ["Cannot upgrade for yourself"]})
                return
            }

            // TODO: check if new package is a higher tier one

            const package = patient.healthPackage
            package.upgrade = newPackageId
            await patient.updateOne({_id: patientId}, {healthPackage: package})
            await patient.save()

            res.status(200).json({subscription: patient.healthPackage})
            
        } catch (error){
            res.status(400).json({errors: [error.message]})
        }
    },
    renewSubscription: async (req, res) => {
        const patientId = req.session.userId;

        // TODO: make sure next subscription payment is collected somehow

        try{
            const patient = await userModel.findById(patientId)
            if (!patient.healthPackage || patient.healthPackage.status == "Cancelled"){
                res.status(400).json({errors: ["No active subscription to upgrade"]})
                return
            }
            if (patient.healthPackage.status == "Subscribed through family member"){
                res.status(400).json({errors: ["Cannot renew for yourself"]})
                return
            }
            const package = patient.healthPackage
            const oldEndDate = package.endDate
            const newEndDate = oldEndDate
            newEndDate.setDate(newEndDate.getDate() + 30) //adding 30 days to endDate
            package.endDate = newEndDate
            //checking for upgrade
            if (!package.upgrade){
                package.packageId = package.upgrade
                package.upgrade = undefined
            }
            
            await patient.updateOne({healthPackage: package})
            await patient.save()

            res.status(200).json({subscription: patient.healthPackage})
            
        } catch (error){
            res.status(400).json({errors: [error.message]})
        }
    } 
}