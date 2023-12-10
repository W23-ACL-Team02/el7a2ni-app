const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const maxAge = 3 * 24 * 60 * 60;

var express = require('express');

const { default: mongoose } = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
const { MongoClient, ObjectID } = require('mongodb');

var router = express.Router();

const fileModel = require('../models/file.js');

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





module.exports = {
	getPendingDoctors: async (req, res) => {
		const id = req.query?.id ?? null;
		let query = {acceptanceStatus: 'pending', type:'doctor'};

		// Return all documents of pending doctors   
		if (id !== null) {
			query._id = id;
		}
		
		try {
			const doctors = await userModel.find(query);
			return res.status(200).json(doctors);
		} catch (error) {
			return res.status(400).json({errors: [error.message]})
		}
	},
	rejectDoctor: async (req, res) => {
		const _id = req.body._id;
	
		try {
			if (_id == undefined) {
				throw new Error("No user id provided to reject.")
			}
			
			// Update user
			let result = await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'rejected'});
		
			if (result.modifiedCount < 1) {
				throw new Error(`Doctor ${_id} does not exist.`);
			}
		
			return res.status(200).json({successes: [`Successfully rejected doctor ${_id}`]});
		} catch (error) {
			return res.status(400).json({errors: [error.message]});
		}
	},
	acceptDoctor: async (req, res) => {
		if (_id == undefined) {
			throw new Error("No user id provided to reject.")
		}

		const _id = req.body._id;
	
		try {
			// Update user
			let result = await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'accepted'});
		
			if (result.modifiedCount < 1) {
				throw new Error(`Doctor ${_id} does not exist.`);
			}
		
			return res.status(200).json({successes: [`Successfully approved doctor ${_id}`]});
		} catch (error) {
			return res.status(400).json({errors: [error.message]});
		}
	},
	removeUser: async (req, res) => {
		try {
			//Authenticate that the user is an admin first
			if (req.session.userType !== 'admin') {
				return res.status(403).json({ errors: ['Permission denied. You must be an admin to remove a user.'] });
			}
		
			const { username } = req.body
			const user = await userModel.findOneAndRemove({ username: username });
			if (!user) {
				res.status(404).json({ errors: ['User not found'] });
				return;
			}
			res.status(200).json({ successes: ['User removed successfully'] });
		
		} catch (error) {
			res.status(400).json({ errors: [error.message] })
		}
	},
  	addAdmin: async (req, res) => {
		try {
			if (req.session.userType !== 'admin') {
				return res.status(403).json({ message: 'Permission denied. You must be an admin to add another administrator.' });
			}
		
			const { username, password } = req.body;
			     // Hash password using bcrypt and 10 rounds
		let hashedPassword = bcrypt.hashSync(password, 10);
			const admin = await userModel.create({ username: username, password: hashedPassword, type: "admin" });
			await admin.save();
		
			res.status(200).json({successes: ["Admin added successfully"]});
	
		} catch (error) {
			res.status(400).json({ errors: [error.message] })
		}
  	},
	loginUsernamePassword: async (req, res) => {
    	const { username, password } = req.body;

		try {
			// Check for user in database
			const user = await userModel.findOne({ username: username });

			// If not or wrong user type
			if (!user || user.type == 'pharmacist') {
				return res.status(400).json({errors: ["Incorrect username/password"]});
			}

			// If hashed password doesn't match
			if (!bcrypt.compareSync(password, user.password)) {
				return res.status(400).json({errors: ["Incorrect username/password"]});
			}
			
			// If a doctor and not yet accepted
			if (user?.type == 'doctor' && user.acceptanceStatus != 'accepted') {
				return res.status(400).json({errors: [`Doctor ${user.name} ${(user.acceptanceStatus == 'pending') ? "not yet approved.":"rejected."}`]} );
			}

			// Else load session variables
			let payload = {
				loggedin: true,
				userId: user?._id,
				userType: user?.type
			}

			// const token = jwt.sign(payload, secret, {expiresIn: '1h'});
			const token = jwt.sign(payload, secret);

			req.session = payload;
			res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 , secure: false, domain: "localhost", sameSite: "lax", path: "/"});
			return res.status(200).send(token);
			// return res.status(200).end();
		} catch (error) {
			res.status(400).json({ errors: [error.message] });
		}
	},
	registerDoctor: async (req, res) => {
		const {username, name, email, dateOfBirth, speciality, payRate, affiliation, education_name, education_end} = req.body;
		const education = {
			name: education_name,
			endYear: education_end.split("-")[0]
		}
		const type = "doctor";
		const acceptanceStatus = 'pending';
		const timeSlots=[]
	
		// Hash password using bcrypt and 10 rounds
		let password = bcrypt.hashSync(req.body.password, 10);

		try {

			const idDocumentFile = req.files['idDocument'] ? req.files['idDocument'][0] : null;
			const medicalDegreeFile = req.files['medicalDegree'] ? req.files['medicalDegree'][0] : null;
			const medicalLicenseFile = req.files['medicalLicense'] ? req.files['medicalLicense'][0] : null;
		
			const [idDocument, medicalDegree, medicalLicense] = await Promise.all([
			  saveFileToGridFS(idDocumentFile),
			  saveFileToGridFS(medicalDegreeFile),
			  saveFileToGridFS(medicalLicenseFile)
			]);
			const idb64=encodeFileToBase64(idDocumentFile );
			const degreeb64=encodeFileToBase64(medicalDegreeFile );
			const licenseb64=encodeFileToBase64(medicalLicenseFile);
			const id= await fileModel.create({fileName:idDocument.filename,fileType:"ID",fileData:idb64});
			const degree = await fileModel.create({fileName:medicalDegree.filename,fileType:"Degree",fileData:degreeb64});
			const license=await fileModel.create({fileName:medicalLicense.filename,fileType:"License",fileData:licenseb64});
		
		




			const user = await userModel.create({username, name, email, password, dateOfBirth, speciality, payRate, affiliation, education, type, acceptanceStatus,files:[id,degree,license]});
			await user.save();
		
			res.status(200).send(`Doctor ${user.username} created successfully!`);
		} catch (error) {
			res.status(400).json({ errors: [error.message] });
		}
	},
	registerPatient: async (req, res) => {
		// Add user to database
		let { username, name, email, dateOfBirth, gender, mobile, emergency_name, emergency_mobile, emergency_relation } = req.body;
		const emergencyContact = {
			name: emergency_name,
			mobile: emergency_mobile,
			relation: emergency_relation
		};
		const type = "patient";
		const family = [];
		const prescriptions = [];
		const files=[];
	
		// Hash password using bcrypt and 10 rounds
		const password = bcrypt.hashSync(req.body.password, 10);
	  
		try {
			const user = await userModel.create({ username, name, email, password, dateOfBirth, gender, mobile, type, family, prescriptions, emergencyContact,files });
			await user.save();
		
			res.status(200).send(`Patient ${user.username} created successfully!`);
		} catch (error) {
			res.status(400).json({ errors: [error.message] });
		}
	},
	getSelf: async (req, res) => {
		const userId = req.session?.userId;
	
		if (userId == undefined) {
		  return res.status(401).json({errors: ['No authentication provided.']})
		}
	
		try {
		  let user = await userModel.findById(userId, {password: 0})
		  res.status(200).json(user);
		} catch (error) {
		  res.status(500).json({errors: [error.message]});
		}
	},
	logout: (req, res) => {
		res.clearCookie('jwt');
		return res.status(200).json({successes: ["Successfully logged out"]});
	}
}