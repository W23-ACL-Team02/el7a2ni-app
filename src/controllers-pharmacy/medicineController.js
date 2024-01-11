const medicineModel = require('../models/medicine.js');
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;
conn.once('open', () => {
    const db = conn.db; // Access the database instance
    var gfs = new mongoose.mongo.GridFSBucket(db); // Initialize GridFSBucket
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

module.exports = {
    addMedicine: async (req, res) => {
        const {name, details, activeIngredients, category, quantity, price, dosage} = req.body;
        var splitIngredients = activeIngredients.split("|")
        var jsonIngredients = "["
        for (let index = 0; index < splitIngredients.length; index++) {
            jsonIngredients += "\"" + splitIngredients[index] + "\","
        }
        jsonIngredients = jsonIngredients.substring(0, jsonIngredients.length - 1) + "]"
        jsonIngredients = JSON.parse(jsonIngredients)
        try {
            const exists = await medicineModel.findOne({name: name})
            if (exists != null){
                res.status(400).send(`${name} is already in the database`);
                return
            }
            const medicine = await medicineModel.create({name, details, category, activeIngredients: jsonIngredients, quantity, sales: 0, price, dosage})
            await medicine.save()
            res.status(200).send(`${name} created successfully!`);
        } catch (error) {
            res.status(400).json({err:error.message});
        }
    },
    editMedicine: async (req, res) => {
        var {id, name, details, category, activeIngredients, quantity, price, dosage} = req.body;
        var splitIngredients = activeIngredients.split("|")
        var jsonIngredients = "["
        for (let index = 0; index < splitIngredients.length; index++) {
            jsonIngredients += "\"" + splitIngredients[index] + "\","
        }
        jsonIngredients = jsonIngredients.substring(0, jsonIngredients.length - 1) + "]"
        activeIngredients = JSON.parse(jsonIngredients)
        try {
            const updatedMedicine = await medicineModel.findOneAndUpdate({_id: id}, {_id: id, name, details, category, activeIngredients, quantity, price, dosage})
            await updatedMedicine.save()
            res.status(200).send(`Updated ${name} successfully`)
        } catch (error) {
            res.status(400).json({err:error.message});
        }
    },
    removeMedicine: async (req, res) => {
        const medicineId = req.body.medicineId;
        
        try {
            //check if name exists
            const exists = await medicineModel.findById(medicineId)
            if (!exists){
                res.status(400).send(`Medicine does not exist`);
                return
            }
            const deletedMedicine = await medicineModel.deleteOne({_id: medicineId})
            res.status(200).json({successes: [`Removed medicine successfully`]})
        } catch (error) {
            res.status(400).json([{errors: error.message}]);
        }
    },
    nukeMedicineDB: async (req, res) => {    
        try {
            const medicine = await medicineModel.deleteMany()
            res.status(200).send(`nuked the model 💣`);
        } catch (error) {
            res.status(400).json({err:error.message});
        }
    },
    findMedicine: async (req, res) => { 
        var searchKey = '';
        if (req.query.searchKey){
            searchKey = req.query.searchKey
        }
    
        try {
            const medicine = await medicineModel.find({"$or": [{name: {"$regex": searchKey, "$options": "i"}}, {activeIngredients: {"$regex": searchKey, "$options": "i"}}]})
            const categories = await medicineModel.find().distinct("category")
            res.status(200).json({medicine, categories})
        } catch (error) {
            res.status(400).json({err:error.message});
        }
    },
    findMedicine2: async (req,res) => {
    
        if(req.session.userType=="admin" ||req.session.userType=="patient" || req.session.userType=="pharmacist"){
    
          try{
            const medicine= await medicineModel.find({});
           // res.status(200).json(medicine);
            res.render('viewmedicine', {medicine:medicine})
          } catch(error){
            res.status(400).send("no medicine");
          }
    
        }
        else{
         res.status(400).send("Unauthorized Access");
        }
    },
    getMedStats: async (req,res)=> {
 
       const medicineID =req.query.medicineId;
       console.log(medicineID)
       if(req.session.userType=="pharmacist"){
            
          try{
    
        const medicine = await medicineModel.findById(medicineID);
        
           //res.status(400).json(medicine);
           console.log(medicine)
           res.status(200).json({medicine});
          } catch(error){
            res.status(400).send("no medicine");
          }
    
       }
        else{
         res.status(400).send("Unauthorized Access");
        }
    },
    viewalternativemedicicne: async (req, res) =>{
        const {medicineId} = req.query
        console.log(medicineId);

  try {
    // Find the initial medicine
    const medicine = await medicineModel.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    // Find medicines with the exact same active ingredients but exclude the medicine with the given ID
    const medResult = await medicineModel.find({
      activeIngredients: { $eq: medicine.activeIngredients },
      _id: { $ne: medicineId }, // Exclude the medicine with the given ID
    });

    res.status(200).json({ medResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
    },
    
    viewMedicine: async (req, res) => {
        const id = new mongoose.Types.ObjectId(req.body.medicineId)
        
        try {
            const medicine = await medicineModel.findOne({_id: id})
    
            var activeIngredients = JSON.stringify(medicine._doc.activeIngredients)
            activeIngredients = activeIngredients.substring(1, activeIngredients.length - 1) //remove []
            activeIngredients = activeIngredients.split(",")
            var activeIngredientsString = ""
            for (let index = 0; index < activeIngredients.length; index++) {
                activeIngredientsString += activeIngredients[index].substring(1, activeIngredients[index].length - 1) + "|"; //remove ""
            }
            activeIngredientsString = activeIngredientsString.substring(0, activeIngredientsString.length - 1) //for the extra | at the end
            medicine._doc.activeIngredients = activeIngredientsString
    
            res.status(200).json({"medicine": medicine})
        } catch (error) {
            res.status(400).json({errors:[error.message]});
        }
    },
    findByIngredient: async (req, res) => {
        const name = req.body.name
        try {
            const medicine = await medicineModel.find({activeIngredients: {name: {$regex: String(name), $options: 'i'}}})
            if (medicine == null){
                res.status(400).send(`Couldn't find ${name}`);
                return
            }
            res.status(200).send(medicine);
        } catch (error) {
            res.status(400).json({err:error.message});
        }
    },
    getsalesreport: async (req, res) =>{
      
        const month = req.query.month;
        
        if (!month || typeof month!== 'string') {
          return res.status(400).json({ error: "Month name is missing or not a valid string in the request body" });
        }
        
    try{

        let monthNumber;
        
        switch (month) {
          case "January":
            monthNumber = 1;
            break;
          case "February":
            monthNumber = 2;
            break;
          case "March":
            monthNumber = 3;
            break;
          case "April":
            monthNumber = 4;
            break;
          case "May":
            monthNumber = 5;
            break;
          case "June":
            monthNumber = 6;
            break;
          case "July":
            monthNumber = 7;
            break;
          case "August":
            monthNumber = 8;
            break;
          case "September":
            monthNumber = 9;
            break;
          case "October":
            monthNumber = 10;
            break;
          case "November":
            monthNumber = 11;
            break;
          case "December":
            monthNumber = 12;
            break;
          default:
            console.log("Invalid month string");
            break;
        }
        if (monthNumber === undefined) {
            return res.status(400).json({ error: "Invalid month string" });
          }
      
          if (monthNumber === undefined) {
            return res.status(400).json({ error: "Invalid month string" });
          }
          
          // Query for sales in the specified month
         
          const startOfMonth = new Date(new Date().getFullYear(), monthNumber - 1, 1);
          const endOfMonth = new Date(new Date().getFullYear(), monthNumber, 0, 23, 59, 59);
          
        
            const medicinesWithSales = await medicineModel.find({
              "salesReport.Date": {
                $gte: startOfMonth,
                $lte: endOfMonth,
              },
            })
          
            if (medicinesWithSales.length === 0) {
              return res.status(404).json({ message: "No sales found for the specified month" });
            }
          
            res.status(200).json({ medicinesWithSales });
          } catch (error) {
          res.status(500).json({ error: error.message });
        }
    

    },
    // Update filterbydate route
filterbydate: async (req, res) => {
    // Extract the dateString from the query parameters
    const dateString = req.query.dateString;
  
    console.log("Received data:", dateString);
  
    try {
      const specificDate = new Date(dateString);
  
      if (isNaN(specificDate) || specificDate.toString() === 'Invalid Date') {
        return res.status(400).json({ error: "Invalid date string" });
      }
  
      // Include the time component in the date range
      const startOfDay = specificDate;
      const endOfDay = new Date(specificDate);
      endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day
  
      const salesReportsOnDate = await medicineModel.find({
        "salesReport.Date": {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
  
      if (salesReportsOnDate.length === 0) {
        return res.status(404).json({ message: "No sales found for the specified date" });
      }
  
      res.status(200).json({ salesReportsOnDate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  
      filtersbymedicine: async (req, res) =>{
        const medname = req.query.medname;
        console.log(medname);
        try{
            const salesReport = await medicineModel.find({ name: medname });
        
         res.status(200).json({ salesReport });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "not found" });
      }},
    getAllMedicine: async (req, res) => { 
        try {
            const medicines = await medicineModel.find();
            res.status(200).json(medicines);
        } catch (error) {
            res.status(400).json({ err: error.message });
        }
    },
    getAllUnarchivedMedicine: async (req, res) => { 
        try {
            const medicines = await medicineModel.find({archived: false});
            res.status(200).json(medicines);
        } catch (error) {
            res.status(400).json({ err: error.message });
        }
    },
    updateSalesReportName: async () => {
        try {
          const medicines = await medicineModel.find();
      
          for (const medicine of medicines) {
            const quantity = medicine.quantity;
            console.log(quantity);
            medicine.incrementSales(quantity);
            
            // Save the updated medicine
            await medicine.save();
          }
      
          console.log('Sales report names updated successfully.');
        } catch (error) {
          console.error('Error updating sales report names:', error);
        }
      },
      
      
    renderAllMedicine: async (req, res) => {
        try {
            const medicine = await medicineModel.find()
            const categories = await medicineModel.find().distinct("category")
            
            res.render("allMedicine", {"medicine": medicine, "categories": categories, userType: req.session.userType})
        } catch (error) {
            res.status(400).json({err:error.message});
        }
    },
    uploadMedImage: async(req,res)=>{
        try{
            if (req.session.userType !== 'pharmacist') {
                return res.status(403).json({ message: 'Permission denied.' });
            }
    
            const {name}=req.body;
            const medicine= await medicineModel.findOne({name:name})
            if(!medicine){
            return res.status(404).json({ message: 'Medicine not found.' });
            }
    
            const medicineImgFile = req.files['medicineImg'] ? req.files['medicineImg'][0] : null;
            if (!medicineImgFile) {
            return res.status(400).json({ message: 'No file uploaded.' });
            }
        
            const savedFile = await saveFileToGridFS(medicineImgFile);
            //medicine.imageUrl = savedFile._id; // Assuming savedFile contains the GridFS file information
            const img64=encodeFileToBase64(medicineImgFile);
                medicine.imageUrl=img64;
            // Save the updated medicine document
            await medicine.save();
        
            res.status(200).json({ message: 'Medicine image uploaded successfully.' });
        } catch(error) {
            res.status(400).json({err:error.message})
        }
    },
    archiveMedicine: async(req,res)=>{
        try{
            if (req.session.userType !== 'pharmacist') {
                return res.status(403).json({ message: 'Permission denied.' });
            }
            const id= req.body.medicineId;
            const medicine= await medicineModel.findById(id);
            const originalstatus= medicine.archived;
            const archivedMedicine = await medicineModel.findOneAndUpdate({_id: id}, {archived: !medicine.archived})
            await archivedMedicine.save()
            if(originalstatus){
                res.status(200).json({ successes: ["medicine unarchived succesfully"] })
            }
            else{
                res.status(200).json({ successes: ["medicine archived succesfully"] })
            }
        } catch(error){
            res.status(400).json({ errors: [error.message] })
        }
    }
}