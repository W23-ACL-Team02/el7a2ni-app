import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/table.css';
import { useHistory } from 'react-router-dom';

function GetPharmacists(){
  const [pharmacists, setPharmacists]= useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/private/admin/user/pendingpharmacists', {withCredentials: true});
        setPharmacists(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return(
    <div className='Container'>
      <div className='mt-3'> 
      <h3>Pending Pharmacists' Information</h3>
      <table className='table'>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Mobile</th>
            <th>Gender</th>
            <th>Hourly Rate</th>
            <th>Affiliation</th>
            <th>Educational Background: <br></br>
            University Name</th>
            <th>Graduation Year</th>
          </tr>
        </thead>
        <tbody>
          {
            pharmacists.map((user) => {
              return <tr key={user._id} >
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.dateOfBirth}</td>
                <td>{user.mobile}</td>
                <td>{user.gender}</td>
                <td>{user.payRate}</td>
                <td>{user.affiliation}</td>
                <td>{user.education && user.education.name}</td>
                <td>{user.education && user.education.endYear}</td>

              </tr>
            })
          }
        </tbody>
      </table>
      </div>
    </div>

  )
}

export default GetPharmacists;