const cartModel = require('../models/cartItem');
const userModel = require('../models/user');
const medicineModel = require('../models/medicine');
const prescriptionModel = require('../models/prescription');

module.exports = {
    addToCart: async (req, res) => {
        const {quantity, medicineId} = req.body;
      //  const {medID}=req.body.medID;

        try {
            const userId = req.session.userId;
            const user = await userModel.findOne({ _id: userId });
            console.log(medicineId)
            let medicinef = await medicineModel.findOne({ _id: medicineId });
          //  console.log(medicinef)
            if (medicinef==null){
               console.log(2);
            }
            const medicine = await medicineModel.findById(medicinef._id)
            //const user= await userModel.findOne({_id:"6573e1bab6a517c2e59f02da"})
            console.log(quantity);
            if (user == null) {
                throw new Error("User not found. Maybe Session timed out.")
            }
            console.log(1);
            if(medicine.isprescription){
           //check if the medcine exists in the pstient prescriptions 
           console.log(1);
          // const prescribtion = await prescribtionModel.findOne({patient.name:user.name},medications[0].equals(medicine.name));
           const prescription = await prescriptionModel.findOne({
            'patient.name': user.name,
            'medications.name': medicine.name
          });
            //const prescribtion = await prescribtionModel.findOne(patient.name.equals( user.name),medications[0].equals(medicine.name));
            console.log(1);
            if(prescription== null){
                throw new Error("this medecine need prescription") 

            }
           
        }  
            const cart = user.cart;
            const cartItemIndex = cart.findIndex(item => item.medicine._id == medicineId);

           

         
          
            if (quantity > medicine.quantity){
                return res.status(500).json({ error: "the pharmacy does not have all this quantity" });
            }
            
          
            if (cartItemIndex !== -1) {
                // If the medicine is in the cart, update the quantity
                console.log("Old quantity:", user.cart[cartItemIndex].quantity);
                
                // Update the quantity using $set
                console.log(cart[0].medicine._id)
                if (quantity+user.cart[cartItemIndex].quantity>medicine.quantity){
                    return res.status(500).json({ error: "the pharmacy does not have all this quantity" });
                }
                await userModel.updateOne(
                    { _id: userId, 'cart.medicine._id':medicine._id},
                    { $set: { 'cart.$.quantity': user.cart[cartItemIndex].quantity + quantity } }
                );
            
              //  user = await userModel.findOne({ _id: userId });
    
                console.log("Updated quantity:", user.cart[cartItemIndex].quantity);
            } else {
                // If the medicine is not in the cart, add it with the specified quantity
                console.log("m")
                let medicinef = await medicineModel.findOne({ _id: medicineId });
                const medicine = await medicineModel.findById(medicinef._id)
                console.log("here")
                const cartItem = await cartModel.create({ medicine: medicine, quantity: quantity });
                await cartItem.save();
                console.log("m")
                console.log(quantity);
                user.additemTocart(cartItem);
                await user.save();
                console.log("m")
               
                
            }
    
            // Save the updated user document with the new or updated cart
            
           // await user.save();
            
            res.status(200).json({ message: 'Item added/updated in the cart successfully', user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteFromCart: async (req,res) => {
        const { medicineId, quantity } = req.body;
        const userId = req.session.userId;
        try {
            let user = await userModel.findOne({_id: userId});
           
            let medicinef = await medicineModel.findOne({ _id: medicineId });
            const medicine = await medicineModel.findById(medicinef._id)
            const cart= user.cart;
            const cartItemIndex = cart.findIndex(item => item.medicine._id==medicineId);
            console.log("item added")

            if (user == null) {
              throw new Error("User not found. Maybe Session timed out.")
            }

            console.log(user.cart[cartItemIndex].quantity)
            if (quantity == user.cart[cartItemIndex].quantity){
                console.log("item deteted")
                user.cart = user.cart.filter(item => item.medicine._id!=medicineId);
                await user.save();
               console.log("item deteted")
    
            } else {
                console.log("item added3")
                if ( user.cart[cartItemIndex].quantity - quantity >0){
                await userModel.updateOne(
                    { _id: userId, 'cart.medicine._id': medicine._id },
                    { $set: { 'cart.$.quantity':  user.cart[cartItemIndex].quantity - quantity} });
                } 
                else {
                    throw new Error ("item not in cart")
                }      
            }
            
            await user.save()
            let medicine2 = await medicineModel.findOne({_id: medicineId});
            const medicinename = medicine2.name
            res.status(200).send(`Deleted ${medicinename} successfully`)
        } catch (error) {
            res.status(400).json({err:error.message});
        }
    },
    viewCart: async (req,res) => {
       const userId = req.session.userId;       
        try {
            let user = await userModel.findOne({_id: userId});
            
            if (user == null) {
                throw new Error("User not found. Maybe Session timed out.")
            }
            
            const cart = user.viewcartt();
            
            return res.status(200).json(cart);
        } catch(error) {
            res.status(400).json({err:error.message})
        }
    },
    getCart: async(req, res) => {
        const userId= req.session.userId; 
        
        try{
          const user= await userModel.findById(userId);
          const userCart = user.cart;
          const items = await cartModel.find({ _id : { $in: userCart }});
          console.log(items)
          res.status(200).json(items)
        }catch(error){
          res.status(400).json(error)
        }  
    },
    editCartQuantity: async (req, res) => {
        const {medicineId, quantity } = req.body;
        try {
            const userId = req.session.userId;
            let user = await userModel.findOne({ _id: userId });
            let medicinef = await medicineModel.findOne({ _id: medicineId });
            const medicine = await medicineModel.findById(medicinef._id)

            if (user == null) {
                // throw new Error("User not found. Maybe Session timed out.")
                return res.redirect('/login');
            }

            if (quantity > medicine.quantity){
                return res.status(500).json({ error: "the pharmacy does not have all this quantity" });
        
            }

            const cart = user.cart;
            const cartItemIndex = cart.findIndex(item => item.medicine._id == medicineId);
            
            await userModel.updateOne(
                { _id: userId, 'cart.medicine._id': medicine._id },
                { $set: { 'cart.$.quantity':  quantity } });
                
            user.save()
            user = await userModel.findOne({ _id: userId });

            res.status(200).json({ message: 'Item added/updated in the cart successfully', user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}