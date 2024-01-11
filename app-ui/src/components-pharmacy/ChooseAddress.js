//page for choosing address only (cart from previous page + make sure cart isn't empty)
//display all addresses+ pick address before continuing
//add address option!!!!!!!
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/table.css';
import { useNavigate } from 'react-router';
const serverURL = process.env.REACT_APP_SERVER_URL 

function GetAddresses(){
  const [addresses, setAddresses]= useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${serverURL}/pharmacy/private/patient/order/viewaddress`, {withCredentials: true});
        setAddresses(res.data)
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return(
  <div className="container" id="wrapper">

      <h3>Addresses:</h3>
      <table className='table'>
      <thead>
          <tr>
          <th>Address Line 1:</th>
                    <th>Address Line 2:</th>
                    <th>Floor</th>
                    <th>Apartment</th>
                    <th>Postal Code</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>Choose</th>
          </tr>
        </thead>
        <tbody>
        {
         addresses.length === 0 ? (
          <p>You don't have any saved addresses</p>
        ) : 
        addresses.map((address, index) => {
            return <tr key={index}>
                    <td>{address.addressline1}</td>
                    <td>{address.addressline2}</td>
                    <td>{address.floor}</td>
                    <td>{address.apartment}</td>
                    <td>{address.postalcode}</td>
                    <td>{address.city}</td>
                    <td>{address.country}</td>
           
                <button id="buttonsmall" onClick={() => navigate(`/orderdetails?id=${address._id}`)}>Choose Address</button>
            </tr >
        })
      }
        </tbody>
      </table>

      <div className="button-container">
      <button id="button" onClick={() => navigate('/addaddress')}>Add Address</button>
      </div>
</div>



  )
}

export default GetAddresses;
