import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FollowUp1 = () => {
    const [appts, setAppts] = useState([]);

  useEffect(() => {
    // Fetch data from your API endpoint using Axios
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/private/patient/loadFollowUpPage');
        setAppts(response.data.appts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const openApptPage = async (patname, relationship, docname, docspec, date, prevapptID) => {
    localStorage.setItem('patname', patname);
    localStorage.setItem('relationship', relationship);
    localStorage.setItem('docname', docname);
    localStorage.setItem('docspec', docspec);
    localStorage.setItem('date', date);
    localStorage.setItem('prevapptID', prevapptID);
    navigate('/FollowUp2');
  }

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
                <td>
                    <button className="theButton" onClick={() => openApptPage(appt.patname, appt.relationship, appt.docname, appt.docspec, appt.date, appt.prevapptID)}>Schedule Follow Up</button>
                </td>
              <td>{appt.patname}</td>
              <td>{appt.relationship}</td>
              <td>{appt.docname}</td>
              <td>{appt.docspec}</td>
              <td>{new Date(appt.date).toLocaleTimeString('en-DE', { hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  
};

export default FollowUp1;
