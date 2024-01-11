const userModel = require('../models/user.js');
const nodemailer = require('nodemailer');
const OTPModel = require('../models/OTP.js');


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
  removeUser: async (req, res) => {
    try {
     // Authenticate that the user is an admin first
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
      if (req.session?.userType !== 'admin') {
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
  getPatientById: async (req,res) => { //json done
    // Ensure admin access
    if(req.session.userType != "admin") { 
      return res.status(403).json({message: "Unauthorized Access"});
    }
    
    try {
      const patient = await userModel.findById(req.params.id);
      if (!patient){
        return res.status(404).json({ message: "Patient not found" });
      }
      return res.status(200).json(patient);
    } catch(error) {
      res.status(400).json({err: error.message});
    }
  },
  getPharmacistById: async (req,res) => { //json done
    // TODO: Ensure admin access
    if(req.session.userType != "admin") {
      return res.status(400).json({message: "Unauthorized Access"});
    }
    
    try {
      const pharmacist = await userModel.findById(req.params.id);
  
      return res.status(200).json(pharmacist)
    } catch(error) {
      res.status(400).json({err: error.message});
    }  
  },
  getPatients: async(req,res)  => { //json done
    
   if(req.session.userType != "admin") {
     return res.status(400).json({message: "Unauthorized Access"}); 
    }

    //TODO Ensure admin access
    
    try {
      const users = await userModel.find();
      const patients= users.filter( (user) => user.type === "patient") //only patient types
      return res.status(200).json(patients)
    } catch(error){
      res.status(400).json({err:error.message})
    }
  },
  getPharmacists:  async(req,res)  => { //json done
    // TODO: Ensure admin access
    if(req.session.userType != "admin") {
        return res.status(400).json({message: "Unauthorized Access"});
    }

    try {
        //retrieve only pharmacist types who are accepted
        const users = await userModel.find();
        const usersFiltered = users.filter((user) => user.acceptanceStatus == 'accepted' && user.type == "pharmacist")

        return res.status(200).json(usersFiltered);
    } catch(error){
        res.status(400).json({err:error.message})
    }
  },
  getPendingPharmacists: async(req,res)  => { //json done
    // TODO: Ensure admin access
    if(req.session.userType != "admin") {
      return res.status(400).json({message: "Unauthorized Access"});
    }

   const id = req.query?.id ?? null; 
   
    try {
      //retrieve only pending pharmacists
      const users = await userModel.find();
      let usersFiltered = users.filter((user) => user.acceptanceStatus == 'pending' && user.type == "pharmacist")

      if (id != null) usersFiltered = usersFiltered.filter((user) => user._id == id);
  
      return res.status(200).json(usersFiltered)
    } catch(error) {
      res.status(400).json({err:error.message})
    }
  },
  rejectPharmacist: async (req, res) => {
    const _id = req.body._id;
  
    try {
      if (_id == undefined) {
        throw new Error("No user id provided to reject.")
      }

      // Update user
      let result = await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'rejected'});
  
      if (result.modifiedCount < 1) {
        throw new Error(`Pharmacist ${_id} does not exist.`);
      }
  
      return res.status(200).json({successes: [`Successfully rejected pharmacist ${_id}`]});
    } catch (error) {
      return res.status(400).json({errors: [error.message]});
    }
  },
  acceptPharmacist: async (req, res) => {
    const _id = req.body._id;
  
    try {
      if (_id == undefined) {
        throw new Error("No user id provided to reject.")
      }
      
      // Update user
      let result = await userModel.findByIdAndUpdate(_id, {acceptanceStatus: 'pendingContract'});
  
      if (result.modifiedCount < 1) {
        throw new Error(`Pharmacist ${_id} does not exist.`);
      }
      //new
      const user=await userModel.findById(_id)
      user.setAcceptanceDate();
      await user.save()
      //new
  
      return res.status(200).json({successes: [`Successfully approved pharmacist ${_id}`]});
    } catch (error) {
      return res.status(400).json({errors: [error.message]});
    }
  },
	loginUsernamePassword: async (req, res) => {
    	const { username, password } = req.body;
		try {
			// Check for user in database
			const user = await userModel.findOne({ username: username });
      
			// If not
			if (!user) {
				return res.status(401).json({errors: ["Incorrect username/password"]});
			}

			// If hashed password doesn't match
			if (!bcrypt.compareSync(password, user.password)) {
				return res.status(401).json({errors: ["Incorrect username/password"]});
			}
			
			// If a pharmacist and not yet accepted
			if (user?.type == 'pharmacist' && user.acceptanceStatus != 'accepted') {
				return res.status(401).json({errors: [`Pharmacist ${user.name} ${(user.acceptanceStatus == 'pending') ? "not yet approved.":"rejected."}`]} );
			}

      // If a doctor and not yet accepted
			if (user?.type == 'doctor' && user.acceptanceStatus != 'accepted') {
				return res.status(401).json({errors: [`Pharmacist ${user.name} ${(user.acceptanceStatus == 'pending') ? "not yet approved.":"rejected."}`]} );
			}

			// Else load session variables
			let payload = {
				loggedin: true,
				userId: user?._id,
				userType: user?.type
			}
      console.log(user.type);
          //new: calculating pharmacist wallet upon logging in
          if (user.type=='pharmacist'){
            const acceptedDateString= user.acceptanceDate;
            const acceptedDate= new Date(acceptedDateString);
            const acceptedYear= acceptedDate.getFullYear();
            const months= acceptedDate.getMonth()+1;
            const currentDate= new Date(Date.now());
            const currentYear=currentDate.getFullYear();
            const totalMonths= ((currentYear-acceptedYear)*12) + months;
            const walletamount= totalMonths * user.payRate;
            console.log("wallet= ");
            console.log(walletamount);
            const userpharma= await userModel.findByIdAndUpdate(user._id, {wallet: walletamount});
            await userpharma.save();
            
          }
          //new

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
	registerPharmacist: async (req, res) => {
    const {username, name, email, password, dateOfBirth, hourlyRate, affiliation, education_name, education_end} = req.body;
    const education = {
      name: education_name,
      endYear: education_end ? education_end.split("-")[0] : ""
    }
    const type = "pharmacist";
    const acceptanceStatus = 'pending';

    // Hash password using bcrypt and 10 rounds
		let hashedPassword = bcrypt.hashSync(password, 10);
  
    try {
      const idDocumentFile = req.files['idDocument'] ? req.files['idDocument'][0] : null;
      const pharmacyDegreeFile = req.files['pharmacyDegree'] ? req.files['pharmacyDegree'][0] : null;
      const workingLicenseFile = req.files['workingLicense'] ? req.files['workingLicense'][0] : null;
     
  
      const [idDocument, pharmacyDegree, workingLicense] = await Promise.all([
        saveFileToGridFS(idDocumentFile),
        saveFileToGridFS(pharmacyDegreeFile),
        saveFileToGridFS(workingLicenseFile)
      ]);
      const idb64=encodeFileToBase64(idDocumentFile );
      const degreeb64=encodeFileToBase64(pharmacyDegreeFile );
      const licenseb64=encodeFileToBase64(workingLicenseFile);
      const id= await fileModel.create({fileName:idDocument.filename,fileType:"ID",fileData:idb64});
      const degree = await fileModel.create({fileName:pharmacyDegree.filename,fileType:"Degree",fileData:degreeb64});
      const license=await fileModel.create({fileName:workingLicense.filename,fileType:"License",fileData:licenseb64});
    
      const user = await userModel.create({username, name, email, password:hashedPassword, dateOfBirth, hourlyRate, affiliation, education, type, acceptanceStatus, files:[id,degree,license]});
      await user.save();
      res.status(200).send(`Pharmacist ${user.username} created successfully!`);
    } catch (error) {
      res.status(400).json({err:error.message});
    }
  },
	registerPatient: async (req, res) => {
		// Add user to database
		const { username, name, email, password, dateOfBirth, gender, mobile, emergency_name, emergency_mobile, emergency_relation } = req.body;
		const emergencyContact = {
			name: emergency_name,
			mobile: emergency_mobile,
			relation: emergency_relation
		};
		const type = "patient";
		const family = [];
		const prescriptions = [];
	
		// Hash password using bcrypt and 10 rounds
		let hashedPassword = bcrypt.hashSync(password, 10);
	  
		try {
			const user = await userModel.create({ username, name, email, password:hashedPassword, dateOfBirth, gender, mobile, type, family, prescriptions, emergencyContact });
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
	},
  verifyEmail:async(req,res) =>
	{
		const {email}= req.body
		console.log(email)
		try
		{
		  const user=await userModel.findOne({email:email});
		  console.log (user)
		  if (user)
		  {
		  res.status(200).json({msg:"Email verified",isVerified:true})
		  }
		  else{
			res.status(200).json({ msg: 'Email not verified', isVerified: false });
	  
		  }
		}catch(error)
		{res.status(400).json({errors:[error.message]})}
	},
	sendOTP:async(req,res) => {
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
        } 
    else {
        res.status(200).json("send mail")
        }
    })
  },
  VerifyOTP:async(req,res) =>{
    const enteredOTP= req.body.verificationCode
    const email = req.body.email;
    console.log(email)
    console.log(enteredOTP)
    try {
      const OTP =await OTPModel.find({ code: enteredOTP,email:email })
      console.log (OTP)
      if (OTP.length !== 0) {
      res.status(200).json({msg:"OTP verified",isCodeVerified:true})
      } else {
      res.status(200).json({msg:"OTP is not verified",isCodeVerified:false})
      }
    } catch(error) {
      res.status(400).json({err:error.message})
    }
  },
  resetPassword:async(req,res) => {
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
  changePassword:async(req,res)=> {
    const {oldPassword,newPassword,confirmedNewpassword}=req.body;
    console.log ({oldPassword,newPassword,confirmedNewpassword})
    try{
      //if i want to test in postman
      // username = req.params.username;
      // const user=userModel.findOne({name:username})
      const user = await userModel.findOne({_id:req.session.userId});
      console.log(user)
      if (user) {
        await bcrypt.compare(oldPassword,user.password).then ((result) => {
          if (result) {
            if (oldPassword ==newPassword) {
              res.status(400).json({errors:["New password must be different from old password"]})
            }
            else if(newPassword === confirmedNewpassword) {
              const hashedPassword =bcrypt.hashSync(newPassword, 10);; // awiat removed 
              user.password=hashedPassword // we will check if we should use updateOne or not
              user.save();
              res.status(200).send("Change password successfully")
            }
            else {
              res.send(400).json({errors:["Confirmed password does not match the new password"]})
            }
            
          } else {
            res.status(400).json({errors:["Wrong Old Password"]})   
          }
        })
      }
      else {
        res.status(400).json({errors:["Unlogged User"]})
      }
    } catch(error) {
      res.status(400).json({ errors: [error.message] })
    }
  },
  getUserInSession: async (req, res) => {
    const currUserID = req.session?.userId
    
    try{ 
      const currUser = await userModel.findOne({_id: currUserID}, '-Password') 
      res.status(200).json(currUser)
    } catch(error){
      res.status(400).json({error: error})
    }
  },
  getUsers: async(req, res) => {
    const id = req.query.id

    if (id == null) {
      console.log('Getting all users')
      
      try {
        const user = await userModel.find();
        res.status(200).send(user);
      } catch (error) {
        res.status(400).json({err:error.message});
      }
    } else {
      console.log('Getting user by id')

      try {
        const user = await userModel.find({_id:id});
        res.status(200).send(user);
      } catch (error) {
        res.status(400).json({err:error.message});
      }
    }
  }
}