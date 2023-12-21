import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/orders.css';


function Orders(){

    const [orders, setOrders]= useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/private/patient/order/vieworders', {withCredentials: true});
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

//   const handleSubmit = async (id) => {
//     id.preventDefault();
  
//     try {
//       await axios.post(`http://localhost:3000/private/patient/order/cancelorder/${id}`);
//     } catch (err) {
//         console.log(err);
//     }
// };



  async function cancelOrder(id){
   
  console.log("here");
    try{
      await axios.post(`http://localhost:3000/private/patient/order/cancelorder/${id}`,{}, {withCredentials: true});
    } catch(err){
      console.log(err);
    }
  }
  
    return (
        <div className="container" id="wrapper">
            <h1>Your Orders</h1>
         
                {
                   orders.length === 0 ? (
                    <p>You haven't made any orders yet.</p>
                  ) : 
                        orders.map((order,index) => {
                          return <div key={order._id}>
                            
                           <h2>Order Number: {index+1}</h2> 
                <div id= "first">
                <h3>Medicine Details:</h3>
                <h3>Name:</h3>
                <h3>Details:</h3>
                <h3>Category:</h3>
                <h3>Quantity</h3>
                 </div>
                 <div id="second">
                {
                        order.items.map((type, index) => {
                        return <div key={index}>

                        <br></br>
                        <br></br>
                        <h4>{type.medicine.name}</h4>
                        <h4>{type.medicine.details}</h4>
                        <h4>{type.medicine.category}</h4>
                        <h4>{type.quantity}</h4>    
                        </div>
                    })}
                    </div>
              <div className="orderinfo" id="first">
                <h3>Total: </h3>
                <h3>Status: </h3>
                <h3>Delivery Address</h3>
                <div className="address">
                    <h4>Address line 1</h4>
                    <h4>Address line 2</h4>
                    <h4>Floor</h4>
                    <h4>Apartment</h4>
                    <h4>Postal code</h4>
                    <h4>City</h4>
                    <h4>Country</h4>
                </div>
              </div>
              <div className="orderdata" id="second">
                          
                    <h3>{order.total}</h3>
                    <h3>{order.status}</h3>
                <div className="addressinfo">
                { <div>
                   <br></br>
                    <h4>{order.address.addressline1}</h4>
                    <h4>{order.address.addressline2}</h4>
                    <h4>{order.address.floor}</h4>
                    <h4>{order.address.apartment}</h4>
                    <h4>{order.address.postalcode}</h4>
                    <h4>{order.address.city}</h4>
                    <h4>{order.address.country}</h4>
                    </div>
                }
                </div>
              </div>
             
              <button onClick={() => cancelOrder(order._id)}>Cancel Order</button>
          
              </div>
                          
         })
      }
            </div>
    )
}

export default Orders