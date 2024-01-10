import React, { useState, } from 'react'
import { BrowserRouter as Router, Route,Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
const serverURL = process.env.REACT_APP_SERVER_URL;

export default function VerifyEmail() {
    const [email,setEmail]=useState('');
    const [verificationMessage, setVerificationMessage] = useState('');
    const navigate=useNavigate();


    
    const handlesubmit =(e) =>{
        e.preventDefault();
      
        
          axios.post(`${serverURL}/clinic/public/user/verifyEmail`,{email})
          .then((res)=>{
            if (res.data.isVerified) {
              setVerificationMessage('')
              axios.post(`${serverURL}/clinic/public/user/sendOTP`,{email}).then((res)=>
            {const data = {email:email}
              navigate("/OTPVerifcation",{state:data})
            }).catch((error) =>{
              console.log(error)
            })

            } else {
              setVerificationMessage('Email is not exit . Please enter a correct email.');
            }          })
          .catch((error) =>{
            console.log(error)
          })    

    
    
      }

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handlesubmit}>
        <div className='form-group'>
          <div>
          <label htmlFor="email">Email</label>
          </div>
          <input name='email' type='text' placeholder='Enter your Email ' required onChange={(e)=>{setEmail(e.target.value)}}autoFocus></input>
        </div>
          <button type='submit'>Submit</button>


          {verificationMessage && <p>{verificationMessage}</p>}

        </form>
    </div>
  )
}
