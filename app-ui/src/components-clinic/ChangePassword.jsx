import React, { useEffect, useState } from 'react'
import PasswordValidityBox from '../components-pharmacy/PasswordValidityBox'
import { validatePassword } from '../functions/validatePassword'
import axios from 'axios'
const serverURL = process.env.REACT_APP_SERVER_URL;

export default function ChangePassword() {

  const [oldPassword,setOldPassword]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [confirmedNewpassword, setConfirmedNewpassword] = useState('');
  const [passwordMatch,setPasswordsMatch]= useState(true);
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [changeError, setChangeError] = useState('');


  const handlesubmit =(e) =>{
    e.preventDefault();
  
    if(newPassword === confirmedNewpassword)
    {
      setPasswordsMatch(true);
      axios.post(`${serverURL}/clinic/private/user/changePassword`,{oldPassword,newPassword,confirmedNewpassword},{withCredentials: true})
      .then((res) => {
        console.log(res);
        setChangeSuccess(true);
        setChangeError('');
      })
      .catch((error) => {
        console.log(error);
        setChangeSuccess(false);
        setChangeError(error.response?.data?.errors[0] || 'An error occurred');
      });
  } else {
    setPasswordsMatch(false);
    setChangeSuccess(false);
  }


  }

  
  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handlesubmit}>
        <div className='form-group'>
          <label htmlFor="oldPassword">Old Password</label>
          <input name='oldPassword' type='text' placeholder='Enter your old password' required onChange={(e)=>{setOldPassword(e.target.value)}}autoFocus></input>
        </div>

        <div className='form-group'>
          <label htmlFor="newPassword">New Password</label>
          <input name='newPassword'type='text' placeholder='Enter your new password' required onChange={(e)=>{setNewPassword(e.target.value)}} ></input>
        </div>
        <div>
        <PasswordValidityBox password={newPassword}></PasswordValidityBox>

        </div>
        <div className='form-group'>
          <label htmlFor="confirmedNewpassword">Confirmed New Password</label>
          <input name='ConfirmedNewPassword'type='text' placeholder='Enter your confirm password' required onChange={(e)=>{setConfirmedNewpassword(e.target.value)}} ></input>
        </div>
        {!passwordMatch && <p style={{color: 'red'}}>Pasword do not match. </p>}
        <div>
          <button className='btn btn-primary' type="submit">Submit</button>
        </div>
        {changeSuccess && <p style={{ color: 'green' }}>Password changed successfully.</p>}
      {changeError && <p style={{ color: 'red' }}>{changeError}</p>}
      </form>
    </div>
  )
}
