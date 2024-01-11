import axios from 'axios';
import React, { useEffect, useState } from 'react';
//import '../css/orders.css';
// import '../css/table.css';
import '../css/orders.css';
//show order details aka cart + address + total
//button redirects to payment page
import { useNavigate } from 'react-router';
const serverURL = process.env.REACT_APP_SERVER_URL 


function GetOrder(){
  const [cart, setCart]= useState([]);
  const [address, setAddress]= useState([]);
  const [total, setTotal]= useState([]);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  // const {id}= useParams;\


  useEffect(() => {
    const chooseAddress = async () => {
        try{
           await axios({
            method: 'post',
            url:`${serverURL}/pharmacy/private/patient/order/chooseaddress/${id}`, 
            withCredentials: true});
        }
        catch(err){
            console.log(err)
        }
    }
    const getAddress = async () => {
        try {
            const res1 = await axios.get(`${serverURL}/pharmacy/private/patient/order/getaddress`, {withCredentials: true});
            setAddress(res1.data);
            console.log("address is set to ")
            console.log(address);
          } catch (err) {
            console.log(err);
          }
    }
    const getTotal = async () => {
        try {
            const res = await axios.get(`${serverURL}/pharmacy/private/patient/order/gettotal`, {withCredentials: true});
            setTotal(res.data);
          } catch (err) {
            console.log(err);
          }
    }
    const fetchData = async () => {
      try {
        const res2 = await axios.get(`${serverURL}/pharmacy/private/patient/cart/viewcart`, {withCredentials: true}); //monika
        setCart(res2.data);
        console.log("cart is set to ")
        console.log(cart);
      } catch (err) {
        console.log(err);
      }
    };

    chooseAddress();
    fetchData();
    getAddress();
    getTotal();
  }, [id]);

      
const displayImage = (imageData) => {
  if (!imageData) {
    return null; // Return null if image data is not available
  }

  const imageType = typeof imageData === 'string' ? imageData.substring(5, imageData.indexOf(';')) : '';
  const imageSrc = `data:image/${imageType};base64,${imageData}`;

  // CSS styles for the image container
  const imageContainerStyle = {
    width: '80px', // Adjust the width as needed
    height: '80px', // Adjust the height as needed
    border: '1px solid #ccc',
    
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 10px 10px 0', // Adjust margins for spacing between images and list items
  };

  // CSS styles for the image itself
  const imageStyle = {
    maxWidth: '100%', // Ensure the image doesn't exceed the container width
    maxHeight: '100%', // Ensure the image doesn't exceed the container height
    objectFit: 'cover', // Maintain aspect ratio and cover the container
  };

  return (
    <div style={imageContainerStyle}>
      <img src={imageSrc} alt="Medicine" style={imageStyle} />
    </div>
  );
};

 

  return(

    <div className="container" id="wrapper">
    <h1>Your Order</h1>

    <div id="maincontainer">
      <div className="medicines-list">
      {cart.length === 0 ? (
          <p>Cart is Empty.</p>
        ) : 
        cart.map((item,index) => (
          <div className="medicine-container" key={index}>
          
            <div className='rectangle'>
              <div className="medicine-info">
                <img src={item.medicine.imageUrl} alt="no image available" />
                <div className="details">
                  <p className="name">{item.medicine.name}</p>
               </div>
               <div className="details">
               <p> {item.medicine.category}</p>
               </div>
               <div className="details">
               <p> {item.quantity}</p>
               </div>
              </div>
        
            </div>
          </div>
        ))
}
      </div>
  
    </div>
                  
                  <div id="address-container">
                  <p>Total: {total}</p>
                         <p>Address line 1: {address.addressline1}</p>
                         <p>Address line 2: {address.addressline1}</p>
                         <p>Floor: {address.floor}</p>
                         <p>Apartment: {address.apartment}</p>
                         <p>Postal code: {address.postalcode}</p>
                         <p>City: {address.city}</p>
                         <p>Country: {address.country}</p>
                        
                      </div>
                      <div className="button-container">
                    
        <button id="button" onClick={() => navigate('/medicine-payment')}>Continue</button> 
                         </div>
            
   </div>
  );

}


export default GetOrder;