const userModel = require('../models/user.js');
const OTPModel = require('../models/OTP.js');
const fileModel = require('../models/file.js');

const multer = require('multer');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const secret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const maxAge = 3 * 24 * 60 * 60;

const { default: mongoose } = require('mongoose');
const mongoURI = process.env.MONGO_URI; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

let gfs;
conn.once('open', () => {
  const db = conn.db; // Access the database instance
  gfs = new mongoose.mongo.GridFSBucket(db); // Initialize GridFSBucket
});

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
		const _id = req.body._id;
		
		try {
			if (_id == undefined) {
				throw new Error("No user id provided to reject.")
			}

			// Update user
			let result = await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'pendingContract'});
		
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
			if (!user) {
				return res.status(400).json({errors: ["Incorrect username/password"]});
			}

			// If hashed password doesn't match
			if (!bcrypt.compareSync(password, user.password)) {
				return res.status(400).json({errors: ["Incorrect username/password"]});
			}
			
			// If a doctor and not yet accepted 
			// changed if condition as we added pendingcontract as new status go to line 198 for refrence
			// now it has to make sure doctor is rejected or pending not just != accepted
			if (user?.type == 'doctor' && (user.acceptanceStatus == 'rejected' || user.acceptanceStatus == 'pending')) {
				return res.status(400).json({errors: [`Doctor ${user.name} ${(user.acceptanceStatus == 'pending') ? "not yet approved.":"rejected."}`]} );
			}
			if (user?.type == 'pharmacist' && (user.acceptanceStatus == 'rejected' || user.acceptanceStatus == 'pending')) {
				return res.status(400).json({errors: [`Pharmacist ${user.name} ${(user.acceptanceStatus == 'pending') ? "not yet approved.":"rejected."}`]} );
			}

			
			// Else load session variables
			let payload = {
				loggedin: true,
				userId: user?._id,
				userType: user?.type
			}
			if (user.type=='pharmacist'){
				const acceptedDateString= user.acceptanceDate;
				const acceptedDate= new Date(acceptedDateString);
				console.log(acceptedDate);
				const acceptedYear= acceptedDate.getFullYear();
				console.log(acceptedYear);
				const months= acceptedDate.getMonth()+1;
				console.log(months);
				const currentDate= new Date(Date.now());
				console.log(currentDate);
				const currentYear=currentDate.getFullYear();
				const totalMonths= ((currentYear-acceptedYear)*12) + months;
				const walletamount= totalMonths * user.payRate;
				console.log("wallet= ");
				console.log(walletamount);
				const userpharma= await userModel.findByIdAndUpdate(user._id, {wallet: walletamount});
				await userpharma.save();
				
			  }
			
			// const token = jwt.sign(payload, secret, {expiresIn: '1h'});
			const token = jwt.sign(payload, secret);
			
			req.session = payload;
			res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 , secure: false, domain: "localhost", sameSite: "lax", path: "/"});
			
			// If a doctor and HAS NOT accepted the employment contract
			// The first Time the doctor logs in after being accepted and he has to accept the employment contract
			if (user?.type == 'doctor' && user.acceptanceStatus == 'pendingcontract') {
				return res.status(200).json({pendingContract:'pendingcontract'});
			}
			return res.status(200).send(user);
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
			const id= await fileModel.File.create({fileName:idDocument.filename,fileType:"ID",fileData:idb64});
			const degree = await fileModel.File.create({fileName:medicalDegree.filename,fileType:"Degree",fileData:degreeb64});
			const license=await fileModel.File.create({fileName:medicalLicense.filename,fileType:"License",fileData:licenseb64});
		
		




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
		//const userId = '6574c7bbe1e7e13216fa2146';
		
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
	},
	verifyEmail: async (req,res) => {
		const {email}= req.body

		try
		{
		  const user = await userModel.findOne({email:email});
		  
		  if (user) {
		  res.status(200).json({msg:"Email verified",isVerified:true})
		  } else {
			res.status(200).json({ msg: 'Email not verified', isVerified: false });
		  }
		} catch(error) {
			res.status(400).json({errors:[error.message]})
		}
	},
	sendOTP: async (req,res) => {
		const email= req.body.email
		var code = Math.floor(Math.random()*90000) + 10000;

		try {
			await OTPModel.deleteMany({ email: email });
			const OTP = await OTPModel.create({code:code,email:email})
		} catch(error) {
			res.status(400).json({err:error.message})
		}
	 
		const mailTransporter = nodemailer.createTransport({
		  // host: "smtp.mailtrap.io",
		  // port: 2525,
		 
			service: 'gmail',
			auth: {
			   user: 'ahmedyousry2002@gmail.com',
		 
			   pass: 'dpan zepx knqd mdai'
		 
			}
		});
		 
		const mailDetails = {
		 
		   from: 'ahmedyousry2002@gmail.com',
		 
		   to: email,
		 
		   subject: 'Change password',
		  
		   html: '<p> Change Password requires further verification <br> your Verification code:'+code+'<p> <br> <br> Thanks, <br> El7a2ny Clinic & pharmacy'
		 
		};

		mailTransporter.sendMail(mailDetails, function(err, data) {
			if(err) {
				res.status(400).json({errors:err.message})
			} else {
				res.status(200).json("send mail")
			}
		})
	},
	VerifyOTP: async (req,res) => {
		const enteredOTP= req.body.verificationCode
		const email = req.body.email;
		console.log(email)
		console.log(enteredOTP)
		try {
			const OTP =await OTPModel.find({ code: enteredOTP,email:email })
			console.log (OTP)
			if (OTP.length !== 0)
			{
			res.status(200).json({msg:"OTP verified",isCodeVerified:true})
			}
			else
			{
			res.status(200).json({msg:"OTP is not verified",isCodeVerified:false})
			}
		
		} catch(error) {
			res.status(400).json({err:error.message})
		}
	},
	resetPassword: async (req,res) => {
		try {
			const email= req.body.email;
			const newPassword=req.body.newPassword;
			const user = await userModel.findOne({email:email});
			const result = await bcrypt.compare(newPassword, user.password);
     
			if (result) {
			  res.status(400).json({ errors: ["Attention the new password should not be the same as the old password"] });
			} else {
			  const hashedPassword = bcrypt.hashSync(newPassword, 10);
			  user.password = hashedPassword;
			  await user.save();
			  res.status(200).send("Change password successfully");
			}
			
			

		} catch(error) {
			res.status(400).json({err:error.message})
		}
	},
	changePassword: async(req,res)=>{
		const {oldPassword,newPassword,confirmedNewpassword} = req.body;
		
		try {
			//if i want to test in postman
			// username = req.params.username;
			// const user=userModel.findOne({name:username})
			
			const user = await userModel.findOne({_id:req.session.userId});
			if (user) {
				await bcrypt.compare(oldPassword,user.password).then ((result) => {
					if (result) {
						if (oldPassword ==newPassword) {
							res.status(400).json({errors:["New password must be different from old password"]})
						} else if(newPassword === confirmedNewpassword) {
							const hashedPassword =bcrypt.hashSync(newPassword, 10);; // awiat removed 
							user.password=hashedPassword // we will check if we should use updateOne or not
							user.save();
							res.status(200).send("Change password successfully")
						} else {
							res.send(400).json({errors:["Confirmed password does not match the new password"]})
						}
					} else {
						res.status(400).json({errors:["Wrong Old Password"]})   
					}
				})
			} else {
				res.status(400).json({errors:["Unlogged User"]})
			}
		} catch(error) {
		  res.status(400).json({ errors: [error.message] })
		}
	},
	uploadDocument: async (req, res) => {
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
		const createdFiles = await fileModel.File.create(filesData);
		if (patient.files == undefined) patient.files = [];
	  
		createdFiles.forEach(file => {
			patient.files.push(file);
		  });
		  await patient.save();
		  
		  res.status(200).json({ message: 'Files uploaded and associated with the patient successfully.' });
		} catch (error) {
			res.status(400).json({ err: error.message })
		}	
	},
	removeDocument: async(req,res)=>{
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
			const file = await fileModel.File.findById(fileId);
			if(!file){
			  return res.status(404).json({ message: 'file not found.' });
			}
			await fileModel.findByIdAndRemove(fileId)
			res.status(200).json({ message: 'File removed successfully.'});
		} catch (error) {
		  res.status(500).json({ error: error.message });
		}
	},
	getDocuments: async (req, res) => {
		try {
			const userId = req.session.userId;
			const patient = await userModel.findById(userId);
		
			if (!patient) {
				return res.status(404).json({ error: 'Patient not found.' });
			}
		
			// Decode the base64 data here for frontend use
			// const patientFiles = patient.files.map(file => ({
			//   ...file.toObject(),
			//   fileData: fileModel.decodeBase64ToFile(file.fileData, file.fileName)
			// }));
			var patientFiles = []
			if (patient.files) {
				patientFiles = patient.files
				patientFiles.forEach(file => {
					if (file.fileType == "Medical History")
						file = fileModel.decodeBase64ToFile(file.fileData,file.fileName)
				});
			}

			res.status(200).json({ userId, files: patientFiles });
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}
}