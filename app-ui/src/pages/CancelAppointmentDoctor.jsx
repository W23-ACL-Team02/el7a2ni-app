
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/cancelAppointment.css';
const baseURL = process.env.REACT_APP_SERVER_URL;

const CancelAppointmentDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');

 const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${baseURL}/clinic/private/doctor/notCompletedDoctorAppointments`,{withCredentials:true});
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
        
      const response = await axios.post(`${baseURL}/clinic/private/doctor/cancelPatientAppointment`, {
        
            appointmentId: appointmentId // Sending appointmentId in the request body
            
           
          },{ withCredentials: true});
      
     // setMessage(response.data);
     // setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
     fetchAppointments();
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          // Extract the error message from the response object
          setMessage(error.response.data.errors);
        } else {
          // If error doesn't contain expected response structure, set a generic error message
          setMessage('An error occurred while cancelling the appointment.');
        }
      }
  };
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
    <h2>Doctor's Appointments</h2>
    <div className="medicines-list">
    {appointments.map(appointment => (
  <div key={appointment._id} className="medicine-container">
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
          <p>Patient: {appointment.patientUsername}</p>
        </div>
        <div className="details">
          <p>Doctor: {appointment.doctorUsername}</p>
        </div>
        <div className="details">
          <p>Status: {appointment.status}</p>
        </div>
        {/* Add more appointment details as needed */}
        <button id="button-id" onClick={() => handleCancelAppointment(appointment._id)}>Cancel</button>
        <hr />
      </div>
    </div>
  </div>
))}

    </div>
    <p>{message}</p>
    </div>
  </div>
);
};

export default CancelAppointmentDoctor;
