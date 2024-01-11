import {React,useState} from 'react'
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import PasswordValidityBox from './PasswordValidityBox'
import { validatePassword } from '../functions/validatePassword'
const serverURL = process.env.REACT_APP_SERVER_URL;

export default function ResetPassword() {
  const [newPassword,setNewPassword]=useState('')
  const [confirmedNewpassword, setConfirmedNewpassword] = useState('');
  const [passwordMatch,setPasswordsMatch]= useState(true);
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [changeError, setChangeError] = useState('');
  let {state}=useLocation();
  const navigate=useNavigate();
  const email= state.email;

  const handlesubmit =(e) =>{
    e.preventDefault();
  
    if(newPassword === confirmedNewpassword)
    {
      setPasswordsMatch(true);
      axios.post(`${serverURL}/clinic/public/user/resetPassword`,{newPassword,email})
      .then((res)=>{
           console.log(res)
           setChangeSuccess(true);
           setChangeError('');
           alert("password changed successfully")
           navigate("/login")

      })
      .catch((error) =>{
        console.log(error)
        setChangeError(error.response?.data?.errors[0] || 'An error occurred');

      })    }
    else
    {
      setPasswordsMatch(false);
      setChangeSuccess(false);

    }


  }

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handlesubmit}>
        <div className='form-group'>
          <label htmlFor="newPassword">New Password</label>
          <input name='Password'type='password'  placeholder='Enter your new password' required onChange={(e)=>{setNewPassword(e.target.value)}} ></input>
        </div>
        <div>
        <PasswordValidityBox password={newPassword}></PasswordValidityBox>

        </div>
        <div className='form-group'>
          <label htmlFor="confirmedNewpassword">Confirmed New Password</label>
          <input name='ConfirmedNewPassword'type='password' placeholder='Enter your confirm password' required onChange={(e)=>{setConfirmedNewpassword(e.target.value)}} ></input>
        </div>
        {!passwordMatch && <p style={{color: 'red'}}>Pasword do not match. </p>}
        <div>
          <button className='btn btn-primary' type="submit" disabled={!validatePassword(newPassword)} >Submit</button>
        </div>
        <div>
        {changeError && <p style={{ color: 'red' }}>{changeError}</p>}
        </div>
      </form>
    </div>
  )
}
