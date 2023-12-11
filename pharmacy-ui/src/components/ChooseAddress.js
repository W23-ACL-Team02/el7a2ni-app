
//page for choosing address only (cart from previous page + make sure cart isn't empty)
//display all addresses+ pick address before continuing
//add address option!!!!!!!
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/orders.css';

function GetAddresses(){
  const [addresses, setAddresses]= useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/private/patient/order/viewaddress', {withCredentials: true});
        setAddresses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return(
    <div className='Container'>
      <div id="wrapper"> 
      <h3>Addresses:</h3>
      {
         addresses.length === 0 ? (
          <p>You don't have any saved addresses</p>
        ) : 
        addresses.map((address, index) => {
            return <div key={index}>
                <div id= "first">
                    <h2>Address number: {index+1}</h2>
                    <h3>Address Line 1:</h3>
                    <h3>Address Line 2:</h3>
                    <h3>Floor</h3>
                    <h3>Apartment</h3>
                    <h3>Postal Code</h3>
                    <h3>City</h3>
                    <h3>Country</h3>
                </div>
                <div id="second">
                    <br></br>
                    <br></br>
                    <h3>{address.addressline1}</h3>
                    <h3>{address.addressline2}</h3>
                    <h3>{address.floor}</h3>
                    <h3>{address.apartment}</h3>
                    <h3>{address.postalcode}</h3>
                    <h3>{address.city}</h3>
                    <h3>{address.country}</h3>
                </div>
                <button onClick={() => window.location.href=`/orderdetails?id=${address._id}`}>Choose Address</button>
            </div>
        })
      }
      <br></br>
      <br></br>
       <div>
        <button onClick={() => window.location.href='/addaddress'}>Add Address</button> 
      </div>

      </div>
    </div>

  )
}

export default GetAddresses;
