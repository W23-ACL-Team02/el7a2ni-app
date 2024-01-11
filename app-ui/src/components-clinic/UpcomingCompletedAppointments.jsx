import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/addAdmin.css';
const serverURL = process.env.REACT_APP_SERVER_URL

const UpcomingCompletedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clinic/private/user/upcomingCompletedAppointments', {withCredentials: true});
      setAppointments(response.data.filteredAppointments || []);
      setError('');
    } catch (error) {
      setError('Error fetching appointments. Please try again later.');
      console.error('Error fetching appointments:', error);
    }
  };

  // Function to format date as dd.mm.yyyy
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (time) => {
    const formattedTime = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return formattedTime;
  };
  return (
    <div className="container">
      <div className="rectangle2">
        <h2>Upcoming and Completed Appointments</h2>
        {/* {error && <p className="error-message">{error}</p>} */}
        {appointments.length === 0 ? (
          <p>No upcoming or completed appointments found.</p>
        ) : (
          <div className="appointment-list">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="appointment-container">
                <div className="rectangle">
                  <div className="medicine-info">
                    <div className="details">
                      <p>Date: {formatDate(appointment.date)}</p>
                    </div>
                    <div className="details">
                      <p>Start: {formatTime(appointment.start)}</p>
                    </div>
                    <div className="details">
                      <p>End: {formatTime(appointment.end)}</p>
                    </div>
                    <div className="details">
                      <p>Doctor: {appointment.doctorUsername}</p>
                    </div>
                    <div className="details">
                      <p>Patient: {appointment.patientUsername}</p>
                    </div>
                    <div className="details">
                      <p>Status: {appointment.status}</p>
                    </div>
                    {/* Add more appointment details as needed */}
                    <hr />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
  );
            }
  
          
  
export default UpcomingCompletedAppointments;
