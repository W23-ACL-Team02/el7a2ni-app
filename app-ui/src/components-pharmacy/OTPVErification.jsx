import React, { useEffect,useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
export default function OTPVErification() {

  
  const [verificationCode, setVerificationCode] = useState('');
  let {state}=useLocation();
  const navigate=useNavigate();
  const [verificationMessage, setVerificationMessage] = useState('');

  const email= state.email;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/clinic/public/user/VerifyOTP",{verificationCode,email}).then((result)=>
  {
    if (result.data.isCodeVerified)
    {
      const data ={email:email}
      navigate("/ResetPassword",{state:data})
    }
    else{
      setVerificationMessage('Wrong OTP');
    }
  }).catch((error)=>
  {
   console.log(error)
  })
}

  return (
    <div>
    <h2>Code Verification</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="verificationCode">Verification Code</label>
        <input
          type="text"
          id="verificationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
      </div>
      <button type="submit">Verify Code</button>
    </form>
    <div>
    {verificationMessage && <p>{verificationMessage}</p>}
    </div>
  </div>
  )
}
