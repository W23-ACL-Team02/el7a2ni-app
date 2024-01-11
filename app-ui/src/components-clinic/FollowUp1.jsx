import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FollowUp1 = () => {
    const [appts, setAppts] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/clinic/private/patient/loadFollowUpPage',{withCredentials:true});
        setAppts(response.data.appts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const openApptPage = async (patname, relationship, docname, docspec, doctimeslots, date, prevapptID) => {
    localStorage.setItem('patname', patname);
    localStorage.setItem('relationship', relationship);
    localStorage.setItem('docname', docname);
    localStorage.setItem('docspec', docspec);
    localStorage.setItem('doctimeslots', JSON.stringify(doctimeslots));
    localStorage.setItem('date', date);
    localStorage.setItem('prevapptID', prevapptID);
    console.log(localStorage.getItem('doctimeslots'));
    navigate('/FollowUp2');
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}-${month}-${year} / ${hours}:${minutes}`;
  };

  return (
    <div>
      <h2>Possible Follow Up Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Relationship</th>
            <th>Doctor Name</th>
            <th>Doctor Speciality</th>
            <th>Last Appointment Date</th>
          </tr>
        </thead>
        <tbody>
          {appts.map((appt, index) => (
            <tr key={index}>
              <td>{appt.patname}</td>
              <td>{appt.relationship}</td>
              <td>{appt.docname}</td>
              <td>{appt.docspec}</td>
              <td>{formatDate(appt.date)}</td>
              <td>
              <button className="theButton" onClick={() => openApptPage(appt.patname, appt.relationship, appt.docname, appt.docspec, appt.doctimeslots, appt.date, appt.prevapptID)}>Schedule Follow Up</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  
};

export default FollowUp1;
