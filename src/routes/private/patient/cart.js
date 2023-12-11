var express = require('express');
const cartModel = require('../../../models/cartItem');
const userModel= require('../../../models/user')
const medicineModel= require('../../../models/medicine')
const { default: mongoose } = require('mongoose');
//const app = require('../../../app.js');
var router = express.Router();
// use cartitem instead of cart 
//  router.post('/addtocart', async (req, res) => {

//   try {
//     const { medicineId, quantity } = req.body;
//    // const userId = req.user.id; // Assuming you have user information in the request (e.g., from authentication middleware)
//     const userId = "6542a7c335360dcbe722c2d8";
//     // Check if the user has a cart
//     const user= await userModel.find({_id: userId})
//     const cart= user.cart; //TODO: initialize empty cart when registering
//     const medicine= await medicineModel.find({_id: medicineId});

//   //  let cart = await cartModel.find({ user: userId });

//     // If the user doesn't have a cart, create one
//     // if (!cart) {
//     //   cart = await cartModel.create({ user: userId, items: [] });
//     // }

//     // Check if the medicine is already in the cart

//     const cartItemIndex = cart.items.findIndex(item => item.medicine._id.equals(medicineId));

//     // If the medicine is in the cart, update the quantity
//     if (cartItemIndex !== -1) {
//       cart.items[cartItemIndex].quantity = quantity;
//     } else {
//       // If the medicine is not in the cart, add it with the specified quantity

//       cart.items.push({ medicine, quantity });
//     }

//     // Save the updated cart
//     await cart.save();

//     res.status(200).json({ message: 'Cart updated successfully', cart });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// router.post('/addtocart', async (req,res) => {
//     // if(req.session.userType=="patient"){

    
//     const { medicineId, quantity } = req.body;
  
//     try {
     
      
//       //const userId = req.session.userId;
//       const userId = "653ff500744b325be57b158c";
//       let user = await userModel.findOne({_id: userId});
      
//       if (user == null) {
//         // throw new Error("User not found. Maybe Session timed out.")
//         return res.redirect('/login')
//       }
//       console.log("before")
//       const cart= user.cart;
//       console.log("cart");
//       const cartItemIndex = cart.findIndex(item => item.medicineId==medicineId);
//       console.log("cart 2")
//           if (cartItemIndex !== -1) {
//       cart[cartItemIndex].quantity = cart[cartItemIndex].quantity+quantity;
//     } else {
//         console.log("else")
//       //  const medicine= await medicineModel.find({_id: medicineId})
//       // If the medicine is not in the cart, add it with the specified quantity
//       console.log("creating medicine")
//       const cartItem =  await cartModel.create({ medicineId, quantity});
//       console.log("item created")
//       user.additemTocart(cartItem);
//       console.log("item added")
//      // await medicine.save()
//       await cartItem.save()
//     }
     
     
//     //  user.additemTocart(cartItem);s
    
   
//       await user.save()
//       console.log("user saved")

//       res.status(200).send("add item to cart Successfully")
//     } catch(error) {
//       res.status(400).json({err:error.message})
//     }
// }
//   }
 // )
 router.post('/addtocart', async (req, res) => {
    const { medicineId, quantity } = req.body;
    
    try {
        const userId = req.session.userId;
        // const userId = "6573e1bab6a517c2e59f02da";
       let user = await userModel.findOne({ _id: userId });
       let medicinef = await medicineModel.findOne({ _id: medicineId });
       const medicine = await medicineModel.findById(medicinef._id)
      //const user= await userModel.findOne({_id:"6573e1bab6a517c2e59f02da"})

        if (user == null) {
            // throw new Error("User not found. Maybe Session timed out.")
            return res.redirect('/login');
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
        
            user = await userModel.findOne({ _id: userId });

            console.log("Updated quantity:", user.cart[cartItemIndex].quantity);
           
           
        } else {
            // If the medicine is not in the cart, add it with the specified quantity
            console.log("m")
            let medicinef = await medicineModel.findOne({ _id: medicineId });
            const medicine = await medicineModel.findById(medicinef._id)
            console.log("here")
            const cartItem = await cartModel.create({ medicine: medicine, quantity: quantity });
            console.log("m")
            user.additemTocart(cartItem);
            console.log("m")
            await cartItem.save();
        }

        // Save the updated user document with the new or updated cart
        await user.save();
       
       // console.log(user.cart[cartItemIndex].quantity)

        res.status(200).json({ message: 'Item added/updated in the cart successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  router.post('/deletefromcart', async (req,res) => {
    
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

        }
        
        else {
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
    })
    

  router.get('/viewcart', async (req,res) => {
    const userId = req.session.userId;

    
    console.log("1")
    try {
      let user = await userModel.findOne({_id: userId});
      console.log("1")
      if (user == null) {
        throw new Error("User not found. Maybe Session timed out.")
      }
      console.log("1")
      const cart = user.viewcartt();
      console.log("1")
     return res.status(200).json(cart);
     // res.render('user',{cart})
    } catch(error) {
      res.status(400).json({err:error.message})
    }
  })
 
  router.put('/editquantity', async (req, res) => {
    const {medicineId, quantity } = req.body;
    try{
        const userId = req.session.userId;
   
    let user = await userModel.findOne({ _id: userId });
    let medicinef = await medicineModel.findOne({ _id: medicineId });
    const medicine = await medicineModel.findById(medicinef._id)
    if (user == null) {
        // throw new Error("User not found. Maybe Session timed out.")
        return res.redirect('/login');
    }
    if (quantity> medicine.quantity){
        return res.status(500).json({ error: "the pharmacy does not have all this quantity" });

    }
    const cart = user.cart;
    const cartItemIndex = cart.findIndex(item => item.medicine._id == medicineId);
    console.log(quantity)
    await userModel.updateOne(
        { _id: userId, 'cart.medicine._id': medicine._id },
        { $set: { 'cart.$.quantity':  quantity } });
        user.save()
        user = await userModel.findOne({ _id: userId });
 res.status(200).json({ message: 'Item added/updated in the cart successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }}

)

  
  
// router.post('/addtocart', async (req, res) => {
//     try {
//       const { medicineId, quantity } = req.body;
//       const userId = "6542a7c335360dcbe722c2d8";
  
//       // Find the user's cart or create a new one if it doesn't exist
//       let cart = await cartModel.findOne({ user: userId });
  
//       if (!cart) {
//         cart = await cartModel.create({ user: userId, items: [] });
//       }
  
//       // Check if the medicine is already in the cart
//       const cartItem = cart.items.find(item => item.medicine.equals(medicineId));
  
//       // If the medicine is in the cart, update the quantity
//       if (cartItem) {
//         cartItem.quantity = quantity;
//       } else {
//         // If the medicine is not in the cart, add it with the specified quantity
//         cart.items.push({ medicine: medicineId, quantity });
//       }
  
//       // Save the updated cart
//       await cart.save();
  
//       res.status(200).json({ message: 'Cart updated successfully', cart });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: error.message });
//     }
//   });
  

 module.exports = router;
