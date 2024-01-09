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
        const {name, details, activeIngredients, category, quantity, price} = req.body;
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
            const medicine = await medicineModel.create({name, details, category, activeIngredients: jsonIngredients, quantity, sales: 0, price})
            await medicine.save()
            res.status(200).send(`${name} created successfully!`);
        } catch (error) {
            res.status(400).json({err:error.message});
        }
    },
    editMedicine: async (req, res) => {
        var {id, name, details, category, activeIngredients, quantity, price} = req.body;
        var splitIngredients = activeIngredients.split("|")
        var jsonIngredients = "["
        for (let index = 0; index < splitIngredients.length; index++) {
            jsonIngredients += "\"" + splitIngredients[index] + "\","
        }
        jsonIngredients = jsonIngredients.substring(0, jsonIngredients.length - 1) + "]"
        activeIngredients = JSON.parse(jsonIngredients)
        try {
            const updatedMedicine = await medicineModel.findOneAndUpdate({_id: id}, {_id: id, name, details, category, activeIngredients, quantity, price})
            await updatedMedicine.save()
            res.status(200).send(`Updated ${name} successfully`)
        } catch (error) {
            res.status(400).json({err:error.message});
        }
    },
    deleteMedicine: async (req, res) => {
        const name = req.body.name;
        
        try {
            //check if name exists
            const exists = await medicineModel.find({name: name})
            if (exists == null){
                res.status(400).send(`${name} is not in the database`);
                return
            }
            
            const deletedMedicine = await medicineModel.deleteOne({name: name})
            res.status(200).send(`Deleted ${name} successfully`)
        } catch (error) {
            res.status(400).json({err:error.message});
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
        if (req.query.search){
            searchKey = req.query.search
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
 
        if(req.session.userType=="pharmacist"){
            
          try{
            const medicine= await medicineModel.find({});
           //res.status(400).json(medicine);
           //console.log(medicine)
           res.render('getmedstats', {medicine:medicine})
          } catch(error){
            res.status(400).send("no medicine");
          }
    
        }
        else{
         res.status(400).send("Unauthorized Access");
        }
    },
    viewMedicine: async (req, res) => {
        const id = new mongoose.Types.ObjectId(req.query.id)
        
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
    
            res.render("editMedicine", {"medicine": medicine})
        } catch (error) {
            res.status(400).json({err:error.message});
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