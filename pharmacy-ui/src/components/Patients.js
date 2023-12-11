import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/table.css';
import { useHistory } from 'react-router-dom';

function GetPatients(){
  const [patients, setPatients]= useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/private/admin/user/patients', {withCredentials: true});
        setPatients(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return(
    <div className='Container'>
      <div className='mt-3'> 
      <h3>Patients' Information</h3>
      <table className='table'>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {
            patients.map((user) => {
              return <tr key={user._id} >
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td onClick={() => window.location.href=`/patient?id=${user._id}`}>View</td>

              </tr>
            })
          }
        </tbody>
      </table>
      </div>
    </div>

  )
}

export default GetPatients;