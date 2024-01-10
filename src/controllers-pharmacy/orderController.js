const addressModel=require("../models/address.js");
const orderModel= require('../models/order.js');
const medicineModel= require('../models/medicine.js');
const userModel= require('../models/user.js');

module.exports = {
    getAddress: async (req,res) => {
        try {
            const userId= req.session.userId;
            const user= await userModel.findById(userId)

            const addressId= user.deliveryAddress;
            const address= await addressModel.findById(addressId);

            return res.status(200).json(address)
        } catch(err){
            res.status(400).json({err:err.message})
        }
    },
    getOrderTotal: async (req,res) => {
        try {
            const userId= req.session.userId;
            //const userId = "656ce9c8b124eef75091fb39";

            const user= await userModel.findById(userId)
            const cart= user.cart

            let totalprice= 0;
            for (var i in cart) {
                const medicineId= cart[i].medicine._id
                const medicine = await medicineModel.findById(medicineId);
                const price= medicine.price;
                const price2= price * cart[i].quantity;
                totalprice= totalprice + price2;
            }

            return res.status(200).json(totalprice)
        } catch(error) {
            res.status(400).json({err:error.message})
        }
    },
    addAddress: async(req,res) => { 
        //initialize empty address array at registration
        //adding address to database
        const {addressline1, addressline2, floor, apartment, postalcode, city, country} = req.body;
    
        try {
            const address =  await addressModel.create({
                addressline1: addressline1, 
                addressline2: addressline2, 
                floor: floor, 
                apartment: apartment,
                postalcode: postalcode, 
                city: city, 
                country: country
            });
            
            const userId = req.session.userId;
            const user= await userModel.findById(userId)
            
            if (user == null) {
                res.status(402).json({err:error.message})
            }
        
            //add address
            user.addAddress(address);
            
            await address.save()
            await user.save()
            res.status(200).json({ successes: ["address added succesfully"] })
        } catch(error) {
            console.log({err:error.message});
            res.status(400).json({ errors: [error.message] })
        }
    },
    viewAddress: async(req,res) => { // just displays available addresses and lets user choose one of them
        try {
            const userId= req.session.userId; 
            const patient = await userModel.findById(userId);
            const addresses= patient.addresses;
            await patient.save()
            
            return res.status(200).json(addresses);
        } catch(error) {
            res.status(400).json({err: error.message});
        }
    },
    chooseAddress: async(req,res) => { //address id is passed through params
        try {
           const userId = req.session.userId; 
            //const user = await userModel.findById(userId);
            const addressId = req.params.id; //if cart is empty, can't choose address

            //set deliveryaddress in user to addressId
            const user = await userModel.findByIdAndUpdate(userId, {deliveryAddress: addressId});
            const address = await addressModel.findById(addressId);
            
            await user.save()
            res.status(200).json(address) //redirect to page with all info, then checkout
        } catch(error) {
            res.status(400).json({err: error.message});
        } 
    },
    viewOrders: async(req,res) => {
        try {
           const userId= req.session.userId; 
            const user= await userModel.findById(userId);
            const orders= user.orders;
            res.status(200).json(orders);
        } catch(error){
            res.status(400).json({err:error.message})
        }
    },
    cancelOrder: async(req,res) => { //order id as param
        //same as choosing address: find order with id in user's orders database and change status to cancelled
      
        try{
           const userId= req.session.userId; 
            const user= await userModel.findById(userId);
         
            const orderId= req.params.id;
            const order= await orderModel.findById(orderId);
            const amount= order.total;
            const cashOnDelivery= order.COD; //? why coloured diffirently
            if(!cashOnDelivery){
                user.addToWallet(amount)
            }
           
            const orderId2= order._id

            const result = await userModel.findOneAndUpdate(
                { _id: userId, 'orders._id': orderId2 },
                { $set: { 'orders.$.status': 'cancelled' } } // ? doesn't work?
            );

            let updated= await orderModel.findByIdAndUpdate(orderId, {status: "cancelled"})
            await updated.save();
        
            const orders=user.orders
            
            let sales=0;
            //inc quantity by sales, dec sales by sales
            for(var i in orders){
                if(orders[i]._id.equals(orderId)) {
                    for(var j in orders[i].items){
                        let medicineId= orders[i].items[j].medicine._id;
                        const medicine= await medicineModel.findById(medicineId);
                        medicine.decrementSales(orders[i].items[j].quantity);
                        medicine.incrementQuantity(orders[i].items[j].quantity);
                        await medicine.save();
                    }
                    
                    break;
                }
            }
            await user.save();
        
        
            res.status(200).json({ successes: ["order cancelled sucessfully"] })
        } catch(error){
            res.status(400).json({ errors: [error.message] })
        }
    },
    placeOrder: async(req,res) => {
        try {
            const cashOnDelivery= req.body.COD;
            const userId= req.session.userId;
            const user= await userModel.findById(userId);
            const cart=user.cart
            const address= await addressModel.findById(user.deliveryAddress);
            let totalprice= 0;
            for (var i in cart) {
                const medicineId= cart[i].medicine._id
                const medicine = await medicineModel.findById(medicineId);
                const price= medicine.price;
                const price2= price * cart[i].quantity;
                totalprice= totalprice + price2;
                medicine.incrementSales(cart[i].quantity);
                medicine.decrementQuantity(cart[i].quantity);
                await medicine.save();
            }
            const order= await orderModel.create({items: cart, total: totalprice, address, status:"placed", COD: cashOnDelivery});
            await order.save()
            user.addOrder(order);
            user.emptyCart();
            await user.save();
            return res.status(200).json("order created");
        }
        catch(error) {
           return  res.status(400).json({err:error.message});
        }
    }
}
