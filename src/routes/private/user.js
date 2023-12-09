var express = require('express');
var router = express.Router({mergeParams: true});

const userModel = require('../../models/user.js');
const appointmentModel = require('../../models/appointment.js');
const { getSelf, logout } = require('../../controllers/userController.js');
const { filterAppointments, allAppointments,upcomingCompAppointments } = require('../../controllers/appointmentController.js');
const { default: mongoose } = require('mongoose');
const multer = require('multer');
var router = express.Router();
const Grid = require('gridfs-stream');
const { MongoClient, ObjectID } = require('mongodb');
const fileModel = require('../../models/file.js');

const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

let gfs;
conn.once('open', () => {
  const db = conn.db; // Access the database instance
  gfs = new mongoose.mongo.GridFSBucket(db); // Initialize GridFSBucket
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const encodeFileToBase64 = (file) => {
  try {
    const base64Data = file.buffer.toString('base64');
    return base64Data;
  } catch (error) {
    throw new Error('Error encoding file to Base64:', error.message);
  }
};
const saveFileToGridFS = async (file) => {
  if (file) {
    const db = conn.db;
    const bucket = new mongoose.mongo.GridFSBucket(db);

    const uploadStream = bucket.openUploadStream(file.originalname);
    uploadStream.end(file.buffer);

    return new Promise((resolve, reject) => {
      uploadStream.on('finish', (file) => {
        resolve(file);
      });

      uploadStream.on('error', (err) => {
        reject(err);
      });
    });
  }
};

const decodeBase64ToFile = (base64String, fileName) => {
  try {
    // Detect the file type from the file name or any other relevant information
    const fileType = fileName.split('.').pop(); // Get the file extension

    // Convert Base64 string to Buffer
    const buffer = Buffer.from(base64String, 'base64');

    // Set appropriate content type based on the file type
    let contentType = '';
    switch (fileType) {
      case 'png':
        contentType = 'image/png';
        break;
      case 'jpeg':
      case 'jpg':
        contentType = 'image/jpeg';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;
      // Add more cases for other file types as needed
      default:
        contentType = 'application/octet-stream'; // Generic binary file type
        break;
    }

    // Return the data URI with appropriate content type
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    throw new Error('Error decoding Base64 to file:', error.message);
  }
};

// Define the route handler for the upcomingCompAppointments function
router.get('/upcomingCompletedAppointments', upcomingCompAppointments);

//outer.get('/upcomingCompletedAppointments', upcomingCompletedAppointments);
router.get('/filterAppointments', filterAppointments);


//for testing
router.get('/allAppointments', allAppointments);

//AddApointment for testing 
router.post('/addAppointment', async (req, res) => {
  const { doctorUsername, patientUsername, date, status } = req.body
  try {
    const appointment = await appointmentModel.create({ doctorUsername, patientUsername, date, status })
    await appointment.save()
    res.status(200).send("Appointment created successfully")
  } catch (error) {
    res.status(400).json({ errors: [error.message] })
  }
})

router.post( '/addDoctor' , async(req,res) => {
  try{
      const doctors =  await userModel.find({username:req.body.username, type:"doctor"})
      if(doctors.length!=0){
          res.status(200).send("doctor already created");
          return;
      }
      const doctor =  await userModel.create(req.body)
      await doctor.save()
      res.status(200).send("doctor created successfully")
  }catch(error){
      res.status(400).json({err:error.message})
  }
})

router.get('/getSelfUser', getSelf);

router.get('/logout', logout);


router.post('/uploadDocuments', upload.fields([
  { name: 'medicalHistory'}]),async (req, res) => {
  //Authenticate 
  try {
      if (req.session.userType !== 'patient') {
       return res.status(403).json({ message: 'Permission denied.' });
      }
      
     //const patient = await userModel.findOne({ username: username });
    
     // const patient = await userModel.findOne({_id:"656b78066ce088ba8dec8b38"});
     const userId = req.session.userId;
      const patient = await userModel.findById(userId)
      if (!patient) {
          return res.status(404).json({ message: 'Patient not found.' });
        }

  const uploadedMedicalHistoryFiles = req.files['medicalHistory'];

  if (!uploadedMedicalHistoryFiles || !uploadedMedicalHistoryFiles.length) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }
    const filesData = uploadedMedicalHistoryFiles.map(file => ({
  
    fileName: file.originalname,
    fileType: "Medical History",
    fileData: encodeFileToBase64(file) // Or any other way you are storing file data
    // Add other file details as needed
  }));

  // Create File documents and save their details
  const createdFiles = await fileModel.create(filesData);

  createdFiles.forEach(file => {
      patient.files.push(file);
    });
    await patient.save();
    console.log(patient.files)
    res.status(200).json({ message: 'Files uploaded and associated with the patient successfully.' });
  }catch (error) {
      res.status(400).json({ err: error.message })
    }
  
})

router.post('/removeDocuments',async(req,res)=>{
  const {fileId } = req.body
  
  const userId = req.session.userId;
  try {
   const user = await userModel.findById(userId);
  // const user = await userModel.findOne({_id:"656b78066ce088ba8dec8b38"});
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  user.files = user.files.filter(file => file._id != fileId);
  await user.save();
    const file=await fileModel.findById(fileId)
    if(!file){
      return res.status(404).json({ message: 'file not found.' });
    }
    await fileModel.findByIdAndRemove(fileId)
    res.status(200).json({ message: 'File removed successfully.'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

})
// router.get('/documents', async (req, res) => {
//   try {
//       const patient = await userModel.findById(req.session.userId)
//     //const patient = await userModel.findOne({_id:"656b78066ce088ba8dec8b38"});
//       var patientFiles = []
//       if (patient.files){
//           patientFiles = patient.files
//           patientFiles.forEach(file => {
//               if (file.fileType == "Mediacl History")
//                   file = fileModel.decodeBase64ToFile(file.fileData,file.fileName)
//           });
//       }
//       res.status(200).json({files: patientFiles})
//   } catch (error) {
//       res.status(400).json({error: error.message})
//   }
// })
router.get('/documents', async (req, res) => {
  try {
    const userId = req.session.userId;
    const patient = await userModel.findById(userId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    // Assuming you want to decode the base64 data here for frontend use
    // const patientFiles = patient.files.map(file => ({
    //   ...file.toObject(),
    //   fileData: fileModel.decodeBase64ToFile(file.fileData, file.fileName)
    // }));
    var patientFiles = []
          if (patient.files){
              patientFiles = patient.files
              patientFiles.forEach(file => {
                  if (file.fileType == "Mediacl History")
                      file = fileModel.decodeBase64ToFile(file.fileData,file.fileName)
              });
            }
   

    res.status(200).json({ userId, files: patientFiles });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});





module.exports = router;