import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/table.css';
import { useHistory } from 'react-router-dom';
const serverURL = process.env.REACT_APP_SERVER_URL

function GetPatients(){
  const [patients, setPatients]= useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${serverURL}/pharmacy/private/admin/user/patients`, {withCredentials: true});
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
                <td onClick={() => navigate(`/patient?id=${user._id}`)}>View</td>

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