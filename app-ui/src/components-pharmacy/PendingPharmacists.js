import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/table.css';
import { useHistory } from 'react-router-dom';
import PendingPharmacistsButton from './PendingPharmacistsButton';

const baseURL = process.env.REACT_APP_SERVER_URL; // Replace with your backend URL

function GetPharmacists() {
  const [isActioned, setIsActioned] = useState(false);
  const [message, setMessage] = useState('');
  const [pharmacists, setPharmacists]= useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/pharmacy/private/admin/user/pendingpharmacists', {withCredentials: true});
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
      {isActioned && <h2>{message}</h2>}
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
            <th></th>
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
                <td>
                  <PendingPharmacistsButton _id={user._id} setIsActioned={setIsActioned} setMessage={setMessage}/>
                </td>
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