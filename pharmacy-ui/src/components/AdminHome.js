import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import '../css/adminhome.css';


function AdminHome(){
    const navigate = useNavigate();

    const navigateToPatients = () => {
      navigate('/patients');
    };
    const navigateToPharmacists = () => {
        navigate('/pharmacists');
      };
      const navigateToPending = () => {
        navigate('/pendingpharmacists');
      };
    //TODO: add rest of navigations
    return(
        <div className="container">
    <button onClick={navigateToPatients}>View Patients' Information</button>
    <br></br>
  
        <button onClick={navigateToPharmacists}>View Pharmacists' Information</button>
        <br></br>
        
   
        <button onClick={navigateToPending}>View Pending Pharmacists' Information</button>
        </div>
    )
}

export default AdminHome