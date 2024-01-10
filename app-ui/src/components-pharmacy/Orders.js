import axios from 'axios';
import React, { useEffect, useState } from 'react';
//import '../css/orders.css';
import '../css/table.css';
const serverURL = process.env.REACT_APP_SERVER_URL;


function Orders(){

    const [orders, setOrders]= useState([]);
    const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${serverURL}/pharmacy/private/patient/order/vieworders`, {withCredentials: true});
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
      const response= await axios.post(`${serverURL}/pharmacy/private/patient/order/cancelorder/${id}`,{}, {withCredentials: true});
      if (response && response.data && response.data.successes && response.data.successes.length > 0) {
        setMessage(response.data.successes[0]); // Display success message
      }
    } catch(error){
      if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
        setMessage(error.response.data.errors[0]); // Display error message
      } else {
        setMessage('No error message found in the response'); // Handle scenario when error message is not present
      }
     // console.log(err);
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
      <table className='table'>
        <thead>
          <tr>
            <th>Order No.</th>
            <th>Name</th>
            <th>Details</th>
            <th>Category</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {
             order.items.map((type, index) => {
              return <tr key={index}>
              <td>{index+1}</td>
              <td>{type.medicine.name}</td>
              <td>{type.medicine.details}</td>
              <td>{type.medicine.category}</td>
              <td>{type.quantity}</td>    
              </tr>
          })
        }
        
        </tbody>
      </table>
      <div id="address-container">
      <p>Total: {order.total}</p>
      <p>Status: {order.status}</p>
             <p>Address line 1: {order.address.addressline1}</p>
             <p>Address line 2: {order.address.addressline1}</p>
             <p>Floor: {order.address.floor}</p>
             <p>Apartment: {order.address.apartment}</p>
             <p>Postal code: {order.address.postalcode}</p>
             <p>City: {order.address.city}</p>
             <p>Country: {order.address.country}</p>
            
          </div>
          <div className="button-container">
             <button id="button" onClick={() => cancelOrder(order._id)}>Cancel Order</button>
             </div>    

      </div>
       }) 
}
{message && <p>{message}</p>}
      </div>
    )
}

export default Orders