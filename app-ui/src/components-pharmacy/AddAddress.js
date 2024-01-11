//import '../css/orders.css';
import '../css/addaddress.css';
import React, { useEffect, useState } from 'react';
import axios from "axios"
const serverURL = process.env.REACT_APP_SERVER_URL 


function AddAddress() {

    const[addressline1, setAddressline1]= useState("");
    const[addressline2, setAddressline2]= useState("");
    const[floor, setFloor]= useState("");
    const[apartment, setApartment]= useState("");
    const[postalcode, setPostalcode]= useState("");
    const[city, setCity]= useState("");
    const[country, setCountry]= useState("");
    const [message, setMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response= await axios.post(`${serverURL}/pharmacy/private/patient/order/addaddress`, {
                addressline1,
                addressline2,
                floor,
                apartment,
                postalcode,
                city,
                country,
            }, {withCredentials: true});
            if (response && response.data && response.data.successes && response.data.successes.length > 0) {
                setMessage(response.data.successes[0]); // Display success message
              }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
                setMessage(error.response.data.errors[0]); // Display error message
              } else {
                setMessage('No error message found in the response'); // Handle scenario when error message is not present
              }
            //console.log(err);
        }
    };

 



    return(
        
        <div className="container">
            <div className="header">
                <div className="text">Add Address</div>
                <div className="underline"></div>
            </div>
            <form onSubmit={handleSubmit}>
            <div className="inputs">
                <div className="input">
                    <input type="text" placeholder="Address Line 1"
                    onChange={(e)=>{setAddressline1(String(e.target.value))}}/>
                </div>
                <div className="input">
                    <input type="text" placeholder="Address Line 2"
                    onChange={(e)=>{setAddressline2(String(e.target.value))}}/>
                </div>
                <div className="input">
                    <input type="text" placeholder="Floor"
                    onChange={(e)=>{setFloor(String(e.target.value))}}/>
                </div>
                <div className="input">
                    <input type="text" placeholder="Apartment"
                    onChange={(e)=>{setApartment(String(e.target.value))}}/>
                </div>
                <div className="input">
                    <input type="text" placeholder="Postal Code"
                    onChange={(e)=>{setPostalcode(String(e.target.value))}}/>
                </div>
                <div className="input">
                    <input type="text" placeholder="City"
                    onChange={(e)=>{setCity(String(e.target.value))}}/>
                </div>
                <div className="input">
                    <input type="text" placeholder="Country"
                    onChange={(e)=>{setCountry(String(e.target.value))}}/>
                </div>
            </div>
            <div className="submit-container">
                <button className="submit" type="submit" onClick={handleSubmit}>Add</button>
            </div>
            {message && <p>{message}</p>}
            </form>
        </div>
 
    )

    
}

export default AddAddress