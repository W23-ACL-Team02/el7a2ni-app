import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/table.css';
import { useParams } from 'react-router-dom'
const serverURL = process.env.REACT_APP_SERVER_URL;


function GetPharmacist(){
  const [pharmacist, setPharmacist]= useState([]);
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  // const {id}= useParams;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${serverURL}/pharmacy/private/admin/user/pharmacist/${id}`, {withCredentials: true});
        setPharmacist(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);


  return(

    <div className='Container'>
    <div className='mt-3'> 
      <h3>Pharmacist's Information</h3>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Mobile</th>
            <th>Pay Rate</th>
            <th>Affiliation</th>
            <th>University Name</th>
            <th>Graduation Year</th>
          </tr>
        </thead>
        <tbody>
          <tr key={pharmacist._id}>
           <td>{pharmacist.name}</td>
            <td>{pharmacist.username}</td>
            <td>{pharmacist.email}</td>
            <td>{pharmacist.dateOfBirth}</td>
            <td>{pharmacist.gender}</td>
            <td>{pharmacist.mobile}</td>
            <td>{pharmacist.payRate}</td>
            <td>{pharmacist.affiliation}</td>
            <td>{pharmacist.education && pharmacist.education.name} </td>
           <td>{pharmacist.education && pharmacist.education.endYear} </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  );

}


export default GetPharmacist;