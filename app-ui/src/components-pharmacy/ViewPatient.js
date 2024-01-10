import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/table.css';
import { useParams } from 'react-router-dom'
const serverURL = process.env.REACT_APP_SERVER_URL


function GetPatient(){
  const [patient, setPatient]= useState([]);
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  // const {id}= useParams;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${serverURL}/pharmacy/private/admin/user/patient/${id}`, {withCredentials: true});
        setPatient(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  return(

    <div className='Container'>
    <div className='mt-3'> 
      <h3>Patient's Information</h3>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Mobile</th>
            <th>Emergency Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr key={patient._id}>
           <td>{patient.name}</td>
            <td>{patient.username}</td>
            <td>{patient.email}</td>
            <td>{patient.dateOfBirth}</td>
            <td>{patient.gender}</td>
            <td>{patient.mobile}</td>
            <td>{patient.emergencyContact && patient.emergencyContact.name} <br></br>
            {patient.emergencyContact && patient.emergencyContact.mobile} <br></br>
            {patient.emergencyContact && patient.emergencyContact.relation} </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  );

}


export default GetPatient;