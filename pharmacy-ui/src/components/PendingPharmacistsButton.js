import axios from 'axios';
import React from 'react';
import '../css/table.css';

const baseURL = process.env.REACT_APP_SERVER_URL; // Replace with your backend URL

export default function PendingPharmacistsButton({_id, setIsActioned, setMessage}) {

  const acceptDoctor = () => {
    axios.put(`${baseURL}/private/admin/pendingPharmacists/approve`, { _id }, { withCredentials:true })
    .then((response) => {
        setMessage(response.data.successes[0]);
        setIsActioned(true);
    }).catch((error) => {
        setMessage(error.message);
        setIsActioned(true);
    })
  }

  const rejectDoctor = () => {
    axios.put(`${baseURL}/private/admin/pendingPharmacists/reject`, { _id }, { withCredentials:true })
    .then((response) => {
        setMessage(response.data.successes[0]);
        setIsActioned(true);
    }).catch((error) => {
        setMessage(error.message);
        setIsActioned(true);
    })
  }

  return(
    <div className='container-buttons'>
      <button type="button" className="btn success" onClick={acceptDoctor}>Accept</button>
      <button type="button" className="btn danger" onClick={rejectDoctor}>Reject</button>
    </div>              
  )
}