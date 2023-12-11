import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/orders.css';
//show order details aka cart + address + total
//button redirects to payment page



function GetOrder(){
  const [cart, setCart]= useState([]);
  const [address, setAddress]= useState([]);
  const [total, setTotal]= useState([]);
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  // const {id}= useParams;\


  useEffect(() => {
    const chooseAddress = async () => {
        try{
           await axios.post(`http://localhost:3000/private/patient/order/chooseaddress/${id}`, {withCredentials: true});
        }
        catch(err){
            console.log(err)
        }
    }
    const getAddress = async () => {
        try {
            const res1 = await axios.get('http://localhost:3000/private/patient/order/getaddress', {withCredentials: true});
            setAddress(res1.data);
            console.log("address is set to ")
            console.log(address);
          } catch (err) {
            console.log(err);
          }
    }
    const getTotal = async () => {
        try {
            const res = await axios.get('http://localhost:3000/private/patient/order/gettotal', {withCredentials: true});
            setTotal(res.data);
          } catch (err) {
            console.log(err);
          }
    }
    const fetchData = async () => {
      try {
        const res2 = await axios.get('http://localhost:3000/private/patient/cart/viewcart', {withCredentials: true}); //monika
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
        {cart.length === 0 ? (
          <p>Cart is Empty.</p>
        ) : 
                cart.map((item,index) => {
                  return <div key={index}>
        <div id= "first">
        <h3>Medicine Details:</h3>
         <h3>Name:</h3>
         <h3>Details:</h3>
         <h3>Category:</h3>
         <h3>Quantity</h3>
         </div>
         <div id="second">
          <br></br>
          <br></br>
            <h4>{item.medicine.name}</h4>
            <h4>{item.medicine.details}</h4>
            <h4>{item.medicine.category}</h4>
            <h4>{item.quantity}</h4>
            {displayImage(item.medicine.imageUrl)}
            </div>
      </div>
                  
 })
}

<div className="orderinfo" id="first">
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
        <div className="addressinfo">
        { <div>
          <br></br>
           <br></br>
           <br></br>
            <h4>{address.addressline1}</h4>
            <h4>{address.addressline2}</h4>
            <h4>{address.floor}</h4>
            <h4>{address.apartment}</h4>
            <h4>{address.postalcode}</h4>
            <h4>{address.city}</h4>
            <h4>{address.country}</h4>
            </div>
        }
        </div>
      </div>
      <br></br>
      <div id="first">
        <h3>Order Total:</h3>
      </div>
      <div id="second">
        {
           <h3>{total}</h3>
        }
      </div>
      <div>
        <button onClick={() => window.location.href='/medicine-payment'}>Continue</button> 
        {/* TODO: change to khatib's page */}
      </div>
    </div>
  );

}


export default GetOrder;