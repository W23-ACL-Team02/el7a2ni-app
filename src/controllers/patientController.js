const userModel = require('../models/user');
const fileModel = require('../models/file');
const appointmentModel = require('../models/appointment');

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
    }
    
}